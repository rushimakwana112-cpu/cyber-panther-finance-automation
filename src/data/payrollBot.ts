// Fictional payroll data for the Payroll AI Assistant demo. Every answer in the demo is
// calculated from these rows, so the totals always reconcile.

export const GST_RATE = 18;

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

/** Invoice value per work order per month, including GST. Base sales = invoice × 100 / 118. */
export const invoicesByWo: Record<string, Record<PayRow["month"], number>> = {
  "WO-A11": { "Aug-2026": 141600, "Sep-2026": 141600 },
  "WO-B07": { "Aug-2026": 118000, "Sep-2026": 118000 },
  "WO-C03": { "Aug-2026": 29500, "Sep-2026": 59000 },
};

export const baseSales = (invoice: number) => (invoice * 100) / (100 + GST_RATE);

export function monthTotals(month: PayRow["month"]) {
  const rows = payRows.filter((r) => r.month === month);
  return {
    month,
    employees: new Set(rows.map((r) => r.emp)).size,
    gross: rows.reduce((s, r) => s + r.gross, 0),
    ctc: rows.reduce((s, r) => s + r.ctc, 0),
  };
}

/** Margin = base sales − CTC; margin % on CTC. Sorted best first. */
export function woMargins(month: PayRow["month"]) {
  return Object.keys(invoicesByWo)
    .map((wo) => {
      const ctc = payRows.filter((r) => r.month === month && r.wo === wo).reduce((s, r) => s + r.ctc, 0);
      const base = baseSales(invoicesByWo[wo][month]);
      return { wo, base, ctc, margin: base - ctc, pct: ((base - ctc) / ctc) * 100 };
    })
    .sort((a, b) => b.pct - a.pct);
}
