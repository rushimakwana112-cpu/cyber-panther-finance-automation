import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Reuse the production security headers from vercel.json so `npm run preview` behaves like the live site.
const vercel = JSON.parse(readFileSync(new URL("./vercel.json", import.meta.url), "utf8")) as {
  headers: { source: string; headers: { key: string; value: string }[] }[];
};
const siteHeaders = Object.fromEntries(
  (vercel.headers.find((h) => h.source === "/(.*)")?.headers ?? [])
    .filter((h) => h.key !== "Strict-Transport-Security") // HTTPS-only; meaningless on localhost
    .map((h) => [h.key, h.value.replace("; upgrade-insecure-requests", "")]),
);

// `npm run dev:api` serves the contact function locally on port 8787.
const proxy = { "/api": "http://localhost:8787" };

export default defineConfig({
  plugins: [react()],
  build: { target: "es2020", cssCodeSplit: false },
  server: { proxy },
  preview: { proxy, headers: siteHeaders },
});
