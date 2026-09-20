import assert from "node:assert/strict";
import test, { type TestContext } from "node:test";
import { JWT } from "google-auth-library";

import { submitContactForm } from "@/app/actions/contact";
import { submitPrivateLabelProject } from "@/app/actions/private-label-project";
import { CONTACT_SHEET_HEADERS } from "@/lib/contact-delivery";
import { FORM_HONEYPOT_FIELD, FORM_SUBMITTED_AT_FIELD } from "@/lib/form-guard-constants";
import { TURNSTILE_RESPONSE_FIELD } from "@/lib/turnstile-constants";

type Failure = "http" | "network" | "timeout" | "invalid-json" | "invalid-response";
type Options = { brevo?: Failure; sheet?: Failure; auth?: boolean; headers?: string[] };
type Request = { url: URL; init?: RequestInit };
type Mail = { sender: { name: string; email: string }; to: { email: string }[]; replyTo: { email: string; name: string }; subject: string; textContent: string; htmlContent: string; attachment?: { name: string; content: string }[] };

function setup(t: TestContext, options: Options = {}) {
  const environment = {
    TURNSTILE_SECRET_KEY: "test-only-secret",
    TURNSTILE_ALLOWED_HOSTNAMES: "www.basenotesolutions.com",
    BREVO_API_KEY: "test-only-brevo-key",
    BREVO_SENDER_EMAIL: "sender@example.invalid",
    DESTINATION_INBOX: "marketing@example.invalid",
    GOOGLE_SHEETS_CLIENT_EMAIL: "service-account@example.invalid",
    GOOGLE_SHEETS_PRIVATE_KEY: "test-only\\nprivate-key",
    GOOGLE_SHEETS_SPREADSHEET_ID: "test-only-spreadsheet",
  };
  const previous = { ...process.env };
  Object.assign(process.env, environment);
  t.after(() => {
    for (const key of Object.keys(environment)) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  });
  const logs = t.mock.method(console, "error", () => {});
  const authClients: JWT[] = [];
  // Auth and every HTTP request are stubbed before invoking the real actions.
  const auth = t.mock.method(JWT.prototype, "getAccessToken", async function (this: JWT) {
    authClients.push(this);
    if (options.auth) throw new Error("Private credentials must never be logged");
    return { token: "test-only-access-token" };
  });
  const requests: Request[] = [];
  const used = new Set<string>();
  t.mock.method(globalThis, "fetch", async (input: string | URL | globalThis.Request, init?: RequestInit) => {
    const url = new URL(input instanceof globalThis.Request ? input.url : input.toString());
    requests.push({ url, init });
    init?.signal?.throwIfAborted();
    if (url.hostname === "challenges.cloudflare.com") {
      const token = (init?.body as URLSearchParams).get("response") ?? "";
      if (token === "invalid" || used.has(token)) {
        return Response.json({ success: false, "error-codes": ["timeout-or-duplicate"] });
      }
      used.add(token);
      return Response.json({ success: true, action: "contact", hostname: "www.basenotesolutions.com" });
    }
    assert.ok(["api.brevo.com", "sheets.googleapis.com"].includes(url.hostname), "Unexpected network destination");
    assert.equal(init?.cache, "no-store");
    assert.ok(init?.signal instanceof AbortSignal);
    if (url.hostname === "sheets.googleapis.com" && init?.method !== "POST") {
      return Response.json({ values: [options.headers ?? CONTACT_SHEET_HEADERS] });
    }
    const failure = url.hostname === "api.brevo.com" ? options.brevo : options.sheet;
    if (failure === "http") return Response.json({ error: "Private upstream body" }, { status: 503 });
    if (failure === "network") throw new Error("Private upstream network details");
    if (failure === "timeout") throw new DOMException("Private upstream timeout details", "TimeoutError");
    if (failure === "invalid-json") return new Response("not-json", { status: 200 });
    if (failure === "invalid-response") return Response.json({});
    return url.hostname === "api.brevo.com"
      ? Response.json({ messageId: "test-message-id" }, { status: 201 })
      : Response.json({ updates: { updatedRows: 1 } });
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
  return {
    data, requests, auth, authClients, logs,
    emails: () => requests.filter(({ url }) => url.hostname === "api.brevo.com"),
    appends: () => requests.filter(({ url, init }) => url.hostname === "sheets.googleapis.com" && init?.method === "POST"),
    mail: () => JSON.parse(requests.find(({ url }) => url.hostname === "api.brevo.com")!.init!.body as string) as Mail,
    row: () => (JSON.parse(requests.find(({ url, init }) => url.hostname === "sheets.googleapis.com" && init?.method === "POST")!.init!.body as string) as { values: string[][] }).values[0],
  };
}

const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0]);
const jpg = Buffer.from([255, 216, 255, 0]);

