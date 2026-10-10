// Portfolio demos. All built on fictional data — not client work.
// `demo` must match a key in sections/Portfolio.tsx (the interactive component to show).

export type Project = {
  id: string;
  demo: "join" | "refresh" | "margin";
  title: string;
  tags: string[];
  problem: string;
  approach: string;
  shows: string;
};

export const projects: Project[] = [
  {
    id: "sql-extraction",
    demo: "join",
    title: "SQL Data Extraction & Reporting",
    tags: ["SQL", "Excel"],
    problem: "Invoices and customer details live in separate tables, so every report starts with copy-paste and lookups.",
    approach: "A reusable query joins the tables on the customer key and returns a report-ready dataset in one step.",
    shows: "Switch the join type to see why choosing INNER or LEFT JOIN changes what a report includes.",
  },
  {
    id: "auto-reporting",
    demo: "refresh",
    title: "Automated Financial Reporting",
    tags: ["Power Query", "Excel", "VBA"],
    problem: "A monthly report rebuilt by hand from a growing pile of separate source files.",
    approach: "Power Query combines every file in a folder with the same cleaning rules; the report refreshes with one click.",
    shows: "Add next month’s file and refresh — totals and the trend update without rebuilding anything.",
  },
  {
    id: "wo-profitability",
    demo: "margin",
    title: "Work-Order Profitability Analysis",
    tags: ["SQL", "Excel", "Python"],
    problem: "Revenue is tracked per work order, but costs are scattered across labour, material and overhead records.",
    approach: "Costs are allocated to each work order and compared with revenue to show margin by order and department.",
    shows: "Select a work order to see its cost build-up. Orders under the 15% margin threshold are flagged.",
  },
];
