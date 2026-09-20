import {
  FORM_HONEYPOT_FIELD,
  FORM_SUBMITTED_AT_FIELD,
  MAX_SUBMISSION_AGE_MS,
  MIN_SUBMISSION_AGE_MS
} from "@/lib/form-guard-constants";
import { verifyTurnstile } from "@/lib/turnstile";

type GuardResult =
  | { ok: true }
  | { ok: false; reason: "invalid"; error: string }
  | { ok: false; reason: "spam" };

const REFRESH_MESSAGE =
  "The form expired before submission. Please refresh the page and try again.";

function getSubmissionAge(formData: FormData) {
  const submittedAt = formData.get(FORM_SUBMITTED_AT_FIELD);

  if (typeof submittedAt !== "string" || !submittedAt.trim()) {
    return null;
  }

  const timestamp = Number(submittedAt);

  if (!Number.isFinite(timestamp)) {
    return null;
  }

  return Date.now() - timestamp;
}

export async function guardPublicSubmission(
  formData: FormData
): Promise<GuardResult> {
  const honeypotValue = formData.get(FORM_HONEYPOT_FIELD);

  if (typeof honeypotValue === "string" && honeypotValue.trim()) {
    return { ok: false, reason: "spam" };
  }

  const submissionAge = getSubmissionAge(formData);

  if (submissionAge === null || submissionAge > MAX_SUBMISSION_AGE_MS) {
    return {
      ok: false,
      reason: "invalid",
      error: REFRESH_MESSAGE
    };
  }

  if (submissionAge < MIN_SUBMISSION_AGE_MS) {
    return { ok: false, reason: "spam" };
  }

  const verification = await verifyTurnstile(formData);
  if (!verification.ok) {
    return { ok: false, reason: "invalid", error: verification.error };
  }

  return { ok: true };
}
