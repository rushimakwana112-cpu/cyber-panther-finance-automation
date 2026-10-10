// Brand, navigation and contact settings. Edit here — components read from this file.

export const brand = {
  name: "Cyber Panther",
  descriptor: "Finance & Automation",
  owner: "Rushi",
  roles: ["Accountant", "Financial Data Analyst", "Financial Automation Specialist"],
  headline: "Turn Financial Data Into Business Intelligence.",
  // The two words that receive the accent treatment in the hero headline.
  headlineAccent: "Business Intelligence.",
  lead: "I help businesses organize financial data, automate recurring reports, and turn complex information into clear, useful business insights.",
  audience:
    "For business owners, finance teams and accounting practices that rebuild the same reports every month.",
  tagline: "Cleaner data, automated reports, clearer decisions.",
};

export type NavItem = { id: string; label: string };

/** Header navigation. `id` must match a section id on the page. */
export const nav: NavItem[] = [
  { id: "services", label: "Services" },
  { id: "workflow", label: "Workflow" },
  { id: "portfolio", label: "Portfolio" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

/**
 * Sections that are not in the nav, mapped to the nav item they should highlight
 * (e.g. the data-cleaning demo keeps "Workflow" lit). Map to "home" to highlight nothing.
 */
export const navAliases: Record<string, string> = {
  strengths: "home",
  process: "workflow",
};

/** Social links shown in the footer. Leave empty to hide the row. */
export const socials: { label: "LinkedIn" | "GitHub" | "Email"; href: string }[] = [];

/**
 * Contact form delivery.
 *  - endpoint: where the form posts. Defaults to the site's own server function (api/contact.ts),
 *    which emails the enquiry. Override with VITE_CONTACT_ENDPOINT only to use another service.
 *    When the page is opened from disk (file://) there is no server, so the form reports that honestly.
 *  - email: optional public address for the "send via your email app" fallback (VITE_CONTACT_EMAIL).
 * Both values are public page content — never put a secret in a VITE_ variable.
 */
const servedOverHttp = typeof location !== "undefined" && location.protocol.startsWith("http");

export const contactConfig = {
  endpoint: servedOverHttp ? (import.meta.env.VITE_CONTACT_ENDPOINT ?? "").trim() || "/api/contact" : "",
  email: (import.meta.env.VITE_CONTACT_EMAIL ?? "").trim(),
};

export const budgets = [
  "Under ₹10,000",
  "₹10,000 – ₹25,000",
  "₹25,000 – ₹50,000",
  "Above ₹50,000",
  "Not sure yet",
];
