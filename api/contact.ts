// POST /api/contact — receives a service enquiry from the website and emails it via Resend.
//
// Runs server-side only (Vercel Function). Secrets come from environment variables and never
// reach the browser. See README "Contact form delivery" for setup.
//
//   RESEND_API_KEY      required  Resend API key (server-side secret)
//   CONTACT_TO_EMAIL    required  where enquiries are delivered
//   CONTACT_FROM_EMAIL  optional  verified sender; defaults to Resend's shared test sender
//   ALLOWED_ORIGINS     optional  comma-separated extra origins allowed to post (same-origin is always allowed)
//   CONTACT_DRY_RUN     optional  "1" logs instead of sending — ignored in production
//
// Written with erasable TypeScript only, so `node` can run it directly for local tests.

const LIMITS = { name: 100, email: 254, company: 120, service: 120, budget: 60, message: 5000 } as const;
const MAX_BODY_BYTES = 16 * 1024;
const MIN_FILL_MS = 2500; // humans need longer than this to fill the form
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const EMAIL_RE = /^[^\s@<>"',;:]+@[^\s@<>"',;:]+\.[^\s@<>"',;:]{2,}$/;

type Enquiry = { name: string; email: string; company: string; service: string; budget: string; message: string };
type Field = keyof Enquiry;

// Best-effort, per-instance limiter. Serverless instances are short-lived, so this blunts bursts
// rather than guaranteeing a global limit (see README for a stronger option).
const hits = new Map<string, number[]>();

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

/** Removes control characters (keeps newlines/tabs in the message) and trims. */
function clean(value: unknown, keepNewlines: boolean): string {
  if (typeof value !== "string") return "";
  const stripped = keepNewlines ? value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") : value.replace(/[\u0000-\u001F\u007F]/g, " ");
  return stripped.replace(/\r\n?/g, "\n").trim();
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export function validate(input: Record<string, unknown>): { data?: Enquiry; errors?: Partial<Record<Field, string>> } {
  const data: Enquiry = {
    name: clean(input.name, false),
    email: clean(input.email, false).toLowerCase(),
    company: clean(input.company, false),
    service: clean(input.service, false),
    budget: clean(input.budget, false),
    message: clean(input.message, true),
  };
  const errors: Partial<Record<Field, string>> = {};
  for (const k of Object.keys(LIMITS) as Field[]) {
    if (data[k].length > LIMITS[k]) errors[k] = `Must be ${LIMITS[k]} characters or fewer.`;
  }
  if (data.name.length < 2) errors.name ??= "Please enter your name.";
  if (!EMAIL_RE.test(data.email)) errors.email ??= "Please enter a valid email address.";
  if (!data.service) errors.service ??= "Please choose a service.";
  if (data.message.length < 20) errors.message ??= "Please write at least 20 characters.";
  return Object.keys(errors).length ? { errors } : { data };
}

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0] : request.headers.get("x-real-ip") ?? "unknown").trim();
}

function rateLimited(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  if (recent.length >= RATE_LIMIT.max) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return false;
}

function originAllowed(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false; // browsers always send Origin on cross-site and same-site POSTs
  const self = new URL(request.url).origin;
  const extra = (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return origin === self || extra.includes(origin);
}

function buildEmail(e: Enquiry) {
  const subject = `New enquiry — ${e.service}`.slice(0, 150);
  const rows: [string, string][] = [
    ["Name", e.name],
    ["Email", e.email],
    ["Company", e.company || "—"],
    ["Service", e.service],
    ["Budget", e.budget || "—"],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${e.message}\n\n— Sent from the Cyber Panther website contact form`;
  const html = `<table style="font:14px/1.5 Arial,sans-serif;border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="padding:2px 12px 2px 0;color:#667">${k}</td><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table><p style="font:14px/1.6 Arial,sans-serif;white-space:pre-wrap">${escapeHtml(e.message)}</p><p style="font:12px Arial,sans-serif;color:#889">Sent from the Cyber Panther website contact form. Reply to this email to answer ${escapeHtml(e.name)}.</p>`;
  return { subject, text, html };
}

export async function POST(request: Request): Promise<Response> {
  if (!originAllowed(request)) return json(403, { error: "Forbidden." });
  if (!(request.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
    return json(415, { error: "Expected JSON." });
  }
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return json(413, { error: "Message is too large." });

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return json(400, { error: "Could not read the request." });
  }
  if (raw.length > MAX_BODY_BYTES) return json(413, { error: "Message is too large." });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: "Invalid JSON." });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return json(400, { error: "Invalid request." });
  const input = body as Record<string, unknown>;

  // Spam traps: a filled hidden field or an implausibly fast submission. Reply "ok" so bots learn nothing.
  const elapsed = Number(input.elapsedMs);
  if ((typeof input.website === "string" && input.website.trim() !== "") || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return json(200, { ok: true });
  }

  if (rateLimited(clientIp(request))) return json(429, { error: "Too many messages — please try again in a few minutes." });

  const { data, errors } = validate(input);
  if (!data) return json(422, { error: "Please check the highlighted fields.", fields: errors });

  const { subject, text, html } = buildEmail(data);
  const isProduction = process.env.VERCEL_ENV === "production";

  if (process.env.CONTACT_DRY_RUN === "1" && !isProduction) {
    console.log("[contact] dry run — would send:", JSON.stringify({ subject, replyTo: data.email, text }));
    return json(200, { ok: true, dryRun: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set");
    return json(503, { error: "Online delivery isn’t configured yet." });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Cyber Panther <onboarding@resend.dev>",
        to: [to],
        reply_to: data.email,
        subject,
        text,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      // Log the provider's status and error type only — never the key or the visitor's message.
      const detail = await res.text().catch(() => "");
      console.error(`[contact] Resend responded ${res.status}: ${detail.slice(0, 300)}`);
      return json(502, { error: "The email service couldn’t deliver your message." });
    }
  } catch (err) {
    console.error("[contact] delivery failed:", err instanceof Error ? err.message : err);
    return json(502, { error: "The email service couldn’t be reached." });
  }

  return json(200, { ok: true });
}
