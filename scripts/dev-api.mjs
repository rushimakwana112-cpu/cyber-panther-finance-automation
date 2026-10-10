// Local stand-in for Vercel's function runtime: serves api/contact.ts on http://localhost:8787.
// Vite's dev server proxies /api to it (see vite.config.ts). Requires Node 22.18+ / 23.6+ (runs .ts directly).
//
//   npm run dev:api                      -> dry run: logs the email instead of sending
//   RESEND_API_KEY=… CONTACT_TO_EMAIL=… CONTACT_DRY_RUN=0 npm run dev:api   -> really sends
import { createServer } from "node:http";

process.env.CONTACT_DRY_RUN ??= "1";
const { POST } = await import("../api/contact.ts");

const PORT = 8787;

createServer(async (req, res) => {
  if (req.url !== "/api/contact") {
    res.writeHead(404).end();
    return;
  }
  if (req.method !== "POST") {
    res.writeHead(405, { Allow: "POST" }).end();
    return;
  }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  // Vite's proxy forwards the browser's Origin; present the request as if served from that origin.
  const origin = req.headers.origin ?? `http://localhost:${PORT}`;
  const request = new Request(new URL(req.url, origin), {
    method: "POST",
    headers: Object.entries(req.headers).flatMap(([k, v]) => (v === undefined ? [] : [[k, String(v)]])),
    body: Buffer.concat(chunks),
  });
  const response = await POST(request);
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(await response.text());
}).listen(PORT, () => console.log(`contact API on http://localhost:${PORT}/api/contact (dry run: ${process.env.CONTACT_DRY_RUN === "1"})`));
