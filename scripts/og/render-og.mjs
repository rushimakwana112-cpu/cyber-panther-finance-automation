// Renders scripts/og/og-image.html to public/og-image.png (1200x627, the size LinkedIn/WhatsApp/X use)
// with a locally installed Chrome or Edge in headless mode. Run after editing the design:
//   node scripts/og/render-og.mjs
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, "og-image.html");
const out = resolve(here, "../../public/og-image.png");

const candidates = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];
const browser = candidates.find((p) => existsSync(p));
if (!browser) throw new Error("No Chrome/Edge found — install one or update the candidates list.");

mkdirSync(dirname(out), { recursive: true });
const profile = mkdtempSync(join(tmpdir(), "og-")); // isolated profile; never touches the user's browser data
try {
  execFileSync(browser, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", `--user-data-dir=${profile}`,
    "--window-size=1200,627", "--force-device-scale-factor=1", "--virtual-time-budget=5000",
    `--screenshot=${out}`, pathToFileURL(src).href,
  ], { stdio: "ignore", timeout: 60_000 });
} finally {
  rmSync(profile, { recursive: true, force: true });
}
console.log(`Wrote ${out} (${(statSync(out).size / 1024).toFixed(0)} KB)`);
