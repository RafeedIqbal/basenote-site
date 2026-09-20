import assert from "node:assert/strict";
import test, { type TestContext } from "node:test";

import { verifyTurnstile } from "@/lib/turnstile";
import { TURNSTILE_RESPONSE_FIELD } from "@/lib/turnstile-constants";

function configure(t: TestContext) {
  const previousSecret = process.env.TURNSTILE_SECRET_KEY;
  const previousHosts = process.env.TURNSTILE_ALLOWED_HOSTNAMES;
  process.env.TURNSTILE_SECRET_KEY = "test-only-secret";
  process.env.TURNSTILE_ALLOWED_HOSTNAMES = " www.basenotesolutions.com, basenotesolutions.com, ";
  t.after(() => {
    if (previousSecret === undefined) delete process.env.TURNSTILE_SECRET_KEY;
    else process.env.TURNSTILE_SECRET_KEY = previousSecret;
    if (previousHosts === undefined) delete process.env.TURNSTILE_ALLOWED_HOSTNAMES;
    else process.env.TURNSTILE_ALLOWED_HOSTNAMES = previousHosts;
  });
  const data = new FormData();
  data.set(TURNSTILE_RESPONSE_FIELD, "fresh-token");
  return data;
}

test("posts the token with a timeout and accepts the exact action and configured hostname", async (t) => {
  const data = configure(t);
  const signal = new AbortController().signal;
  const timeout = t.mock.method(AbortSignal, "timeout", () => signal);
  const request = t.mock.method(globalThis, "fetch", async (...[input, init]: Parameters<typeof fetch>) => {
    assert.equal(input, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
    assert.equal(init?.method, "POST");
    assert.equal(init?.cache, "no-store");
    assert.deepEqual(init?.headers, { "Content-Type": "application/x-www-form-urlencoded" });
    assert.equal(init?.signal, signal);
    assert.ok(init?.body instanceof URLSearchParams);
    assert.equal(init.body.get("secret"), "test-only-secret");
    assert.equal(init.body.get("response"), "fresh-token");
    return Response.json({ success: true, action: "contact", hostname: "basenotesolutions.com" });
  });
  assert.deepEqual(await verifyTurnstile(data), { ok: true });
  assert.equal(request.mock.callCount(), 1);
  assert.deepEqual(timeout.mock.calls[0].arguments, [10_000]);
});

for (const kind of ["missing", "empty", "whitespace", "file", "oversized", "duplicate"] as const) {
  test(`rejects a ${kind} token without calling Cloudflare`, async (t) => {
    const data = configure(t);
    if (kind === "missing") data.delete(TURNSTILE_RESPONSE_FIELD);
    if (kind === "empty") data.set(TURNSTILE_RESPONSE_FIELD, "");
    if (kind === "whitespace") data.set(TURNSTILE_RESPONSE_FIELD, "   ");
    if (kind === "file") data.set(TURNSTILE_RESPONSE_FIELD, new Blob(["token"]), "token.txt");
    if (kind === "oversized") data.set(TURNSTILE_RESPONSE_FIELD, "a".repeat(2049));
    if (kind === "duplicate") data.append(TURNSTILE_RESPONSE_FIELD, "second-token");
    const request = t.mock.method(globalThis, "fetch", async () => { throw new Error("Unexpected request"); });
    assert.equal((await verifyTurnstile(data)).ok, false);
    assert.equal(request.mock.callCount(), 0);
  });
}

for (const key of ["TURNSTILE_SECRET_KEY", "TURNSTILE_ALLOWED_HOSTNAMES"]) {
  test(`fails closed when ${key} is missing or blank`, async (t) => {
    const data = configure(t);
    const request = t.mock.method(globalThis, "fetch", async () => { throw new Error("Unexpected request"); });
    delete process.env[key];
    assert.equal((await verifyTurnstile(data)).ok, false);
    process.env[key] = " ";
    assert.equal((await verifyTurnstile(data)).ok, false);
    assert.equal(request.mock.callCount(), 0);
  });
}

const rejectedResponses: [string, unknown][] = [
  ["failed challenge", { success: false, "error-codes": ["invalid-input-response"] }],
  ["expired or replayed token", { success: false, "error-codes": ["timeout-or-duplicate"] }],
  ["invalid secret", { success: false, "error-codes": ["invalid-input-secret"] }],
  ["truthy success", { success: "true", action: "contact", hostname: "www.basenotesolutions.com" }],
  ["wrong action", { success: true, action: "login", hostname: "www.basenotesolutions.com" }],
  ["missing action", { success: true, hostname: "www.basenotesolutions.com" }],
  ["wrong hostname", { success: true, action: "contact", hostname: "attacker.example" }],
  ["hostname suffix", { success: true, action: "contact", hostname: "www.basenotesolutions.com.attacker.example" }],
  ["unlisted local hostname", { success: true, action: "contact", hostname: "localhost" }],
  ["missing hostname", { success: true, action: "contact" }],
  ["non-string hostname", { success: true, action: "contact", hostname: ["www.basenotesolutions.com"] }],
  ["null JSON", null],
  ["scalar JSON", true],
  ["array JSON", []],
];
for (const [label, result] of rejectedResponses) {
  test(`rejects ${label}`, async (t) => {
    const data = configure(t);
    t.mock.method(globalThis, "fetch", async () => Response.json(result));
    assert.equal((await verifyTurnstile(data)).ok, false);
  });
}

for (const failure of ["http", "invalid-json", "network", "timeout"] as const) {
  test(`fails closed on a provider ${failure} failure`, async (t) => {
    const data = configure(t);
    t.mock.method(globalThis, "fetch", async () => {
      if (failure === "http") return new Response("Unavailable", { status: 503 });
      if (failure === "invalid-json") return new Response("not JSON");
      if (failure === "timeout") throw new DOMException("Timed out", "TimeoutError");
      throw new TypeError("Network unavailable");
    });
    assert.equal((await verifyTurnstile(data)).ok, false);
  });
}
