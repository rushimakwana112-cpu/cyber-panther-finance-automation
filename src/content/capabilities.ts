import type { IconName } from "../components/Icon";

export type Capability = { id: string; title: string; d: string; icon: IconName; project?: string; demo?: DemoId };

export const demoList = [
  { id: "dashboard", label: "Financial dashboard", d: "Click the numbers and periods to see a year of made-up results." },
  { id: "cleaning", label: "Data cleaning", d: "Watch seven messy rows turn into a clean report." },
  { id: "sql", label: "Database report", d: "Choose a period and grouping, then run the query to get a report." },
  { id: "join", label: "Combining tables", d: "See how joining two tables changes who appears in a report." },
  { id: "refresh", label: "One-click report update", d: "Add next month's file and update the report without rebuilding it." },
  { id: "margin", label: "Profit by work order", d: "Select a work order to see its costs and profit." },
] as const;

export type DemoId = (typeof demoList)[number]["id"];

export const capabilities: Capability[] = [
  { id: "payroll-automation", title: "Payroll processing automation", icon: "calc", d: "Taking payroll from the salary file to bank files, letters and reports through one controlled process.", project: "auto-payroll-dashboard" },
  { id: "finance-workflow", title: "Finance workflow automation", icon: "flow", d: "Turning repeated finance tasks into a process that runs the same way every time.", demo: "refresh" },
  { id: "data-analysis", title: "Financial data analysis", icon: "chart", d: "Turning financial data into summaries, comparisons and trends that are easy to understand.", demo: "dashboard" },
  { id: "sql-reporting", title: "SQL-based reporting", icon: "database", d: "Getting the right information out of a database and into a report that can be used again.", demo: "sql" },
  { id: "document-processing", title: "Document processing", icon: "file", d: "Reading PDFs and scanned documents, and turning them into data that can be checked.", project: "pdf-image-reader" },
  { id: "reconciliation", title: "Financial reconciliation", icon: "ledger", d: "Comparing records from different places and showing where they do not match.", demo: "cleaning" },
  { id: "business-intelligence", title: "Business intelligence", icon: "insight", d: "Showing profit, work-order and trend information that helps answer business questions.", demo: "margin" },
  { id: "local-ai", title: "Local AI assistants", icon: "shield", d: "Private chat assistants that answer from business data, with the AI running on a local computer.", project: "finance-operations-intelligence" },
];
