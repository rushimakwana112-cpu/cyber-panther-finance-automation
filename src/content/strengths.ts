import type { IconName } from "../components/Icon";

export type Strength = { key: string; title: string; body: string; detail: string; icon: IconName };

export const strengths: Strength[] = [
  {
    key: "accountant",
    title: "Accountant",
    body: "Understanding financial records, accounting workflows, reconciliation, and reporting requirements.",
    detail: "Knows what a ledger, a trial balance and a month-end close actually need.",
    icon: "ledger",
  },
  {
    key: "analyst",
    title: "Financial Data Analyst",
    body: "Working with structured data to create summaries, comparisons, trends, and useful business insights.",
    detail: "Turns rows of transactions into answers a manager can act on.",
    icon: "chart",
  },
  {
    key: "automation",
    title: "Financial Automation Specialist",
    body: "Using data transformation and automation tools to reduce repetitive reporting work and improve consistency.",
    detail: "Builds the refreshable version of the report you rebuild every month.",
    icon: "flow",
  },
];

export const principles = [
  { t: "Reconciles to source", d: "Every total can be traced back to the rows it came from." },
  { t: "Built to refresh", d: "If you run it monthly, it should run without rebuilding." },
  { t: "Exceptions surfaced", d: "Odd records are flagged for review, never silently dropped." },
];
