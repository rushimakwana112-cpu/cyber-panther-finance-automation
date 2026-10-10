# Cyber Panther — Finance & Automation

Portfolio website for Rushi — accountant, financial data analyst and financial automation specialist.
Built with React 19, TypeScript and Vite; the contact form is handled by a serverless function
(`api/contact.ts`) that emails enquiries through [Resend](https://resend.com). Hosted on Vercel.

All figures on the site are fictional demonstration data.

## Run locally

```bash
npm install
npm run dev:api      # contact function on :8787 (dry run — logs instead of emailing)
npm run dev          # site on http://localhost:5173 (proxies /api to :8787)
```

Requires Node 22.18 or newer (the local API runner executes TypeScript directly).

## Test & build

```bash
npm test             # contact function tests (validation, spam traps, origin check, rate limit, escaping…)
npm run build        # type-check + production build in dist/ + single-file "Cyber Panther.html"
npm run preview      # serve dist/ with the same security headers as production
```

`Cyber Panther.html` is a self-contained copy you can open by double-clicking. Opened from disk it has
no server behind it, so its contact form says plainly that the message can't be sent from there.

## Editing content

Frequently edited content lives in `src/content/` — components read from these files:

| File | What it controls |
| --- | --- |
| `site.ts` | Brand name, headline, hero copy, navigation, social links, budget options |
| `services.ts` | Services (one `featured`); every entry appears in the contact form dropdown |
| `tools.ts` | The seven tools and the five workflow stages they belong to |
| `projects.ts` | Portfolio demo projects (problem / solution / tools / try-it text) |
| `strengths.ts` | The three professional strengths and the "How I work" principles |

Demo datasets are in `src/data/` (`finance.ts` drives the hero dashboard; every total is derived from it).

## Contact form → email

```
browser ──POST /api/contact──▶ Vercel Function (api/contact.ts) ──HTTPS + API key──▶ Resend ──▶ your inbox
```

The function checks the request origin, limits body size, validates and length-limits every field,
drops honeypot / too-fast (bot) submissions, rate-limits each IP, escapes all visitor input in the email
and sets **Reply-To** to the visitor, so you can answer straight from your inbox. The page only shows
"Message sent" after the function confirms Resend accepted the email.

### Setup (one time)

1. Create a free account at [resend.com](https://resend.com) **using the email address that should receive
   enquiries**, then create an API key (*API Keys → Create*, permission "Sending access").
2. In Vercel: *Project → Settings → Environment Variables*, add for **Production** (and Preview if wanted):

   | Variable | Value | Secret? |
   | --- | --- | --- |
   | `RESEND_API_KEY` | the key from step 1 | **yes** |
   | `CONTACT_TO_EMAIL` | your Resend account email | no |
   | `CONTACT_FROM_EMAIL` | optional, e.g. `Cyber Panther <enquiries@yourdomain.com>` | no |
   | `ALLOWED_ORIGINS` | optional extra origins (custom domain aliases) | no |

3. Redeploy (Vercel → Deployments → ⋯ → Redeploy) so the function picks up the variables.

Without `CONTACT_FROM_EMAIL`, mail is sent from Resend's shared test sender `onboarding@resend.dev`, which
Resend only allows to deliver to **your own Resend account address** — fine for enquiry notifications.
To send from your own domain, verify the domain in Resend and set `CONTACT_FROM_EMAIL`.

Never put secrets in `VITE_*` variables — those are compiled into the public page. `.env*` files are
git-ignored and excluded from Vercel uploads (`.vercelignore`).

## Security

- Security headers (CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, COOP) are set in `vercel.json`.
- The CSP allows scripts only from the site itself and fonts only from Google Fonts; the form can only post to the same origin.
- No user content is rendered as HTML anywhere on the site; React escapes all output.

## Project structure

```
api/           contact.ts — serverless email function
scripts/       dev-api.mjs (local function runner), make-single-file.mjs
tests/         contact.test.mjs
src/
  content/     editable copy and configuration
  data/        fictional demo datasets
  lib/         formatting, hooks, cross-section helpers
  components/  Header, Footer, Section, LineChart, Code, Icon, Logo
  sections/    one file per page section (+ demos/ for the portfolio demos)
  styles/      tokens.css · base.css · components.css · sections.css
```

## Accessibility & motion

- Every interactive chart and selector works by keyboard (Tab, arrow keys, Home/End, Escape).
- `prefers-reduced-motion` turns off reveals, chart tweens and data-flow animations; every feature still works.
- Demo areas are labelled as demo / fictional data throughout.
