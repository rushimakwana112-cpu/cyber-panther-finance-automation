// Tests for api/contact.ts. Run with `npm test` (Node 22.18+ runs the .ts module directly).
import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

const { POST, validate } = await import("../api/contact.ts");

const ORIGIN = "https://cyber-panther.example";
let ipCounter = 0;
const realFetch = globalThis.fetch;
let sent;

const good = () => ({
  name: "Test Visitor",
  email: "visitor@example.test",
  company: "",
  service: "SQL Data Extraction & Reporting",
  budget: "",
  message: "We rebuild a monthly sales summary from exports by hand.",
  website: "",
  elapsedMs: 9000,
});

function req(body, { origin = ORIGIN, type = "application/json", ip } = {}) {
  const headers = { "content-type": type, "x-forwarded-for": ip ?? `10.0.0.${++ipCounter}` };
  if (origin) headers.origin = origin;
  return new Request(`${ORIGIN}/api/contact`, { method: "POST", headers, body: typeof body === "string" ? body : JSON.stringify(body) });
}

beforeEach(() => {
  sent = [];
  process.env.RESEND_API_KEY = "re_test_dummy";
  process.env.CONTACT_TO_EMAIL = "owner@example.test";
  delete process.env.CONTACT_DRY_RUN;
  delete process.env.VERCEL_ENV;
  delete process.env.ALLOWED_ORIGINS;
  globalThis.fetch = async (url, init) => {
    sent.push({ url, init, body: JSON.parse(init.body) });
    return new Response(JSON.stringify({ id: "email_1" }), { status: 200 });
  };
});
afterEach(() => {
  globalThis.fetch = realFetch;
});

test("delivers a valid enquiry through Resend with reply-to set to the visitor", async () => {
  const res = await POST(req(good()));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(sent.length, 1);
  assert.equal(sent[0].url, "https://api.resend.com/emails");
  assert.equal(sent[0].init.headers.Authorization, "Bearer re_test_dummy");
  assert.deepEqual(sent[0].body.to, ["owner@example.test"]);
  assert.equal(sent[0].body.reply_to, "visitor@example.test");
  assert.match(sent[0].body.subject, /SQL Data Extraction/);
});

test("escapes HTML and strips header-injection characters", async () => {
  const body = { ...good(), name: "<script>alert(1)</script>", service: "Audit\r\nBcc: victim@example.test", message: "<img src=x onerror=alert(1)> hello there friend" };
  const res = await POST(req(body));
  assert.equal(res.status, 200);
  const email = sent[0].body;
  assert.ok(!email.html.includes("<script>"), "script tag must be escaped");
  assert.ok(!email.html.includes("<img"), "img tag must be escaped");
  assert.ok(email.html.includes("&lt;script&gt;"));
  assert.ok(!/[\r\n]/.test(email.subject), "subject must not contain line breaks");
});

test("rejects requests from other origins or without an Origin header", async () => {
  assert.equal((await POST(req(good(), { origin: "https://evil.example" }))).status, 403);
  assert.equal((await POST(req(good(), { origin: null }))).status, 403);
  assert.equal(sent.length, 0);
});

test("allows extra origins listed in ALLOWED_ORIGINS", async () => {
  process.env.ALLOWED_ORIGINS = "https://www.cyber-panther.example, https://other.example";
  // Request URL is still ORIGIN; the browser origin is the alias.
  const res = await POST(req(good(), { origin: "https://other.example" }));
  assert.equal(res.status, 200);
});

test("rejects non-JSON, malformed JSON and oversized bodies", async () => {
  assert.equal((await POST(req("name=x", { type: "application/x-www-form-urlencoded" }))).status, 415);
  assert.equal((await POST(req("{not json"))).status, 400);
  assert.equal((await POST(req(["array"]))).status, 400);
  assert.equal((await POST(req({ ...good(), message: "x".repeat(20000) }))).status, 413);
  assert.equal(sent.length, 0);
});

test("silently drops honeypot and too-fast submissions", async () => {
  const hp = await POST(req({ ...good(), website: "http://spam.example" }));
  assert.equal(hp.status, 200);
  const fast = await POST(req({ ...good(), elapsedMs: 300 }));
  assert.equal(fast.status, 200);
  const missing = await POST(req({ ...good(), elapsedMs: undefined }));
  assert.equal(missing.status, 200);
  assert.equal(sent.length, 0, "no email for bot-like submissions");
});

test("validates fields server-side", async () => {
  const res = await POST(req({ ...good(), name: "A", email: "nope", service: "", message: "short" }));
  assert.equal(res.status, 422);
  const data = await res.json();
  assert.deepEqual(Object.keys(data.fields).sort(), ["email", "message", "name", "service"]);
  assert.ok(validate({ ...good(), company: "x".repeat(500) }).errors?.company);
  assert.ok(validate({ ...good(), email: "a@b.c<script>" }).errors?.email);
  assert.equal(sent.length, 0);
});

test("rate-limits repeated submissions from one IP", async () => {
  const statuses = [];
  for (let i = 0; i < 7; i++) statuses.push((await POST(req(good(), { ip: "203.0.113.9" }))).status);
  assert.deepEqual(statuses, [200, 200, 200, 200, 200, 429, 429]);
});

test("reports 503 when email delivery is not configured", async () => {
  delete process.env.RESEND_API_KEY;
  const res = await POST(req(good()));
  assert.equal(res.status, 503);
  assert.equal(sent.length, 0);
});

test("reports 502 when the email provider fails, without leaking the key", async () => {
  globalThis.fetch = async () => new Response('{"message":"invalid key"}', { status: 401 });
  const res = await POST(req(good()));
  assert.equal(res.status, 502);
  const text = await res.text();
  assert.ok(!text.includes("re_test_dummy"));
});

test("dry-run mode is ignored in production", async () => {
  process.env.CONTACT_DRY_RUN = "1";
  process.env.VERCEL_ENV = "production";
  const res = await POST(req(good()));
  assert.equal(res.status, 200);
  assert.equal(sent.length, 1, "production must really send");
  process.env.VERCEL_ENV = "development";
  const dev = await POST(req(good()));
  assert.equal((await dev.json()).dryRun, true);
  assert.equal(sent.length, 1);
});
