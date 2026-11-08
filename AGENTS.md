# AGENTS.md — handoff guide for AI assistants (and humans)

Read this before changing anything. It explains what this project is, where it lives, how it is
built, deployed and secured, and the rules the owner cares about. Last updated: 7 Nov 2026.

---

## 1. What this is

**Cyber Panther** is the professional portfolio of **Rushi Makwana**, for recruiters and employers first. Rushi has no clients and is not looking for client work right now, so the site must not sell services.
Positioning: Accountant | Financial Data Analyst | Financial Automation Specialist. It is not a freelancer marketplace or AI agency site: no pricing, packages or hourly rates.

- Home headline: "Turning Financial Operations into Intelligent Systems." The name and roles appear above it.
- The public portfolio contains ONLY three company case studies: Smart PDF & Image Reader (formerly Document Matcher, before that MPR Checker), Auto Payroll Dashboard, Finance Operations Intelligence (formerly Payroll AI Assistant). Never add private Claude Skills or other internal tools, and never invent projects.
- **Core message (owner's words, Nov 2026):** systems for daily manual work, done by the system, accurately and efficiently, under the owner's control.
- **Keep projects short:** show what was built, why it is useful and why it is better. Do not show internal detail such as month types, step-by-step workflows, architecture, formulas or model versions. Long detail bores visitors, and the owner does not want the full project identity shown.
- Every project has a label: In use, Prototype or Experiment (`stageInfo` in `content/projects.ts`). Only the owner can confirm a label.
- "My Automation Impact" describes kinds of change. Add numbers only if the owner has measured and approved them.
- **Plain language is required (owner's request, Nov 2026):** write so a non-technical person and a professional can both follow. Use everyday words first and explain a technical term the first time it appears.
- **Ask Panther** (`src/content/askPanther.ts`, `src/sections/AskPanther.tsx`) is a rule-based site guide that runs in the browser with approved answers only. It is not an AI model and uses no API. Keep it honest: it says so when it has no answer.
- Keep generic: portal and bank names, employer names, internal security configuration, margin formula, business rules, file names, table names, AI model versions. The owner's private handover files are for checking facts only and must never be copied here. Cyber Panther is the website identity. Do not use the name Blue Panther on this site.

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
6. Design: minimalist fintech — dark navy/black, electric blue primary, purple used sparingly. The owner's panther logo (`src/assets/panther-logo.png`) is the site logo, chosen by the owner in Nov 2026; do not add other animal imagery. No neon overload, no glassmorphism everywhere (see §8).
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
  make-single-file.mjs  `npm run build:single` → dist/cyber-panther.html (double-clickable single file)
  og/og-image.html + og/render-og.mjs  share-image design; `node scripts/og/render-og.mjs` re-renders public/og-image.png
tests/contact.test.mjs  11 tests for the function (node:test)
src/
  pages/             Home, Projects, Capabilities, OtherPages (About, Technology, Security, Personal)
  content/           ← EDIT COPY HERE: site.ts (brand, nav, contact config), projects.ts (3 case studies),
                       capabilities.ts, misc.ts, tools.ts (workflow map)
  data/              fictional demo datasets: finance.ts (hero dashboard), cleaning.ts, demos.ts
  lib/               format.ts (₹, lakh/crore), hooks.ts (tweens, in-view, reduced motion), contact.ts
  components/        Header, Footer, Section, LineChart, Code, Icon, Logo, DemoTag
  sections/          Dashboard, Workflow, DataCleaning, Contact + demos/ (SqlConsole, JoinDemo, RefreshDemo,
                     MarginDemo, PayrollChatDemo, MprCheckDemo, PayrollControlDemo)
  styles/            tokens.css · base.css · components.css · sections.css
```

## 5. Page structure (hash routes, in `src/lib/route.ts`)

| Route | File | Content |
| --- | --- | --- |
| `#/` | `src/pages/Home.tsx` | Open-to-jobs line, role pills, headline, growth path picture (`sections/GrowthPath.tsx`, stages in `content/site.ts`, no figures), credential strip, project cards with app previews (`components/AppPreview.tsx`) and benefits, automation workflow (`sections/AutomationFlow.tsx`), impact facts (`sections/ImpactFacts.tsx`, facts only, never results) and manual vs system, one node story (`content/stories.ts`, `components/NodeStory.tsx`), three starting points, demo tiles, hiring call to action |
| `#/about` | `pages/About.tsx`, `styles/about.css` | Scrolling personal story from `content/about.ts` (approved Concept C). No employers, dates or resume content |
| `#/projects`, `#/projects/<id>` | `pages/Projects.tsx` | Short project pages from `content/projects.ts`: built, useful, better, demo |
| `#/tools`, `#/tools/<demo>` | `pages/Tools.tsx` | Tabbed live demos + 8 capabilities |
| `#/ai-lab` | `pages/AiLab.tsx` | Labelled AI work, how AI is used, chat demo |
| `#/technology` | `pages/OtherPages.tsx` | Tool groups, technology node story, workflow map |
| `#/security` | `pages/OtherPages.tsx` | Approach and principles. Do not disclose internal security configuration |
| `#/personal` | `pages/OtherPages.tsx` | Synk, Just Go Fit, Compliance Copilot |
| `#/contact/opportunity` | `sections/Contact.tsx` | Job form using `api/contact.ts`. The business path appears only through old `#/contact/automation` links |

Main menu: Home, Projects, Tools, AI Lab, About Me, Contact. Technology, Security and Personal Projects are linked from the mobile menu, the footer and related pages.

Old links keep working through `route.ts`: one-page links (`#contact`, `#services`, ...), `#/capabilities`, `#/projects/mpr-checker`, `#/projects/document-matcher` and `#/projects/payroll-ai-assistant`.

## 6. Common edits

| Want to change | Edit |
| --- | --- |
| Headline, positioning, nav, contact options | `src/content/site.ts` |
| Case studies | `src/content/projects.ts` (demos in `src/sections/demos/`, data in `src/data/caseDemos.ts`) |
| Capabilities and demo list | `src/content/capabilities.ts` |
| About Me story and course milestones | `src/content/about.ts` |
| Technology, approach, personal projects, AI Lab items | `src/content/misc.ts` |
| Home node stories | `src/content/stories.ts` |
| Ask Panther answers | `src/content/askPanther.ts` (tests in `tests/askPanther.test.mjs`) |
| Demo numbers | `src/data/*.ts` (keep totals consistent) |
| Colours/spacing/type | `src/styles/tokens.css`; page layouts in `src/styles/pages.css` |
| Security headers / CSP | `vercel.json` (and re-test) |
| Social share preview | `scripts/og/og-image.html` then `node scripts/og/render-og.mjs` |

## 7. Run, build, test, deploy

```bash
npm install
npm run dev:api        # contact function on :8787, DRY RUN (logs the email, sends nothing)
npm run dev            # site on http://localhost:5173 (proxies /api to :8787)
npm test               # 11 API tests — must pass
npm run build          # tsc + vite build → dist/ (what Vercel serves)
npm run build:single   # optional single-file copy → dist/cyber-panther.html
npm run preview        # serve dist/ on :4173 with production security headers
```

**Deploy:** GitHub auto-deploy appears to be connected (7 Nov 2026: a push to `main` went live before the CLI deploy), so every push to `main` goes live. Ask the owner before pushing. The manual command still works:
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
- No secrets in git history (scanned). `.env*` (except `.env.example`), `.vercel/`, `dist/`, `node_modules/`, `.claude/` are ignored.
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
| `ea9530f` | Social share image + og/twitter tags (LinkedIn preview) |
| `55988e3` | Folder tidy-up: removed generated `Cyber Panther.html` from the repo (now optional `npm run build:single`) |
| (Nov 2026) | Upgrade merged from `v2`: eight views, three case studies, plain language, Ask Panther, About story |
| (7 Nov 2026) | Job-first portfolio redesign: new menu, renamed projects, short project pages, AI Lab, internal detail removed |
| (8 Nov 2026) | Home "growth" redesign: growth path hero, credential strip, benefit-led project cards, comparison table, hiring call to action |

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
for any new visual work. To share it, package it with the skill-creator (`python -m scripts.package_skill <skill folder>`).

## 14. Checklist for any change

1. Read the relevant files; keep the existing style and patterns.
2. Make the change in `src/content/` if it's copy/config.
3. `npm test` and `npm run build` pass.
4. Check desktop + mobile in a browser (`npm run dev` + `npm run dev:api`, or `npm run preview`); no console/CSP errors.
5. Commit with a clear message (no secrets), `git push origin main`.
6. `npx vercel@63.1.2 deploy --prod --yes`, then verify on the live URL.
7. Tell the owner exactly what changed and what was verified — and anything that wasn't.
