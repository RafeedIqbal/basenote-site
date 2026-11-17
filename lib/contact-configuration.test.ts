import assert from "node:assert/strict";
import test from "node:test";
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER } from "next/constants";

import { validateProductionContactConfig } from "@/lib/contact-configuration";
import createNextConfig from "@/next.config";

function configuration(): Record<string, string | undefined> {
  return {
    VERCEL_ENV: "production",
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: "production-site-key",
    TURNSTILE_SECRET_KEY: "private-production-secret",
    TURNSTILE_ALLOWED_HOSTNAMES: "www.basenotesolutions.com,basenotesolutions.com",
    RESEND_API_KEY: "private-resend-key",
    RESEND_SENDER_EMAIL: "sender@example.invalid",
    DESTINATION_INBOX: "recipient@example.invalid",
    GOOGLE_SHEETS_CLIENT_EMAIL: "service-account@example.invalid",
    GOOGLE_SHEETS_PRIVATE_KEY: "private-google-key",
    GOOGLE_SHEETS_SPREADSHEET_ID: "private-sheet-id",
  };
}

test("accepts complete production configuration", () => {
  assert.doesNotThrow(() => validateProductionContactConfig(PHASE_PRODUCTION_BUILD, configuration()));
});

for (const key of Object.keys(configuration()).filter((key) => key !== "VERCEL_ENV")) {
  for (const value of [undefined, "", " \n\t "]) {
    test(`production build rejects ${key} when ${value === undefined ? "missing" : value ? "whitespace" : "empty"}`, () => {
      const env = { ...configuration(), [key]: value };
      assert.throws(() => validateProductionContactConfig(PHASE_PRODUCTION_BUILD, env), {
        message: `Invalid production enquiry configuration: ${key}`,
      });
    });
  }
}

const testKeys = [
  "1x00000000000000000000AA",
  "2x00000000000000000000AB",
  "1x00000000000000000000BB",
  "2x00000000000000000000BB",
  "3x00000000000000000000FF",
  "1x0000000000000000000000000000000AA",
  "2x0000000000000000000000000000000AA",
  "3x0000000000000000000000000000000AA",
];

for (const [index, value] of testKeys.entries()) {
  test(`rejects published Turnstile test key ${index + 1}, including whitespace or the wrong key field`, () => {
    for (const key of ["NEXT_PUBLIC_TURNSTILE_SITE_KEY", "TURNSTILE_SECRET_KEY"]) {
      assert.throws(() => validateProductionContactConfig(PHASE_PRODUCTION_BUILD, {
        ...configuration(), [key]: ` ${value}\n`,
      }), { message: `Invalid production enquiry configuration: ${key}` });
    }
  });
}

for (const hostnames of [
  "www.basenotesolutions.com",
  "basenotesolutions.com",
  "www.basenotesolutions.com,*.basenotesolutions.com",
  "www.basenotesolutions.com,basenotesolutions.com,localhost",
  "www.basenotesolutions.com,basenotesolutions.com,127.0.0.1",
  "www.basenotesolutions.com,basenotesolutions.com,preview.vercel.app",
  "https://www.basenotesolutions.com,basenotesolutions.com",
  "www.basenotesolutions.com:443,basenotesolutions.com",
  "www.basenotesolutions.com/contact,basenotesolutions.com",
  "www.basenotesolutions.com.attacker.example,basenotesolutions.com",
]) {
  test(`rejects the production hostname configuration ${hostnames}`, () => {
    assert.throws(() => validateProductionContactConfig(PHASE_PRODUCTION_BUILD, {
      ...configuration(), TURNSTILE_ALLOWED_HOSTNAMES: hostnames,
    }), { message: "Invalid production enquiry configuration: TURNSTILE_ALLOWED_HOSTNAMES" });
  });
}

test("accepts reordered production hostnames with surrounding whitespace", () => {
  assert.doesNotThrow(() => validateProductionContactConfig(PHASE_PRODUCTION_BUILD, {
    ...configuration(),
    TURNSTILE_ALLOWED_HOSTNAMES: " basenotesolutions.com , www.basenotesolutions.com ",
  }));
});

test("reports every invalid variable without disclosing values", () => {
  const env = configuration();
  env.RESEND_API_KEY = "";
  env.GOOGLE_SHEETS_PRIVATE_KEY = undefined;
  env.TURNSTILE_ALLOWED_HOSTNAMES = "private-host.example";
  assert.throws(() => validateProductionContactConfig(PHASE_PRODUCTION_BUILD, env), {
    message: "Invalid production enquiry configuration: RESEND_API_KEY, GOOGLE_SHEETS_PRIVATE_KEY, TURNSTILE_ALLOWED_HOSTNAMES",
  });
});

for (const environment of [undefined, "development", "preview"]) {
  test(`does not require production credentials for ${environment ?? "local"} builds`, () => {
    assert.doesNotThrow(() => validateProductionContactConfig(PHASE_PRODUCTION_BUILD, {
      VERCEL_ENV: environment,
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: testKeys[0],
      TURNSTILE_ALLOWED_HOSTNAMES: "localhost",
    }));
  });
}

for (const phase of [PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_SERVER]) {
  test(`does not run the build preflight during ${phase}`, () => {
    assert.doesNotThrow(() => validateProductionContactConfig(phase, { VERCEL_ENV: "production" }));
  });
}

test("Next configuration invokes the guard before a production build", (t) => {
  const previous = { ...process.env };
  const env = configuration();
  t.after(() => {
    for (const key of Object.keys(env)) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  });
  Object.assign(process.env, env);
  delete process.env.TURNSTILE_SECRET_KEY;
  assert.throws(() => createNextConfig(PHASE_PRODUCTION_BUILD), {
    message: "Invalid production enquiry configuration: TURNSTILE_SECRET_KEY",
  });
  process.env.TURNSTILE_SECRET_KEY = env.TURNSTILE_SECRET_KEY;
  assert.equal(createNextConfig(PHASE_PRODUCTION_BUILD).experimental?.serverActions?.bodySizeLimit, "4mb");
});
