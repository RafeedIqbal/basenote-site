"use server";

import { submitContactForm, type ContactResult } from "@/app/actions/contact";
import { parseProjectDetails } from "@/lib/private-label-project";

export async function submitPrivateLabelProject(
  formData: FormData,
): Promise<ContactResult> {
  const details = parseProjectDetails(formData);
  if (!details.ok) return { success: false, error: details.error };
  // The shared action applies the live form guard before buffering images or sending mail.
  const enquiry = new FormData();
  for (const [key, value] of formData.entries()) enquiry.append(key, value);
  enquiry.set("fullName", details.fullName);
  enquiry.set("email", details.email);
  enquiry.set("interest", "Private Label");
  enquiry.set("message", details.message);
  return submitContactForm(enquiry);
}
