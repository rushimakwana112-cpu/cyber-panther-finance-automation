// `npm run build:single` → dist/cyber-panther.html: the production build with its JS and CSS
// inlined, so the site can be opened by double-clicking one file. The hosted site uses dist/ as-is.
//
// Opened from disk, the contact form cannot reach /api/contact and will say so honestly.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dist = "dist";
let html = readFileSync(join(dist, "index.html"), "utf8");

const read = (href) => readFileSync(join(dist, href.replace(/^\//, "")), "utf8");

html = html.replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/g, (_, src) => {
  // Escape any closing tag sequence so inlined code cannot end the <script> early.
  const code = read(src).replace(/<\/script/gi, "<\\/script");
  return `<script type="module">${code}</script>`;
});
html = html.replace(/<link rel="stylesheet" crossorigin href="([^"]+)">/g, (_, href) => `<style>${read(href)}</style>`);

if (/src="\/assets\/|href="\/assets\//.test(html)) {
  throw new Error("make-single-file: an asset reference was not inlined — check the dist/index.html format.");
}

writeFileSync(join(dist, "cyber-panther.html"), html);
console.log(`Wrote dist/cyber-panther.html (${(html.length / 1024).toFixed(0)} KB)`);
