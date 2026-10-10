// Fictional raw export for the data-cleaning demo, and what each row becomes.

export type IssueKey = "date" | "name" | "amount" | "duplicate" | "missing" | "category";

export type RawRow = {
  id: string;
  date: string;
  customer: string;
  amount: string;
  category: string;
  issues: IssueKey[];
};

export type CleanRow = { id: string; date: string; customer: string; amount: number; category: string };

export const rawRows: RawRow[] = [
  { id: "TXN-1041", date: "03/04/2025", customer: "abc traders", amount: '"12,500"', category: "Sales", issues: ["date", "name", "amount"] },
  { id: "TXN-1042", date: "2025-04-05", customer: "ABC Traders ", amount: "8400", category: "sales", issues: ["name", "category"] },
  { id: "TXN-1042", date: "2025-04-05", customer: "ABC Traders ", amount: "8400", category: "sales", issues: ["duplicate"] },
  { id: "TXN-1043", date: "7 Apr 25", customer: "Global Exports", amount: "₹ 15,200.00", category: "Sales", issues: ["date", "amount"] },
  { id: "TXN-1044", date: "2025-04-09", customer: "Sunrise Ltd", amount: "", category: "Sales", issues: ["missing"] },
  { id: "TXN-1045", date: "10-04-2025", customer: "NextGen Co", amount: "-3,100", category: "REFUND", issues: ["date", "amount", "category"] },
  { id: "TXN-1046", date: "2025-04-12", customer: "global exports", amount: "9800", category: "SALES", issues: ["name", "category"] },
];

export const cleanRows: CleanRow[] = [
  { id: "TXN-1041", date: "2025-04-03", customer: "ABC Traders", amount: 12500, category: "Sales" },
  { id: "TXN-1042", date: "2025-04-05", customer: "ABC Traders", amount: 8400, category: "Sales" },
  { id: "TXN-1043", date: "2025-04-07", customer: "Global Exports", amount: 15200, category: "Sales" },
  { id: "TXN-1045", date: "2025-04-10", customer: "NextGen Co", amount: -3100, category: "Refund" },
  { id: "TXN-1046", date: "2025-04-12", customer: "Global Exports", amount: 9800, category: "Sales" },
];

export const issueLabels: Record<IssueKey, string> = {
  date: "Inconsistent date format",
  name: "Name casing / spacing",
  amount: "Amount stored as text",
  duplicate: "Duplicate transaction",
  missing: "Missing amount",
  category: "Inconsistent category",
};

export const issueFilters: { key: IssueKey; label: string }[] = [
  { key: "date", label: "Mixed date formats" },
  { key: "name", label: "Name casing & spaces" },
  { key: "amount", label: "Amounts as text" },
  { key: "category", label: "Inconsistent categories" },
  { key: "missing", label: "Missing amount" },
  { key: "duplicate", label: "Duplicate row" },
];

export const issueCount = (k: IssueKey) => rawRows.filter((r) => r.issues.includes(k)).length;

/** Outcome for each raw row, in the original order. */
export const outcomes = rawRows.map((r) =>
  r.issues.includes("duplicate")
    ? ({ kind: "removed", note: "Removed — duplicate of row above" } as const)
    : r.issues.includes("missing")
      ? ({ kind: "held", note: "Held for review — amount missing" } as const)
      : ({ kind: "kept", row: cleanRows.find((c) => c.id === r.id)! } as const),
);

const countWith = (k: IssueKey) => rawRows.filter((r) => r.issues.includes(k) && !r.issues.includes("duplicate")).length;

export const changeLog = [
  { label: "Dates standardised to ISO (YYYY-MM-DD)", count: countWith("date") },
  { label: "Customer names trimmed & matched", count: countWith("name") },
  { label: "Amounts converted to numbers", count: countWith("amount") },
  { label: "Categories normalised", count: countWith("category") },
  { label: "Duplicate rows removed", count: issueCount("duplicate") },
  { label: "Rows with missing amount held for review", count: issueCount("missing") },
];

export const byCustomer = Object.entries(
  cleanRows.reduce<Record<string, { sales: number; refunds: number }>>((acc, r) => {
    acc[r.customer] ??= { sales: 0, refunds: 0 };
    if (r.category === "Refund") acc[r.customer].refunds += r.amount;
    else acc[r.customer].sales += r.amount;
    return acc;
  }, {}),
)
  .map(([customer, v]) => ({ customer, ...v, net: v.sales + v.refunds }))
  .sort((a, b) => b.net - a.net);

export const netSales = byCustomer.reduce((s, c) => s + c.net, 0);
export const grossSales = byCustomer.reduce((s, c) => s + c.sales, 0);
export const refunds = cleanRows.filter((r) => r.category === "Refund");
export const counts = {
  raw: rawRows.length,
  kept: outcomes.filter((o) => o.kind === "kept").length,
  removed: outcomes.filter((o) => o.kind === "removed").length,
  held: outcomes.filter((o) => o.kind === "held").length,
};
