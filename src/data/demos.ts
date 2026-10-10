// Fictional datasets for the SQL console and portfolio demos.

export const sales = [
  { customer: "ABC Traders", region: "West", q: 1, amount: 284000 },
  { customer: "ABC Traders", region: "West", q: 2, amount: 312500 },
  { customer: "ABC Traders", region: "West", q: 3, amount: 338000 },
  { customer: "ABC Traders", region: "West", q: 4, amount: 351200 },
  { customer: "Global Exports", region: "North", q: 1, amount: 221400 },
  { customer: "Global Exports", region: "North", q: 2, amount: 236900 },
  { customer: "Global Exports", region: "North", q: 3, amount: 251300 },
  { customer: "Global Exports", region: "North", q: 4, amount: 268750 },
  { customer: "Sunrise Ltd", region: "South", q: 1, amount: 168200 },
  { customer: "Sunrise Ltd", region: "South", q: 2, amount: 159800 },
  { customer: "Sunrise Ltd", region: "South", q: 3, amount: 181600 },
  { customer: "Sunrise Ltd", region: "South", q: 4, amount: 176430 },
  { customer: "NextGen Co", region: "West", q: 1, amount: 98400 },
  { customer: "NextGen Co", region: "West", q: 2, amount: 112600 },
  { customer: "NextGen Co", region: "West", q: 3, amount: 121900 },
  { customer: "NextGen Co", region: "West", q: 4, amount: 136280 },
  { customer: "Meridian Foods", region: "South", q: 1, amount: 72100 },
  { customer: "Meridian Foods", region: "South", q: 2, amount: 88300 },
  { customer: "Meridian Foods", region: "South", q: 3, amount: 79400 },
  { customer: "Meridian Foods", region: "South", q: 4, amount: 94650 },
];
/** Each row in `sales` represents one fictional customer-quarter with this many invoices. */
export const INVOICES_PER_QUARTER = 12;

export const quarterRanges: Record<string, [string, string]> = {
  "1": ["2025-04-01", "2025-06-30"],
  "2": ["2025-07-01", "2025-09-30"],
  "3": ["2025-10-01", "2025-12-31"],
  "4": ["2026-01-01", "2026-03-31"],
  all: ["2025-04-01", "2026-03-31"],
};

export const workOrders = [
  { id: "WO-2501", dept: "Facilities", revenue: 480000, labour: 212000, material: 118000, overhead: 46000 },
  { id: "WO-2502", dept: "IT Services", revenue: 365000, labour: 148000, material: 42000, overhead: 38000 },
  { id: "WO-2503", dept: "Logistics", revenue: 295000, labour: 151000, material: 88000, overhead: 31000 },
  { id: "WO-2504", dept: "Facilities", revenue: 412000, labour: 236000, material: 121000, overhead: 44000 },
  { id: "WO-2505", dept: "Consulting", revenue: 268000, labour: 118000, material: 9000, overhead: 27000 },
  { id: "WO-2506", dept: "IT Services", revenue: 338000, labour: 171000, material: 61000, overhead: 35000 },
].map((w) => {
  const cost = w.labour + w.material + w.overhead;
  return { ...w, cost, margin: ((w.revenue - cost) / w.revenue) * 100 };
});
export const MARGIN_THRESHOLD = 15;

export const monthlyFiles = [
  { name: "Sales_Apr.xlsx", month: "Apr", rows: 412, total: 842000 },
  { name: "Sales_May.xlsx", month: "May", rows: 437, total: 905000 },
  { name: "Sales_Jun.xlsx", month: "Jun", rows: 425, total: 878000 },
  { name: "Sales_Jul.xlsx", month: "Jul", rows: 458, total: 951000 },
];

export const customers = [
  { id: "C01", name: "ABC Traders" },
  { id: "C02", name: "Global Exports" },
  { id: "C03", name: "Sunrise Ltd" },
  { id: "C04", name: "Meridian Foods" },
];

export const invoices = [
  { no: "INV-301", cust: "C01", amount: 124500 },
  { no: "INV-302", cust: "C02", amount: 98750 },
  { no: "INV-303", cust: "C01", amount: 41200 },
  { no: "INV-304", cust: "C03", amount: 76430 },
];
