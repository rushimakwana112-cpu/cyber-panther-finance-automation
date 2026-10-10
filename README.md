# Cyber Panther — Finance & Automation

Portfolio website for Rushi — accountant, financial data analyst and financial automation specialist.
Built with React 19, TypeScript and Vite. The production build is a **single self-contained HTML file**.

All figures on the site are fictional demonstration data.

## Run locally

```bash
npm install
npm run dev          # http://localhost:5173
```

## Build

```bash
npm run build
```

This type-checks, builds `dist/index.html` (all JS and CSS inlined) and copies it to
`Cyber Panther.html` in the project root, so the site can still be opened by double-clicking that file.
Upload either file to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, shared hosting…).

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

## Contact form delivery

The form validates locally and **only reports "Message sent" after the endpoint returns a success response.**
Until an endpoint is configured, a submitted form tells the visitor plainly that it was *not* sent and offers
to copy the message (or open their email app, if an address is configured).

To switch delivery on:

1. Create a form endpoint that accepts JSON POSTs — e.g. a free [Formspree](https://formspree.io) form
   (`https://formspree.io/f/xxxxxxx`), or your own serverless function.
2. Copy `.env.example` to `.env` and fill in:
   ```
   VITE_CONTACT_ENDPOINT=https://formspree.io/f/xxxxxxx
   VITE_CONTACT_EMAIL=you@example.com   # optional fallback
   ```
3. Rebuild (`npm run build`). On Netlify/Vercel, set the same variables in the project settings instead.

Both values are public — they ship in the page source — so never put an API secret in them.
The form posts `name, email, company, service, budget, message, _subject` and includes a hidden honeypot field for basic spam filtering.

## Project structure

```
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
