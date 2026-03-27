"use server";

import nodemailer from "nodemailer";

import { guardPublicSubmission } from "@/lib/contact-form-guard";

export type ContactResult =
  | { success: true }
  | { success: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_FIELD_LENGTHS = {
  company: 160,
  email: 320,
  fullName: 120,
  interest: 120,
  message: 5000
} as const;

function getTrimmedField(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value.trim() : "";
}

function exceedsMaxLength(value: string, maxLength: number) {
  return value.length > maxLength;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeHeaderValue(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export async function submitContactForm(
  formData: FormData
): Promise<ContactResult> {
  const fullName = getTrimmedField(formData, "fullName");
  const email = getTrimmedField(formData, "email");
  const company = getTrimmedField(formData, "company");
  const interest = getTrimmedField(formData, "interest");
  const message = getTrimmedField(formData, "message");

  if (!fullName || !email || !interest || !message) {
    return { success: false, error: "Please complete all required fields." };
  }

  if (!EMAIL_RE.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  if (
    exceedsMaxLength(fullName, MAX_FIELD_LENGTHS.fullName) ||
    exceedsMaxLength(email, MAX_FIELD_LENGTHS.email) ||
    exceedsMaxLength(company, MAX_FIELD_LENGTHS.company) ||
    exceedsMaxLength(interest, MAX_FIELD_LENGTHS.interest) ||
    exceedsMaxLength(message, MAX_FIELD_LENGTHS.message)
  ) {
    return {
      success: false,
      error: "One or more fields are too long. Please shorten your message and try again."
    };
  }

  const guardResult = await guardPublicSubmission(formData);

  if (!guardResult.ok) {
    if (guardResult.reason === "spam") {
      return { success: true };
    }

    return { success: false, error: guardResult.error };
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const destinationInbox = process.env.DESTINATION_INBOX;

  if (!gmailUser || !gmailAppPassword || !destinationInbox) {
    console.error("Contact form configuration is incomplete.");
    return {
      success: false,
      error: "The contact form is temporarily unavailable. Please try again later."
    };
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user: gmailUser,
      pass: gmailAppPassword
    }
  });

  const safeFullName = escapeHtml(fullName);
  const safeEmail = escapeHtml(email);
  const safeCompany = company ? escapeHtml(company) : "Not provided";
  const safeInterest = escapeHtml(interest);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  const subject = `[Basenote] ${sanitizeHeaderValue(
    interest
  )} enquiry from ${sanitizeHeaderValue(fullName)}`;

  const textBody = [
    "New contact enquiry",
    "",
    `Full name: ${fullName}`,
    `Email: ${email}`,
    `Company / Brand Name: ${company || "Not provided"}`,
    `Interest: ${interest}`,
    "",
    "Message:",
    message
  ].join("\n");

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; color: #0f1421;">
      <h2 style="margin: 0 0 12px;">New contact enquiry</h2>
      <p style="margin: 0 0 8px;"><strong>Full name:</strong> ${safeFullName}</p>
      <p style="margin: 0 0 8px;"><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
      <p style="margin: 0 0 8px;"><strong>Company / Brand Name:</strong> ${safeCompany}</p>
      <p style="margin: 0 0 16px;"><strong>Interest:</strong> ${safeInterest}</p>
      <p style="margin: 0 0 8px;"><strong>Message:</strong></p>
      <p style="margin: 0; white-space: normal;">${safeMessage}</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Basenote Contact" <${gmailUser}>`,
      to: destinationInbox,
      replyTo: email,
      subject,
      text: textBody,
      html: htmlBody
    });
  } catch (error) {
    console.error("Failed to send contact form email:", error);
    return {
      success: false,
      error: "Failed to send your enquiry. Please try again later."
    };
  }

  return { success: true };
}
