import "server-only";

import { randomUUID } from "node:crypto";
import { isIP } from "node:net";

import { cookies, headers } from "next/headers";

import { deliverContactEnquiry, NO_VISITOR_MATCH, type EnquiryForm, type VisitorMatch } from "@/lib/contact-delivery";
import { guardPublicSubmission } from "@/lib/contact-form-guard";
import { parseProjectImages } from "@/lib/private-label-project";

export type ContactResult =
  | { success: true }
  | { success: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTHS = { company: 160, email: 320, fullName: 120, interest: 120, message: 5000 } as const;

function getTrimmedField(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Meta's _fbc/_fbp cookies and the visitor's IP and user agent. The IP is the host's own
 * x-real-ip, else the first x-forwarded-for entry; cf-connecting-ip is ignored because a
 * client can set it on Vercel.
 */
export function visitorMatchFrom(
  cookieStore: { get(name: string): { value: string } | undefined },
  headerStore: { get(name: string): string | null },
): VisitorMatch {
  const forwarded = headerStore.get("x-forwarded-for")?.split(",")[0] ?? "";
  const clientIp = [headerStore.get("x-real-ip") ?? "", forwarded]
    .map((value) => value.trim())
    .find((value) => isIP(value) !== 0) ?? "";
  return {
    fbc: (cookieStore.get("_fbc")?.value ?? "").slice(0, 255),
    fbp: (cookieStore.get("_fbp")?.value ?? "").slice(0, 255),
    clientIp,
    userAgent: (headerStore.get("user-agent") ?? "").slice(0, 512),
  };
}

async function readVisitorMatch(): Promise<VisitorMatch> {
  try {
    const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
    return visitorMatchFrom(cookieStore, headerStore);
  } catch {
    // Outside a request (the Node test harness) there are no cookies or headers.
    return NO_VISITOR_MATCH;
  }
}

export async function processContactSubmission(formData: FormData, form: EnquiryForm): Promise<ContactResult> {
  const fields = {
    fullName: getTrimmedField(formData, "fullName"),
    email: getTrimmedField(formData, "email"),
    company: getTrimmedField(formData, "company"),
    interest: getTrimmedField(formData, "interest"),
    message: getTrimmedField(formData, "message"),
  };
  if (!fields.fullName || !fields.email || !fields.interest || !fields.message) {
    return { success: false, error: "Please complete all required fields." };
  }
  if (!EMAIL_RE.test(fields.email)) {
    return { success: false, error: "Please enter a valid email address." };
  }
  if ((Object.keys(MAX_FIELD_LENGTHS) as (keyof typeof MAX_FIELD_LENGTHS)[])
    .some((field) => fields[field].length > MAX_FIELD_LENGTHS[field])) {
    return { success: false, error: "One or more fields are too long. Please shorten your message and try again." };
  }

  const guardResult = await guardPublicSubmission(formData);
  if (!guardResult.ok) {
    if (guardResult.reason === "spam") return { success: true };
    return { success: false, error: guardResult.error };
  }
  const images = await parseProjectImages(formData);
  if (!images.ok) return { success: false, error: images.error };

  const received = await deliverContactEnquiry({
    ...fields,
    id: randomUUID(),
    receivedAt: new Date().toISOString(),
    form,
    attachments: images.attachments,
  }, await readVisitorMatch());
  return received ? { success: true } : {
    success: false,
    error: "Failed to send your enquiry. Please try again later.",
  };
}
