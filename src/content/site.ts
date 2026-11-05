// Brand, navigation and contact settings. Edit here: components read from this file.
import type { PageId } from "../lib/route";

export const brand = {
  name: "Cyber Panther",
  descriptor: "Finance & Automation",
  owner: "Rushi Makwana",
  positioning: ["Finance", "Accounting", "Payroll Operations", "Automation", "Data Analytics"],
  headline: ["Finance Expertise.", "Intelligent Automation.", "Real Business Impact."],
  message: "Transforming Finance Operations Through Intelligent Automation.",
  lead: "I work in finance, accounting and payroll, and I build tools that take over repetitive work, check for mistakes and make reports easier to read. I use tools such as Excel, Python, SQL and AI.",
};

export type NavItem = { id: PageId; label: string };

export const nav: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Me" },
  { id: "projects", label: "Projects" },
  { id: "capabilities", label: "Capabilities" },
  { id: "technology", label: "Technology" },
  { id: "security", label: "Security & Approach" },
  { id: "personal", label: "Personal Projects" },
  { id: "contact", label: "Contact" },
];

export const pageTitles: Record<PageId, string> = {
  home: "Finance, Payroll Operations & Automation",
  about: "About Me",
  projects: "Projects",
  capabilities: "Capabilities",
  technology: "Technology",
  security: "Security & Approach",
  personal: "Personal Projects",
  contact: "Contact",
};

/** Social links shown in the footer. Leave empty to hide the row. */
export const socials: { label: "LinkedIn" | "GitHub" | "Email"; href: string }[] = [];

/**
 * Contact form delivery.
 *  - endpoint: where the form posts. Defaults to the site's own server function (api/contact.ts),
 *    which emails the enquiry. Override with VITE_CONTACT_ENDPOINT only to use another service.
 *    When the page is opened from disk (file://) there is no server, so the form reports that honestly.
 *  - email: optional public address for the "send via your email app" fallback (VITE_CONTACT_EMAIL).
 * Both values are public page content. Never put a secret in a VITE_ variable.
 */
const servedOverHttp = typeof location !== "undefined" && location.protocol.startsWith("http");

export const contactConfig = {
  endpoint: servedOverHttp ? (import.meta.env.VITE_CONTACT_ENDPOINT ?? "").trim() || "/api/contact" : "",
  email: (import.meta.env.VITE_CONTACT_EMAIL ?? "").trim(),
};

export const opportunityTypes = ["Full-time job", "Contract or part-time work", "Something else"];
