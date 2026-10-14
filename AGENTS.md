# AGENTS.md — handoff guide for AI assistants (and humans)

Read this before changing anything. It explains what this project is, where it lives, how it is
built, deployed and secured, and the rules the owner cares about. Last updated: 11 Oct 2026.

---

## 1. What this is

**Cyber Panther — Finance & Automation** is the portfolio and lead-generation website of **Rushi**:
Accountant · Financial Data Analyst · Financial Automation Specialist. Featured service: **SQL Data
Extraction & Reporting**. Tools: SQL, Python, Excel, Word, VBA, Power Query, LLMs (exactly these seven).

- Headline: "Turn Financial Data Into Business Intelligence."
- Purpose: show competence through interactive demos and turn visitors into enquiries via the contact form.
- Audience: business owners, finance teams, accounting practices; Indian market (₹, lakh/crore formatting).

| Thing | Where |
| --- | --- |
| Live site (public) | https://cyber-panther-finance-automation.vercel.app |
| GitHub repo (public) | https://github.com/rushimakwana112-cpu/cyber-panther-finance-automation — branch `main` |
| Hosting | Vercel, team `cyber-panther`, project `cyber-panther-finance-automation`, Hobby (free) plan |
| Email delivery | Resend (free tier), called server-side from `api/contact.ts` |
| Local folder (owner's PC) | `C:\My Work\test\cyber panther` (Windows) |
| Brand skill for Claude Code | `C:\Users\Rushi Makwana\.claude\skills\cyberpanther` (see §10) |

The same URL is shared publicly (e.g. LinkedIn). Redeploys never change it — don't rename the Vercel project.

## 2. Non-negotiable rules from the owner

1. **Never invent** qualifications, certifications, clients, testimonials, results or metrics. Rushi's identity and services must stay accurate.
2. **All figures on the site are fictional demo data** and must be labelled as such ("Demo data" tags, footer note). Every displayed total must reconcile with its dataset in `src/data/`.
3. **Never claim something worked unless verified** (a deploy, an email, a test). The contact form must never say "sent" unless the server confirmed it.
4. **Never put secrets in the repo or in `VITE_*` variables** (those ship to the browser). The repo is public.
5. **Never force-push, never overwrite unrelated work.** Commit with clear messages.
6. Design: minimalist fintech — dark navy/black, electric blue primary, purple used sparingly. No panther/animal imagery, no neon overload, no glassmorphism everywhere (see §8).
7. Respect accessibility (keyboard, reduced motion) and mobile layouts on every change.

## 3. Tech stack

- **React 19 + TypeScript + Vite 6** (static SPA), plain CSS with design tokens (no Tailwind, no UI library).
- **Vercel Function** `api/contact.ts` (Node runtime, Web `Request`/`Response` named `POST` export).
- **Resend** HTTP API for email (no SDK).
- Node **≥ 22.18** (the local API runner and tests execute `.ts` directly via Node type stripping).
- Dependencies are pinned exactly. `npm audit` was clean (0 vulnerabilities) as of the last update.

## 4. Repository map

```
AGENTS.md            this file
README.md            human-oriented setup guide
index.html           SEO + social share meta (og:image etc.), favicon (inline data-URI), Google Fonts
public/og-image.png  1200×627 social share image (LinkedIn/WhatsApp/X preview)
vercel.json          build config + security headers (CSP etc.)
vite.config.ts       dev proxy /api → :8787; `preview` reuses vercel.json headers
api/contact.ts       serverless email function (validation, spam traps, rate limit, Resend)
scripts/
  dev-api.mjs        local runner for api/contact.ts on :8787 (dry-run by default)
  make-single-file.mjs  builds the double-clickable "Cyber Panther.html" from dist/
  og/og-image.html + og/render-og.mjs  share-image design; `node scripts/og/render-og.mjs` re-renders public/og-image.png
tests/contact.test.mjs  11 tests for the function (node:test)
Cyber Panther.html   GENERATED single-file copy of the site (committed; rebuilt by `npm run build`)
src/
  content/           ← EDIT COPY HERE: site.ts (brand, nav, budgets, contact config), services.ts,
                       tools.ts (7 tools + 5 workflow stages), projects.ts, strengths.ts
  data/              fictional demo datasets: finance.ts (hero dashboard), cleaning.ts, demos.ts
  lib/               format.ts (₹, lakh/crore), hooks.ts (tweens, in-view, reduced motion), contact.ts
  components/        Header, Footer, Section, LineChart, Code, Icon, Logo, DemoTag
  sections/          Hero, Dashboard, Strengths, Workflow, DataCleaning, FeaturedService,
                     Portfolio (+ demos/JoinDemo, RefreshDemo, MarginDemo), About, Contact
  styles/            tokens.css · base.css · components.css · sections.css
skill-tests/         local test outputs for the cyberpanther skill — git-ignored
```

## 5. Page structure (section ids matter — nav and buttons link to them)

| # | id | Content |
| --- | --- | --- |
| — | `home` | Hero: roles, headline, lead, CTAs (Work With Me → `#contact`, Explore Services → `#services`), interactive dashboard (metric tabs, period switch Q4/H2/FY, pinnable chart tooltips, expense mix) |
| 01 | `strengths` | Accountant / Financial Data Analyst / Financial Automation Specialist |
| 02 | `workflow` | "Tools I know" automation map: Source → Extract (SQL) → Clean & combine (Power Query, Python) → Calculate (Excel, VBA) → Report (Word, LLMs); walkthrough button |
| 03 | `process` | Data-cleaning demo: Raw → Clean & transform → Analyze → Report → Business insights |
| 04 | `services` | Featured SQL service + live SQL console demo + "Also available" list; "Discuss This Service" preselects the form |
| 05 | `portfolio` | 3 tabbed demo projects (problem / solution / tools / try it) |
| 06 | `about` | "Hi, I'm Rushi" + principles |
| 07 | `contact` | Enquiry form |

Nav items and section→nav aliases live in `src/content/site.ts` (`nav`, `navAliases`).
"Discuss" buttons call `goToContact(serviceId)` (`src/lib/contact.ts`), which dispatches `cp:select-service`.

## 6. Common edits (where to change what)

| Want to change | Edit |
| --- | --- |
| Headline, lead text, audience line, roles | `src/content/site.ts` → `brand` |
| Contact form budget ranges | `src/content/site.ts` → `budgets` (current: Under ₹5,000 / ₹5,000–15,000 / ₹15,000–30,000 / Above ₹30,000 / Not sure yet) |
| Services (featured + list + form dropdown) | `src/content/services.ts` (exactly one `featured: true`) |
| Tool descriptions/snippets, workflow stages | `src/content/tools.ts` |
| Portfolio projects text | `src/content/projects.ts` (interactive demo components in `src/sections/demos/`) |
| Social links in footer | `src/content/site.ts` → `socials` (empty = hidden) |
| Demo numbers | `src/data/*.ts` (keep totals consistent) |
| Colours/spacing/type | `src/styles/tokens.css` |
| Security headers / CSP | `vercel.json` (and re-test — see §9) |
| Social share preview | design `scripts/og/og-image.html` → `node scripts/og/render-og.mjs`; tags in `index.html`. After deploying, refresh LinkedIn's cache at linkedin.com/post-inspector |

After any edit: build, test, check in a browser, commit, push, deploy (§7).

## 7. Run, build, test, deploy

```bash
npm install
npm run dev:api        # contact function on :8787, DRY RUN (logs the email, sends nothing)
npm run dev            # site on http://localhost:5173 (proxies /api to :8787)
npm test               # 11 API tests — must pass
npm run build          # tsc + vite build → dist/ + regenerates "Cyber Panther.html"
npm run preview        # serve dist/ on :4173 with production security headers
```

**Deploy (manual — GitHub auto-deploy is NOT connected):**
```bash
git push origin main
npx vercel@63.1.2 deploy --prod --yes      # needs `npx vercel@63.1.2 login` once per machine
```
- The local folder is linked to the Vercel project via `.vercel/` (git-ignored). The CLI may create `.env.local` with a short-lived `VERCEL_OIDC_TOKEN` — it is git-ignored and excluded by `.vercelignore`; never commit it. If the CLI edits `.gitignore`, revert that edit (it adds a rule that hides `.env.example`).
- A deploy occasionally returns "Not authorized" transiently — run `vercel whoami` and retry once.
- Verify after deploy: `curl -I https://cyber-panther-finance-automation.vercel.app/` → 200 with the CSP header; fetch the JS asset and grep for the changed text.
- To enable auto-deploys: Vercel → Project → Settings → Git → connect the repo (requires installing the Vercel GitHub app; owner's choice).

**Owner's Windows PC quirks:** PowerShell blocks `.ps1` shims, so in PowerShell use `npm.cmd` / `npx.cmd` (Git Bash is fine with `npm`/`npx`). Python 3.14 is installed (used by the skill, not the site).

## 8. Design system (summary)

| Token | Value | Role |
| --- | --- | --- |
| `--bg` | `#050A12` | page background (midnight black) |
| `--surface` | `#0B1625` | panels (deep navy) |
| `--blue` | `#20C5FF` | primary accent — focus, main series, CTAs |
| `--purple` | `#A855F7` | emphasis only (~3% of a view) |
| `--violet` | `#C4B5FD` | demo tags, gradient end |
| `--text` / `--text-2` / `--text-3` | `#F4F8FF` / `#A6B6C8` / `#74869B` | text hierarchy |

Fonts: Geist (UI) and Geist Mono (numbers, labels). Hairlines over boxes, one focal number per view,
mono tabular numbers, short purposeful motion that respects `prefers-reduced-motion`.
Charts are hand-written SVG (no chart library) — keep it that way unless there's a strong reason.

## 9. Contact form → email (how it works)

```
browser form ──POST /api/contact (JSON)──▶ api/contact.ts ──Bearer RESEND_API_KEY──▶ Resend ──▶ owner's inbox
```

Frontend (`src/sections/Contact.tsx`): client-side validation, maxLength limits, hidden honeypot field `website`,
sends `elapsedMs` (time since the form appeared). Shows "Message sent" only on HTTP 200; 503 → "delivery not
switched on" with copy-message fallback; other errors → honest error, text kept. Opened from disk
(`file://`) the form reports it cannot send.

Server (`api/contact.ts`), in order:
1. Origin must equal the site's own origin (or be listed in `ALLOWED_ORIGINS`) → else 403.
2. `Content-Type: application/json` → else 415; body ≤ 16 KB → else 413; valid JSON object → else 400.
3. Honeypot filled or `elapsedMs` < 2500 → silently return `{ok:true}` (bots learn nothing; no email).
4. Rate limit 5 per IP per 10 min (in-memory, per instance — best effort) → 429.
5. Validate + length-limit all fields, strip control characters → 422 with per-field errors.
6. Build email: HTML-escaped body, subject without line breaks, **Reply-To = visitor**.
7. Send via Resend (10 s timeout). Missing env → 503. Provider error → 502 (logs status only, never the key or message).
8. `CONTACT_DRY_RUN=1` logs instead of sending — ignored when `VERCEL_ENV=production`.

**Environment variables (Vercel → Settings → Environment Variables):**

| Name | Set? | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | ✅ Production (Sensitive) | secret — never read it back, never paste it anywhere |
| `CONTACT_TO_EMAIL` | ✅ Production | must equal the Resend account email while using the test sender |
| `CONTACT_FROM_EMAIL` | not set | defaults to `Cyber Panther <onboarding@resend.dev>` (Resend's shared sender: delivers only to the Resend account's own address; may land in spam) |
| `ALLOWED_ORIGINS` | not set | needed only for a custom domain alias |
| `VITE_CONTACT_ENDPOINT`, `VITE_CONTACT_EMAIL` | not set | public build-time values; endpoint defaults to `/api/contact` |

Changing env vars requires a redeploy. Status: a live end-to-end submission returned 200 from Resend on
11 Oct 2026; the owner had not yet confirmed that the test email reached the inbox (check Resend → Emails if unsure).

## 10. Security posture

- Headers (`vercel.json`): CSP `default-src 'self'; script-src 'self'; style-src 'self' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; form-action 'self'; object-src 'none'; base-uri 'self'`, HSTS (preload), X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, COOP. Hashed assets cached immutable.
- **Adding any third-party script, font, image host or API call requires updating the CSP**, then testing with `npm run preview` (it serves the same headers) and checking the console for violations.
- No `dangerouslySetInnerHTML`/`innerHTML` anywhere; React escapes output. Keep it that way.
- No secrets in git history (scanned). `.env*` (except `.env.example`), `.vercel/`, `dist/`, `skill-tests/` are ignored.
- `vite-plugin-singlefile` was removed on purpose (vulnerable `braces` chain with no fix); the single-file build is done by `scripts/make-single-file.mjs`.

Known remaining risks / suggestions: per-instance rate limit (add Cloudflare Turnstile or a shared store for
stronger spam protection); Resend test sender deliverability (verify a domain); Google Fonts is third-party
(could self-host); owner should enable 2FA on GitHub, Vercel and Resend.

## 11. History (git)

| Commit | What |
| --- | --- |
| `af04f6c` | Backup of the original compiled single-file site (no source existed) |
| `a585eb0` | Rebuilt as Vite + React + TS source; redesign; new workflow map; bug fixes |
| `af477d8` | Contact email function, Vercel config, security headers, dependency fixes, tests |
| `cc0cd42` | Lowered contact-form budget ranges |
| (next) | Social share image + og/twitter tags (LinkedIn preview) |

Also: an older copy of the site was published as a private claude.ai artifact (https://claude.ai/artifact/FYxQsXED1HtXmx85DRn2Jh). It is **stale** and its form cannot send — the Vercel URL is the real site.

## 12. Open ideas / not done yet (ask the owner before doing)

- Visitor analytics: enable **Vercel Web Analytics** (cookie-less; needs a small code addition + redeploy; works with the current CSP because it is same-origin under `/_vercel/insights`). Owner asked about this and chose to wait.
- Connect GitHub → Vercel auto-deploys.
- Cloudflare Turnstile on the form; self-hosted fonts; custom domain + verified Resend sender.
- Footer social links (LinkedIn etc.) — `socials` is empty.

## 13. The `cyberpanther` skill (outside this repo)

A Claude Code skill at `C:\Users\Rushi Makwana\.claude\skills\cyberpanther` converts Excel dashboards, CSV/XLSX
data, PDFs and dashboard screenshots into this site's visual style (HTML dashboards, styled .xlsx, branded PDF
reports, matplotlib theme). Its `references/design-system.md` is the full style rulebook and is the best reference
for any new visual work. A packaged copy is `skill-tests/cyberpanther.skill` (local only).

## 14. Checklist for any change

1. Read the relevant files; keep the existing style and patterns.
2. Make the change in `src/content/` if it's copy/config.
3. `npm test` and `npm run build` pass.
4. Check desktop + mobile in a browser (`npm run dev` + `npm run dev:api`, or `npm run preview`); no console/CSP errors.
5. Commit with a clear message (no secrets), `git push origin main`.
6. `npx vercel@63.1.2 deploy --prod --yes`, then verify on the live URL.
7. Tell the owner exactly what changed and what was verified — and anything that wasn't.
