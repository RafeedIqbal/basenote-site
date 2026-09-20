import "server-only";

import { JWT } from "google-auth-library";

export type EnquiryForm = "/contact" | "/private-label/guide";

export type ContactEnquiry = {
  id: string;
  receivedAt: string;
  form: EnquiryForm;
  fullName: string;
  email: string;
  company: string;
  interest: string;
  message: string;
  attachments: { filename: string; content: Buffer; contentType: string }[];
};

export const CONTACT_SHEET_HEADERS = [
  "Received at (UTC)",
  "Submission ID",
  "Form",
  "Full name",
  "Email",
  "Company / brand",
  "Area of interest",
  "Message / project details",
  "Attachment filenames",
] as const;

const DELIVERY_TIMEOUT_MS = 10_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class DeliveryError extends Error {
  constructor(readonly category: "configuration" | "http" | "response" | "sheet_headers", readonly status?: number) {
    super(category);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function readResponse(response: Response): Promise<Record<string, unknown>> {
  if (!response.ok) throw new DeliveryError("http", response.status);
  let result: unknown;
  try {
    result = await response.json();
  } catch {
    throw new DeliveryError("response");
  }
  if (!isRecord(result)) throw new DeliveryError("response");
  return result;
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function sanitizeHeaderValue(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

async function sendEmail(enquiry: ContactEnquiry) {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const sender = process.env.BREVO_SENDER_EMAIL?.trim();
  const recipient = process.env.DESTINATION_INBOX?.trim();
  if (!apiKey || !sender || !recipient || !EMAIL_RE.test(sender) || !EMAIL_RE.test(recipient)) {
    throw new DeliveryError("configuration");
  }

  const { fullName, email, company, interest, message } = enquiry;
  const textContent = [
    "New contact enquiry", "",
    `Full name: ${fullName}`,
    `Email: ${email}`,
    `Company / Brand Name: ${company || "Not provided"}`,
    `Interest: ${interest}`, "", "Message:", message, "",
    `Form: ${enquiry.form}`,
    `Received at (UTC): ${enquiry.receivedAt}`,
    `Submission ID: ${enquiry.id}`,
  ].join("\n");
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; color: #0f1421;">
      <h2 style="margin: 0 0 12px;">New contact enquiry</h2>
      <p><strong>Full name:</strong> ${escapeHtml(fullName)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p><strong>Company / Brand Name:</strong> ${escapeHtml(company || "Not provided")}</p>
      <p><strong>Interest:</strong> ${escapeHtml(interest)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      <p><strong>Form:</strong> ${escapeHtml(enquiry.form)}<br />
      <strong>Received at (UTC):</strong> ${escapeHtml(enquiry.receivedAt)}<br />
      <strong>Submission ID:</strong> ${escapeHtml(enquiry.id)}</p>
    </div>
  `;
  const result = await readResponse(await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      sender: { name: "Basenote Contact", email: sender },
      to: [{ email: recipient }],
      replyTo: { email, name: sanitizeHeaderValue(fullName) },
      subject: `[Basenote] ${sanitizeHeaderValue(interest)} enquiry from ${sanitizeHeaderValue(fullName)}`,
      textContent,
      htmlContent,
      ...(enquiry.attachments.length ? {
        attachment: enquiry.attachments.map(({ filename, content }) => ({
          name: filename,
          content: content.toString("base64"),
        })),
      } : {}),
    }),
    signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
    cache: "no-store",
  }));
  if (typeof result.messageId !== "string" || !result.messageId.trim()) {
    throw new DeliveryError("response");
  }
}

async function appendSheetRow(enquiry: ContactEnquiry) {
  const email = process.env.GOOGLE_SHEETS_CLIENT_EMAIL?.trim();
  const key = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim();
  if (!email || !key || !spreadsheetId) throw new DeliveryError("configuration");

  // One deadline bounds authentication, the header read, and the append together.
  const signal = AbortSignal.timeout(DELIVERY_TIMEOUT_MS);
  const client = new JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    transporterOptions: { timeout: DELIVERY_TIMEOUT_MS, signal, retry: false },
  });
  const { token } = await client.getAccessToken();
  if (!token) throw new DeliveryError("response");
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values`;
  const headerResult = await readResponse(await fetch(`${baseUrl}/${encodeURIComponent("'Sheet1'!A1:I1")}?valueRenderOption=FORMULA`, {
    headers, signal, cache: "no-store",
  }));
  const headerRow = Array.isArray(headerResult.values) ? headerResult.values[0] : undefined;
  if (!Array.isArray(headerRow) || headerRow.length !== CONTACT_SHEET_HEADERS.length ||
    CONTACT_SHEET_HEADERS.some((header, index) => headerRow[index] !== header)) {
    // Header setup is deliberate; never overwrite cells or guess a different tab.
    throw new DeliveryError("sheet_headers");
  }

  const result = await readResponse(await fetch(`${baseUrl}/${encodeURIComponent("'Sheet1'!A:I")}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      majorDimension: "ROWS",
      values: [[
        enquiry.receivedAt, enquiry.id, enquiry.form, enquiry.fullName, enquiry.email,
        enquiry.company, enquiry.interest, enquiry.message,
        enquiry.attachments.map(({ filename }) => filename).join(", "),
      ]],
    }),
    signal,
    cache: "no-store",
  }));
  if (!isRecord(result.updates) || result.updates.updatedRows !== 1) {
    throw new DeliveryError("response");
  }
}

export async function deliverContactEnquiry(enquiry: ContactEnquiry): Promise<boolean> {
  // Neither destination may prevent the other from receiving the enquiry.
  // Delivery writes are not retried: a timed-out write may already have succeeded.
  const results = await Promise.allSettled([sendEmail(enquiry), appendSheetRow(enquiry)]);
  const destinations = ["brevo", "google_sheets"] as const;
  results.forEach((result, index) => {
    if (result.status !== "rejected") return;
    const error: unknown = result.reason;
    const timedOut = error instanceof Error && ["TimeoutError", "AbortError"].includes(error.name);
    console.error("Contact delivery failed", {
      submissionId: enquiry.id,
      destination: destinations[index],
      category: error instanceof DeliveryError ? error.category : timedOut ? "timeout" : "provider",
      ...(error instanceof DeliveryError && error.status ? { status: error.status } : {}),
    });
  });
  return results.some((result) => result.status === "fulfilled");
}
