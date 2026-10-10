// Fictional demonstration dataset for the hero dashboard (FY 2025-26, Apr–Mar).
// Every figure on the dashboard is derived from these two series, so totals always agree.

export const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

export const revenue = [842e3, 905e3, 878e3, 951e3, 1012e3, 986e3, 1064e3, 1121e3, 1098e3, 1176e3, 1203e3, 1285e3];
export const expenses = [631e3, 664e3, 652e3, 689e3, 718e3, 702e3, 741e3, 768e3, 759e3, 792e3, 806e3, 842e3];
export const profit = revenue.map((r, i) => r - expenses[i]);
export const margin = revenue.map((r, i) => (profit[i] / r) * 100);

export type MetricKey = "revenue" | "expenses" | "profit" | "margin";
export type MetricKind = "currency" | "percent";

export const metrics: { key: MetricKey; label: string; kind: MetricKind; invert?: boolean }[] = [
  { key: "revenue", label: "Revenue", kind: "currency" },
  { key: "expenses", label: "Expenses", kind: "currency", invert: true },
  { key: "profit", label: "Net profit", kind: "currency" },
  { key: "margin", label: "Margin", kind: "percent" },
];

export type PeriodKey = "q4" | "h2" | "fy";
export type Period = {
  key: PeriodKey;
  label: string;
  long: string;
  start: number;
  compare?: [number, number];
  compareLabel?: string;
};

export const periods: Period[] = [
  { key: "q4", label: "Q4", long: "Jan – Mar 2026", start: 9, compare: [6, 9], compareLabel: "vs Q3" },
  { key: "h2", label: "H2", long: "Oct 2025 – Mar 2026", start: 6, compare: [0, 6], compareLabel: "vs H1" },
  { key: "fy", label: "FY 25-26", long: "Apr 2025 – Mar 2026", start: 0 },
];

export function series(key: MetricKey): number[] {
  switch (key) {
    case "revenue":
      return revenue;
    case "expenses":
      return expenses;
    case "profit":
      return profit;
    case "margin":
      return margin;
  }
}

/** Total of a metric over months [from, to). Margin is recomputed from totals, not averaged. */
export function totalFor(key: MetricKey, from: number, to: number): number {
  const sum = (a: number[]) => a.slice(from, to).reduce((s, v) => s + v, 0);
  if (key === "margin") {
    const r = sum(revenue);
    return ((r - sum(expenses)) / r) * 100;
  }
  return sum(series(key));
}

/** Expense mix. Shares sum to 1 and apply to whichever period is selected. */
export const expenseMix = [
  { key: "salaries", label: "Salaries", share: 0.46, note: "Payroll, statutory contributions and reimbursements." },
  { key: "operations", label: "Operations", share: 0.28, note: "Rent, utilities, logistics and site costs." },
  { key: "it", label: "IT & Tools", share: 0.14, note: "Software licences, hosting and hardware." },
  { key: "other", label: "Other", share: 0.12, note: "Travel, professional fees and miscellaneous." },
];
