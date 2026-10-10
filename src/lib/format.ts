import type { MetricKind } from "../data/finance";

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** Full rupee amount, Indian digit grouping: ₹12,34,500 */
export const rupees = (v: number) => `${v < 0 ? "−" : ""}₹${inr.format(Math.abs(Math.round(v)))}`;

/** Compact rupee amount using lakh / crore: ₹1.25 Cr, ₹87.64 L */
export function rupeesShort(v: number): string {
  const a = Math.abs(v);
  const sign = v < 0 ? "−" : "";
  if (a >= 1e7) return `${sign}₹${(a / 1e7).toFixed(2)} Cr`;
  if (a >= 1e5) return `${sign}₹${(a / 1e5).toFixed(2)} L`;
  if (a >= 1e3) return `${sign}₹${(a / 1e3).toFixed(1)} K`;
  return `${sign}₹${a.toFixed(0)}`;
}

export const percent = (v: number, digits = 1) => `${v.toFixed(digits)}%`;

export const formatMetric = (kind: MetricKind, v: number, compact = true) =>
  kind === "percent" ? percent(v) : compact ? rupeesShort(v) : rupees(v);