for (const [name, submit, source] of [
  ["contact", submitContactForm, "/contact"],
  ["guide", submitPrivateLabelProject, "/private-label/guide"],
] as const) {
  test(`${name} delivers once, rejects token replay, and accepts a fresh submission`, async (t) => {
    const h = setup(t);
    h.data.set("form", "/untrusted-client-value");
    assert.deepEqual(await submit(h.data), { success: true });
    assert.equal(h.emails().length, 1);
    assert.equal(h.appends().length, 1);
    assert.equal(h.row()[2], source);
    const firstId = h.row()[1];
    assert.equal((await submit(h.data)).success, false);
    assert.equal(h.emails().length, 1);
    assert.equal(h.appends().length, 1);
    h.data.set(TURNSTILE_RESPONSE_FIELD, "fresh-retry");
    assert.deepEqual(await submit(h.data), { success: true });
    assert.equal(h.emails().length, 2);
    assert.equal(h.appends().length, 2);
    assert.notEqual((JSON.parse(h.appends()[1].init!.body as string) as { values: string[][] }).values[0][1], firstId);
  });

  for (const token of ["missing", "invalid"]) {
    test(`${name} rejects a ${token} token before uploads, authentication or delivery`, async (t) => {
      const h = setup(t);
      if (token === "missing") h.data.delete(TURNSTILE_RESPONSE_FIELD);
      else h.data.set(TURNSTILE_RESPONSE_FIELD, "invalid");
      h.data.append("inspiration", new File(["not-a-png"], "test.png", { type: "image/png" }));
      const readImage = t.mock.method(File.prototype, "arrayBuffer", async () => { throw new Error("Image must not be read"); });
      const result = await submit(h.data);
      assert.equal(result.success, false);
      if (!result.success) assert.match(result.error, /verification/i);
      assert.equal(readImage.mock.callCount(), 0);
      assert.equal(h.auth.mock.callCount(), 0);
      assert.equal(h.emails().length + h.appends().length, 0);
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
    assert.equal(h.requests.length, 0);
    assert.equal(h.auth.mock.callCount(), 0);
  });

  for (const [brevo, sheet, success] of [[true, false, true], [false, true, true], [true, true, false]] as const) {
    test(`${name} handles failures independently: Brevo=${brevo}, Sheets=${sheet}`, async (t) => {
      const h = setup(t, { brevo: brevo ? "http" : undefined, sheet: sheet ? "http" : undefined });
      assert.equal((await submit(h.data)).success, success);
      assert.equal(h.emails().length, 1);
      assert.equal(h.appends().length, 1);
      assert.equal(h.logs.mock.callCount(), Number(brevo) + Number(sheet));
      assert.match(JSON.stringify(h.logs.mock.calls), /submissionId/);
      assert.doesNotMatch(JSON.stringify(h.logs.mock.calls), /visitor@|test-only|Private upstream|A test enquiry/);
    });
  }

  test(`${name} sends safe JPG and PNG names and original bytes as attachments`, async (t) => {
    const h = setup(t);
    h.data.append("inspiration", new File([png], "../../private-name.png", { type: "image/png" }));
    h.data.append("inspiration", new File([jpg], "private-name.jpg", { type: "image/jpeg" }));
    assert.deepEqual(await submit(h.data), { success: true });
    assert.deepEqual(h.mail().attachment, [
      { name: "inspiration-1.png", content: png.toString("base64") },
      { name: "inspiration-2.jpg", content: jpg.toString("base64") },
    ]);
    assert.equal(h.row()[8], "inspiration-1.png, inspiration-2.jpg");
  });

  for (const [label, file] of [
    ["WebP", new File(["RIFF0000WEBP"], "test.webp", { type: "image/webp" })],
    ["disguised WebP", new File(["RIFF0000WEBP"], "test.png", { type: "image/png" })],
    ["mismatched MIME", new File([png], "test.jpg", { type: "image/jpeg" })],
    ["empty file", new File([], "test.png", { type: "image/png" })],
  ] as const) {
    test(`${name} rejects ${label} before either delivery`, async (t) => {
      const h = setup(t);
      h.data.append("inspiration", file);
      assert.equal((await submit(h.data)).success, false);
      assert.equal(h.emails().length + h.appends().length, 0);
      assert.equal(h.auth.mock.callCount(), 0);
    });
  }

  for (const scenario of ["count", "size"]) {
    test(`${name} retains the upload ${scenario} limit`, async (t) => {
      const h = setup(t);
      if (scenario === "count") {
        for (let index = 0; index < 4; index++) h.data.append("inspiration", new File([png], "test.png", { type: "image/png" }));
      } else {
        h.data.append("inspiration", new File([new Uint8Array(3 * 1024 * 1024 + 1)], "large.png", { type: "image/png" }));
      }
      assert.equal((await submit(h.data)).success, false);
      assert.equal(h.emails().length + h.appends().length, 0);
    });
  }
}

test("contact maps all fields, escapes HTML, sanitizes headers and stores formula-like text literally", async (t) => {
  const h = setup(t);
  h.data.set("fullName", "  Visitor\r\nBcc: someone  ");
  h.data.set("company", "=HYPERLINK(\"https://example.invalid\",\"company\")");
  h.data.set("message", "  <script>alert('x')</script>\n& next line  ");
  assert.deepEqual(await submitContactForm(h.data), { success: true });
  const row = h.row();
  assert.equal(new Date(row[0]).toISOString(), row[0]);
  assert.match(row[1], /^[a-f\d-]{36}$/);
  assert.deepEqual(row.slice(2), ["/contact", "Visitor\r\nBcc: someone", "visitor@example.invalid", "=HYPERLINK(\"https://example.invalid\",\"company\")", "Private Label", "<script>alert('x')</script>\n& next line", ""]);
  const mail = h.mail();
  assert.deepEqual(mail.sender, { name: "Basenote Contact", email: "sender@example.invalid" });
  assert.deepEqual(mail.to, [{ email: "marketing@example.invalid" }]);
  assert.deepEqual(mail.replyTo, { email: "visitor@example.invalid", name: "Visitor Bcc: someone" });
  assert.equal(mail.subject, "[Basenote] Private Label enquiry from Visitor Bcc: someone");
  assert.match(mail.htmlContent, /&lt;script&gt;alert\(&#39;x&#39;\)&lt;\/script&gt;<br \/>&amp; next line/);
  assert.ok(mail.textContent.includes(row[7]));
  assert.ok(mail.textContent.includes(row[1]));
  assert.equal(mail.attachment, undefined);
  assert.equal(h.appends()[0].url.searchParams.get("valueInputOption"), "RAW");
  assert.equal(h.appends()[0].url.searchParams.get("insertDataOption"), "INSERT_ROWS");
  assert.ok(decodeURIComponent(h.appends()[0].url.pathname).endsWith("/'Sheet1'!A:I:append"));
  assert.equal(h.authClients[0].key, "test-only\nprivate-key");
  assert.deepEqual(h.authClients[0].scopes, ["https://www.googleapis.com/auth/spreadsheets"]);
  assert.equal(h.authClients[0].transporter.defaults.timeout, 10000);
  assert.equal(h.authClients[0].transporter.defaults.retry, false);
  assert.equal(h.authClients[0].transporter.defaults.signal, h.appends()[0].init?.signal);
});

test("guide keeps project details together in both destinations", async (t) => {
  const h = setup(t);
  h.data.set("phone", "+44 123456789");
  h.data.set("bottle", "100ml reference");
  h.data.set("cap", "round cap");
  h.data.set("fragrance", "Bespoke");
  h.data.set("notes", "A detailed project brief\nwith references.");
  assert.deepEqual(await submitPrivateLabelProject(h.data), { success: true });
  assert.deepEqual(h.row().slice(2, 7), ["/private-label/guide", "Test Visitor", "visitor@example.invalid", "", "Private Label"]);
  for (const detail of ["Phone / WhatsApp: +44 123456789", "Already spoken to Basenote: No", "100ml reference", "round cap", "Fragrance route: Bespoke", "A detailed project brief\nwith references."]) {
    assert.ok(h.row()[7].includes(detail));
    assert.ok(h.mail().textContent.includes(detail));
  }
});

for (const failure of ["network", "timeout", "invalid-json", "invalid-response"] as const) {
  for (const destination of ["brevo", "sheet"] as const) {
    test(`${destination} ${failure} still allows the other destination without retrying`, async (t) => {
      const h = setup(t, { [destination]: failure });
      assert.deepEqual(await submitContactForm(h.data), { success: true });
      assert.equal(h.emails().length, 1);
      assert.equal(h.appends().length, 1);
      assert.equal(h.logs.mock.callCount(), 1);
    });
  }
}

for (const variable of ["BREVO_API_KEY", "BREVO_SENDER_EMAIL", "DESTINATION_INBOX", "GOOGLE_SHEETS_CLIENT_EMAIL", "GOOGLE_SHEETS_PRIVATE_KEY", "GOOGLE_SHEETS_SPREADSHEET_ID"]) {
  test(`missing ${variable} only disables its own destination`, async (t) => {
    const h = setup(t);
    delete process.env[variable];
    assert.deepEqual(await submitContactForm(h.data), { success: true });
    const sheetsMissing = variable.startsWith("GOOGLE_");
    assert.equal(h.emails().length, sheetsMissing ? 1 : 0);
    assert.equal(h.appends().length, sheetsMissing ? 0 : 1);
    assert.match(JSON.stringify(h.logs.mock.calls), /configuration/);
  });
}

test("missing both configurations returns a retryable failure", async (t) => {
  const h = setup(t);
  delete process.env.BREVO_API_KEY;
  delete process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const result = await submitContactForm(h.data);
  assert.equal(result.success, false);
  if (!result.success) assert.match(result.error, /try again/i);
  assert.equal(h.emails().length + h.appends().length, 0);
});

test("Google authentication failure still delivers email without logging credentials", async (t) => {
  const h = setup(t, { auth: true });
  assert.deepEqual(await submitContactForm(h.data), { success: true });
  assert.equal(h.emails().length, 1);
  assert.equal(h.appends().length, 0);
  assert.doesNotMatch(JSON.stringify(h.logs.mock.calls), /Private credentials/);
});

test("unexpected sheet headers stop the append without modifying cells or blocking email", async (t) => {
  const h = setup(t, { headers: ["Unrelated content"] });
  assert.deepEqual(await submitContactForm(h.data), { success: true });
  assert.equal(h.appends().length, 0);
  assert.equal(h.emails().length, 1);
  assert.match(JSON.stringify(h.logs.mock.calls), /sheet_headers/);
});

test("invalid contact fields and guide choices never start delivery", async (t) => {
  const h = setup(t);
  h.data.set("email", "invalid");
  assert.equal((await submitContactForm(h.data)).success, false);
  h.data.set("email", "visitor@example.invalid");
  h.data.set("message", "x".repeat(5001));
  assert.equal((await submitContactForm(h.data)).success, false);
  h.data.set("packaging", "unlisted option");
  assert.equal((await submitPrivateLabelProject(h.data)).success, false);
  assert.equal(h.requests.length, 0);
});
