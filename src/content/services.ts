// Services offered. Add, remove or reorder entries freely:
// - exactly one entry should have `featured: true` (it gets the full section with the SQL demo)
// - every entry appears in the contact form's "Service required" dropdown
// - entries with `summary` are listed under "Also available"

export type Service = {
  id: string;
  title: string;
  featured?: boolean;
  summary?: string;
  deliverables?: string[];
};

export const services: Service[] = [
  {
    id: "sql-reporting",
    title: "SQL Data Extraction & Reporting",
    featured: true,
    summary:
      "Turn records sitting in your business database into structured, reusable reports. I write the queries that extract, filter, join and summarise exactly the data a finance or operations question needs — and hand it over in Excel, ready to use.",
    deliverables: [
      "Custom SQL queries",
      "Data extraction and filtering",
      "Joining and summarising records",
      "Reusable reporting queries",
      "Financial and operational summaries",
      "SQL-to-Excel reporting workflows",
    ],
  },
  {
    id: "report-automation",
    title: "Excel & Power Query report automation",
    summary: "Monthly reports that refresh from source files instead of being rebuilt by hand.",
  },
  {
    id: "data-cleaning",
    title: "Financial data cleaning & analysis",
    summary: "Messy exports standardised, de-duplicated and summarised into clear figures.",
  },
  { id: "other", title: "Something else" },
];

export const featuredService = services.find((s) => s.featured) ?? services[0];
