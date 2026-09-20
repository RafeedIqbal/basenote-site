"use server";

import { processContactSubmission, type ContactResult } from "@/lib/contact-submission";
import { parseProjectDetails } from "@/lib/private-label-project";

export async function submitPrivateLabelProject(
  formData: FormData,
): Promise<ContactResult> {
  const details = parseProjectDetails(formData);
  if (!details.ok) return { success: false, error: details.error };
  // The shared service applies the guard before buffering images or either delivery.
  const enquiry = new FormData();
  for (const [key, value] of formData.entries()) enquiry.append(key, value);
  enquiry.set("fullName", details.fullName);
  enquiry.set("email", details.email);
  enquiry.set("interest", "Private Label");
  enquiry.set("message", details.message);
  return processContactSubmission(enquiry, "/private-label/guide");
}
