import { useEffect, useState } from "react";

// Small hash router. Hash routes need no server or vercel.json change, and every view has its own
// link. Format: #/page/param/sub, e.g. #/projects/mpr-checker or #/contact/automation/sql-reporting.

export type PageId = "home" | "about" | "projects" | "capabilities" | "technology" | "security" | "personal" | "contact";
export type Route = { page: PageId; param?: string; sub?: string };

const pages: PageId[] = ["home", "about", "projects", "capabilities", "technology", "security", "personal", "contact"];

/** Links to the previous one-page site keep working. */
const legacy: Record<string, string> = {
  contact: "/contact",
  about: "/about",
  services: "/capabilities",
  process: "/capabilities/cleaning",
  portfolio: "/projects",
  "ai-projects": "/projects/payroll-ai-assistant",
  workflow: "/technology",
  strengths: "/",
  home: "/",
};

export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#/, "");
  const path = raw.startsWith("/") ? raw : (legacy[raw] ?? "/");
  const [page, param, sub] = path.split("/").filter(Boolean).map(decodeURIComponent);
  return pages.includes(page as PageId) ? { page: page as PageId, param, sub } : { page: "home" };
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

export const href = {
  page: (p: PageId) => (p === "home" ? "#/" : `#/${p}`),
  project: (id: string) => `#/projects/${id}`,
  demo: (id: string) => `#/capabilities/${id}`,
  opportunity: "#/contact/opportunity",
  automation: (topic?: string) => (topic ? `#/contact/automation/${topic}` : "#/contact/automation"),
};
