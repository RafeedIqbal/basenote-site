"use server";

import { processContactSubmission, type ContactResult } from "@/lib/contact-submission";

export type { ContactResult } from "@/lib/contact-submission";

export async function submitContactForm(formData: FormData): Promise<ContactResult> {
  return processContactSubmission(formData, "/contact");
}
