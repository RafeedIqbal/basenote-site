import assert from "node:assert/strict";
import test, { type TestContext } from "node:test";
import nodemailer from "nodemailer";

import { submitContactForm } from "@/app/actions/contact";
import { submitPrivateLabelProject } from "@/app/actions/private-label-project";
import { FORM_HONEYPOT_FIELD, FORM_SUBMITTED_AT_FIELD } from "@/lib/form-guard-constants";
import { TURNSTILE_RESPONSE_FIELD } from "@/lib/turnstile-constants";

function setup(t: TestContext) {
  const environment = {
    TURNSTILE_SECRET_KEY: "test-only-secret",
    TURNSTILE_ALLOWED_HOSTNAMES: "www.basenotesolutions.com",
    GMAIL_USER: "test@example.invalid",
    GMAIL_APP_PASSWORD: "test-only-password",
    DESTINATION_INBOX: "test@example.invalid",
  };
  const previous = { ...process.env };
  Object.assign(process.env, environment);
  t.after(() => {
    for (const key of Object.keys(environment)) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  });
  const delivered: nodemailer.SendMailOptions[] = [];
  // Every action test replaces the transport before invoking the real handler.
  const transport = t.mock.method(nodemailer, "createTransport", () => ({
    sendMail: async (mail: nodemailer.SendMailOptions) => { delivered.push(mail); },
  }) as unknown as ReturnType<typeof nodemailer.createTransport>);
  const used = new Set<string>();
  const request = t.mock.method(globalThis, "fetch", async (...[, init]: Parameters<typeof fetch>) => {
    const token = (init?.body as URLSearchParams).get("response") ?? "";
    if (token === "invalid" || used.has(token)) {
      return Response.json({ success: false, "error-codes": ["timeout-or-duplicate"] });
    }
    used.add(token);
    return Response.json({ success: true, action: "contact", hostname: "www.basenotesolutions.com" });
  });
  const data = new FormData();
  data.set("fullName", "Test Visitor");
  data.set("email", "visitor@example.invalid");
  data.set("interest", "Private Label");
  data.set("message", "A test enquiry that must never leave this process.");
  data.set("spoken", "No");
  data.set("fragrance", "Not sure yet");
  data.set(FORM_SUBMITTED_AT_FIELD, String(Date.now() - 5000));
  data.set(TURNSTILE_RESPONSE_FIELD, "fresh-token");
  return { data, delivered, transport, request };
}

for (const [name, submit] of [
  ["contact", submitContactForm],
  ["guide", submitPrivateLabelProject],
] as const) {
  test(`${name} accepts a verified enquiry once, rejects replay, and accepts a fresh retry`, async (t) => {
    const h = setup(t);
    assert.deepEqual(await submit(h.data), { success: true });
    assert.equal(h.delivered.length, 1);
    assert.equal((await submit(h.data)).success, false);
    assert.equal(h.delivered.length, 1);
    h.data.set(TURNSTILE_RESPONSE_FIELD, "fresh-retry");
    assert.deepEqual(await submit(h.data), { success: true });
    assert.equal(h.delivered.length, 2);
    assert.equal(h.request.mock.callCount(), 3);
  });

  for (const token of ["missing", "invalid"]) {
    test(`${name} rejects a ${token} token before processing uploads or opening a mail transport`, async (t) => {
      const h = setup(t);
      if (token === "missing") h.data.delete(TURNSTILE_RESPONSE_FIELD);
      else h.data.set(TURNSTILE_RESPONSE_FIELD, "invalid");
      h.data.append("inspiration", new File(["not-a-png"], "test.png", { type: "image/png" }));
      const readImage = t.mock.method(File.prototype, "arrayBuffer", async () => { throw new Error("Image must not be read"); });
      const result = await submit(h.data);
      assert.equal(result.success, false);
      if (!result.success) assert.match(result.error, /verification/i);
      assert.equal(readImage.mock.callCount(), 0);
      assert.equal(h.transport.mock.callCount(), 0);
      assert.equal(h.delivered.length, 0);
    });
  }

  test(`${name} retains the honeypot and timing guards`, async (t) => {
    const h = setup(t);
    h.data.set(FORM_HONEYPOT_FIELD, "spam.example");
    assert.deepEqual(await submit(h.data), { success: true });
    h.data.delete(FORM_HONEYPOT_FIELD);
    h.data.set(FORM_SUBMITTED_AT_FIELD, String(Date.now()));
    assert.deepEqual(await submit(h.data), { success: true });
    h.data.set(FORM_SUBMITTED_AT_FIELD, String(Date.now() - 3 * 60 * 60 * 1000));
    assert.equal((await submit(h.data)).success, false);
    assert.equal(h.request.mock.callCount(), 0);
    assert.equal(h.transport.mock.callCount(), 0);
  });
}
