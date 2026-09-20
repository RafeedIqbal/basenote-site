import "server-only";

import { TURNSTILE_ACTION, TURNSTILE_RESPONSE_FIELD } from "@/lib/turnstile-constants";

type TurnstileResult = { ok: true } | { ok: false; error: string };

const VERIFICATION_ERROR = "Verification failed. Please try the security check again.";
const UNAVAILABLE_ERROR = "Verification is temporarily unavailable. Please try again shortly.";

export async function verifyTurnstile(formData: FormData): Promise<TurnstileResult> {
  const tokens = formData.getAll(TURNSTILE_RESPONSE_FIELD);
  const token = tokens[0];

  if (tokens.length !== 1 || typeof token !== "string" || !token.trim() || token.length > 2048) {
    return { ok: false, error: VERIFICATION_ERROR };
  }

  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const hostnames = new Set(
    (process.env.TURNSTILE_ALLOWED_HOSTNAMES ?? "")
      .split(",")
      .map((hostname) => hostname.trim())
      .filter(Boolean),
  );

  if (!secret || hostnames.size === 0) {
    return { ok: false, error: UNAVAILABLE_ERROR };
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!response.ok) return { ok: false, error: UNAVAILABLE_ERROR };

    const result: unknown = await response.json();
    if (
      typeof result !== "object" || result === null ||
      !("success" in result) || result.success !== true ||
      !("action" in result) || result.action !== TURNSTILE_ACTION ||
      !("hostname" in result) || typeof result.hostname !== "string" ||
      !hostnames.has(result.hostname)
    ) {
      return { ok: false, error: VERIFICATION_ERROR };
    }
    return { ok: true };
  } catch {
    // Do not log request bodies, tokens, secrets, or upstream response text.
    return { ok: false, error: UNAVAILABLE_ERROR };
  }
}
