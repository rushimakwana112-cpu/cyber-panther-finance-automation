// Fictional payroll data for the Finance Operations Intelligence demo. Every answer in the demo is
// calculated from these rows, so the totals always reconcile. This is a simple example, not a real method.

export type PayRow = { emp: string; wo: string; month: "Aug-2026" | "Sep-2026"; gross: number; ctc: number };

export const payRows: PayRow[] = [
  { emp: "E101", wo: "WO-A11", month: "Aug-2026", gross: 32000, ctc: 36400 },
  { emp: "E102", wo: "WO-A11", month: "Aug-2026", gross: 28500, ctc: 32450 },
  { emp: "E103", wo: "WO-A11", month: "Aug-2026", gross: 30000, ctc: 34150 },
  { emp: "E104", wo: "WO-B07", month: "Aug-2026", gross: 40000, ctc: 45550 },
  { emp: "E105", wo: "WO-B07", month: "Aug-2026", gross: 38500, ctc: 43850 },
  { emp: "E106", wo: "WO-C03", month: "Aug-2026", gross: 22000, ctc: 25050 },
  { emp: "E101", wo: "WO-A11", month: "Sep-2026", gross: 32000, ctc: 36400 },
  { emp: "E102", wo: "WO-A11", month: "Sep-2026", gross: 28500, ctc: 32450 },
  { emp: "E103", wo: "WO-A11", month: "Sep-2026", gross: 30000, ctc: 34150 },
  { emp: "E104", wo: "WO-B07", month: "Sep-2026", gross: 41000, ctc: 46700 },
  { emp: "E105", wo: "WO-B07", month: "Sep-2026", gross: 38500, ctc: 43850 },
  { emp: "E106", wo: "WO-C03", month: "Sep-2026", gross: 22000, ctc: 25050 },
  { emp: "E107", wo: "WO-C03", month: "Sep-2026", gross: 21500, ctc: 24480 },
];

/** Made-up sales per work order per month. */
export const salesByWo: Record<string, Record<PayRow["month"], number>> = {
  "WO-A11": { "Aug-2026": 120000, "Sep-2026": 120000 },
  "WO-B07": { "Aug-2026": 100000, "Sep-2026": 100000 },
  "WO-C03": { "Aug-2026": 25000, "Sep-2026": 50000 },
};

export function monthTotals(month: PayRow["month"]) {
  const rows = payRows.filter((r) => r.month === month);
  return {
    month,
    employees: new Set(rows.map((r) => r.emp)).size,
    gross: rows.reduce((s, r) => s + r.gross, 0),
    ctc: rows.reduce((s, r) => s + r.ctc, 0),
  };
}

/** Margin is what is left after cost, shown as a share of sales. Sorted best first. */
export function woMargins(month: PayRow["month"]) {
  return Object.keys(salesByWo)
    .map((wo) => {
      const ctc = payRows.filter((r) => r.month === month && r.wo === wo).reduce((s, r) => s + r.ctc, 0);
      const sales = salesByWo[wo][month];
      return { wo, sales, ctc, margin: sales - ctc, pct: ((sales - ctc) / sales) * 100 };
    })
    .sort((a, b) => b.pct - a.pct);
}
