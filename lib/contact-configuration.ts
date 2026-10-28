import { PHASE_PRODUCTION_BUILD } from "next/constants";

const REQUIRED_VARIABLES = [
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  "TURNSTILE_SECRET_KEY",
  "TURNSTILE_ALLOWED_HOSTNAMES",
  "BREVO_API_KEY",
  "BREVO_SENDER_EMAIL",
  "DESTINATION_INBOX",
  "GOOGLE_SHEETS_CLIENT_EMAIL",
  "GOOGLE_SHEETS_PRIVATE_KEY",
  "GOOGLE_SHEETS_SPREADSHEET_ID",
] as const;

// Cloudflare's published testing keys must never reach a production build.
const TEST_KEYS = new Set([
  "1x00000000000000000000AA",
  "2x00000000000000000000AB",
  "1x00000000000000000000BB",
  "2x00000000000000000000BB",
  "3x00000000000000000000FF",
  "1x0000000000000000000000000000000AA",
  "2x0000000000000000000000000000000AA",
  "3x0000000000000000000000000000000AA",
]);

const PRODUCTION_HOSTNAMES = new Set([
  "www.basenotesolutions.com",
  "basenotesolutions.com",
]);

export function validateProductionContactConfig(
  phase: string,
  environment: Readonly<Record<string, string | undefined>>,
): void {
  if (phase !== PHASE_PRODUCTION_BUILD || environment.VERCEL_ENV !== "production") return;

  const invalid = new Set<string>(
    REQUIRED_VARIABLES.filter((key) => !environment[key]?.trim()),
  );

  for (const key of ["NEXT_PUBLIC_TURNSTILE_SITE_KEY", "TURNSTILE_SECRET_KEY"] as const) {
    if (TEST_KEYS.has(environment[key]?.trim() ?? "")) invalid.add(key);
  }

  const hostnames = new Set(
    (environment.TURNSTILE_ALLOWED_HOSTNAMES ?? "")
      .split(",")
      .map((hostname) => hostname.trim())
      .filter(Boolean),
  );
  if (
    hostnames.size !== PRODUCTION_HOSTNAMES.size ||
    [...hostnames].some((hostname) => !PRODUCTION_HOSTNAMES.has(hostname))
  ) {
    invalid.add("TURNSTILE_ALLOWED_HOSTNAMES");
  }

  if (invalid.size) {
    // Only names are safe to report: build errors are retained in hosting logs.
    throw new Error(`Invalid production enquiry configuration: ${[...invalid].join(", ")}`);
  }
}
