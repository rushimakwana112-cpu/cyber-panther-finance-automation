// Fictional rows for the MPR Checker and Auto Payroll Dashboard demos.
// Every outcome and total in those demos is calculated from these rows.

export type MprRow = { code: string; mpr: number | null; portal: number; readable: "Yes" | "Partly" | "No"; ticked: boolean };
export type Outcome = "All clear" | "Already ticked" | "Unreadable" | "Mismatched";

export const mprRows: MprRow[] = [
  { code: "E-1001", mpr: 1, portal: 1, readable: "Yes", ticked: false },
  { code: "E-1002", mpr: 0, portal: 0, readable: "Yes", ticked: false },
  { code: "E-1003", mpr: 2, portal: 2, readable: "Yes", ticked: true },
  { code: "E-1004", mpr: 3, portal: 1, readable: "Yes", ticked: false },
  { code: "E-1005", mpr: null, portal: 2, readable: "No", ticked: false },
  { code: "E-1006", mpr: 0, portal: 0, readable: "Partly", ticked: false },
  { code: "E-1007", mpr: 2, portal: 3, readable: "Partly", ticked: false },
];

export function outcomeOf(r: MprRow): Outcome {
  if (r.readable === "No" || r.mpr === null) return "Unreadable";
  if (r.mpr !== r.portal) return "Mismatched";
  return r.ticked ? "Already ticked" : "All clear";
}

export type PayLine = { code: string; category: "Category A" | "Category B"; bank: "Same bank" | "NEFT/RTGS"; wo: string; net: number; pfOk: boolean };

export const payLines: PayLine[] = [
  { code: "E-2001", category: "Category A", bank: "Same bank", wo: "WO-11", net: 31200, pfOk: true },
  { code: "E-2002", category: "Category A", bank: "NEFT/RTGS", wo: "WO-11", net: 28450, pfOk: true },
  { code: "E-2003", category: "Category A", bank: "Same bank", wo: "WO-11", net: 26900, pfOk: true },
  { code: "E-2004", category: "Category B", bank: "NEFT/RTGS", wo: "WO-24", net: 41300, pfOk: true },
  { code: "E-2005", category: "Category B", bank: "Same bank", wo: "WO-24", net: 37650, pfOk: true },
  { code: "E-2006", category: "Category B", bank: "NEFT/RTGS", wo: "WO-24", net: 22100, pfOk: false },
  { code: "E-2007", category: "Category B", bank: "NEFT/RTGS", wo: "WO-37", net: 24800, pfOk: true },
  { code: "E-2008", category: "Category A", bank: "Same bank", wo: "WO-37", net: 29600, pfOk: true },
];

export const sumNet = (rows: PayLine[]) => rows.reduce((s, r) => s + r.net, 0);

export function groupLines(key: (r: PayLine) => string) {
  const groups = new Map<string, PayLine[]>();
  for (const r of payLines) groups.set(key(r), [...(groups.get(key(r)) ?? []), r]);
  return [...groups.entries()].map(([name, list]) => ({ name, count: list.length, total: sumNet(list) }));
}
