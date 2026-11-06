// Brand, navigation and contact settings. Edit here: components read from this file.
import type { PageId } from "../lib/route";

export const brand = {
  name: "Cyber Panther",
  owner: "Rushi Makwana",
  positioning: ["Accountant", "Financial Data Analyst", "Financial Automation Specialist"],
  headline: ["Turning Financial Operations", "into Intelligent Systems."],
  lead: "I build systems for daily manual finance work, so the work gets done by the system, accurately and efficiently, and stays under my control.",
};

/** The three ways into the site, shown on the home page. */
export const startingPoints: { n: string; title: string; d: string; to: PageId }[] = [
  { n: "01", title: "Explore My Projects", d: "What I built, why it is useful and why it is better.", to: "projects" },
  { n: "02", title: "Explore Finance Tools", d: "Try small working demos. They all use made-up data.", to: "tools" },
  { n: "03", title: "Discover My Journey", d: "How accounting led me to data, automation and AI.", to: "about" },
];

/** The kind of change my systems make. Never add numbers unless the owner has measured and approved them. */
export const manualVsSystem = [
  { label: "Accurate", manual: "Small differences are easy to miss.", system: "The same checks run the same way every time." },
  { label: "Efficient", manual: "The same work is repeated by hand.", system: "The system does the repeated work. People handle only what needs attention." },
  { label: "In my control", manual: "Work is spread across many files.", system: "It runs from one place, and a person makes the final decision." },
];

export type NavItem = { id: PageId; label: string };

export const nav: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "tools", label: "Tools" },
  { id: "ai-lab", label: "AI Lab" },
  { id: "about", label: "About Me" },
  { id: "contact", label: "Contact" },
];

/** Supporting pages: linked from the mobile menu, the footer and the pages they belong to. */
export const moreNav: NavItem[] = [
  { id: "technology", label: "Technology" },
  { id: "security", label: "Security & Approach" },
  { id: "personal", label: "Personal Projects" },
];

/** Which main menu item stays highlighted on a supporting page. */
export const navParent: Partial<Record<PageId, PageId>> = { technology: "about", security: "about", personal: "projects" };

export const pageTitles: Record<PageId, string> = {
  home: "Finance, Data Analytics & Automation",
  about: "About Me",
  projects: "Projects",
  tools: "Finance Tools",
  "ai-lab": "AI Lab",
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
