// The seven tools, and the workflow stages they sit in.
// Each tool appears in exactly one stage of the automation map.

export type ToolKey = "sql" | "python" | "excel" | "word" | "vba" | "pq" | "llm";
export type CodeLang = "sql" | "python" | "excel" | "vba" | "m" | "text";

export type Tool = {
  key: ToolKey;
  name: string;
  short: string;
  finance: string;
  lang: CodeLang;
  snippet: string;
};

export const tools: Tool[] = [
  {
    key: "sql",
    name: "SQL",
    short: "Query, join and summarise database records.",
    finance:
      "Pulls exactly the transactions a report needs — filtered by period, joined to customers or cost centres, and summarised before it ever reaches Excel.",
    lang: "sql",
    snippet: `SELECT cost_centre,
       SUM(amount) AS total_spend
FROM   expenses
WHERE  txn_date >= '2025-04-01'
GROUP  BY cost_centre
ORDER  BY total_spend DESC;`,
  },
  {
    key: "pq",
    name: "Power Query",
    short: "Clean, transform and combine data.",
    finance:
      "Connects to folders of monthly files, applies the same cleaning steps every time and refreshes the whole report when new data lands.",
    lang: "m",
    snippet: `let
  Source = Folder.Files("Monthly"),
  Clean  = Table.Distinct(Source, {"TxnID"}),
  Typed  = Table.TransformColumnTypes(
             Clean, {{"Date", type date}})
in Typed`,
  },
  {
    key: "python",
    name: "Python",
    short: "Scripted data processing and repeatable analysis.",
    finance:
      "Handles files too large or too messy for spreadsheets: combining exports, cleaning formats and producing the same analysis every month without manual steps.",
    lang: "python",
    snippet: `import pandas as pd

df = pd.concat(pd.read_csv(f) for f in files)
df = df.drop_duplicates("txn_id")
summary = df.groupby("month")["amount"].sum()`,
  },
  {
    key: "excel",
    name: "Excel",
    short: "Financial models, formulas and reporting.",
    finance:
      "The final mile for most finance teams — structured tables, lookups, pivots and clear report layouts that people already know how to read.",
    lang: "excel",
    snippet: `=SUMIFS(Txn[Amount],
        Txn[Month], $B$2,
        Txn[CostCentre], A5)`,
  },
  {
    key: "vba",
    name: "VBA",
    short: "Automate repetitive Excel workflows.",
    finance:
      "Automates the clicks: splitting a master sheet into files per department, formatting reports, and running a month-end routine with one button.",
    lang: "vba",
    snippet: `For Each ws In ThisWorkbook.Worksheets
    ws.Range("A1").CurrentRegion _
      .Columns.AutoFit
Next ws`,
  },
  {
    key: "word",
    name: "Word",
    short: "Business documents and report templates.",
    finance:
      "Standardised templates and mail-merge documents for letters, summaries and narrative reports that sit alongside the numbers.",
    lang: "text",
    snippet: `«Vendor_Name»
Payment of ₹«Amount» for invoice «Invoice_No»
has been processed on «Payment_Date».`,
  },
  {
    key: "llm",
    name: "LLMs",
    short: "Assist with analysis, drafting and automation.",
    finance:
      "Speeds up drafting formulas, queries and commentary — always reviewed against the source numbers, never treated as the source of truth.",
    lang: "text",
    snippet: `"Summarise the three largest
variances against budget for March
in two sentences each. Use only the
figures in the attached table."`,
  },
];

export const toolByKey = Object.fromEntries(tools.map((t) => [t.key, t])) as Record<ToolKey, Tool>;

export type Stage = {
  key: string;
  n: string;
  label: string;
  /** Plain-language explanation for a non-technical reader. */
  what: string;
  input: string;
  output: string;
  tools: ToolKey[];
  /** Shown instead of tools for the first stage. */
  sources?: string[];
};

export const stages: Stage[] = [
  {
    key: "source",
    n: "01",
    label: "Source data",
    what: "Where the numbers already live. Nothing changes in your accounting system — the workflow only reads from it.",
    input: "Your existing systems",
    output: "Raw exports",
    tools: [],
    sources: ["Accounting / ERP database", "Monthly Excel & CSV exports", "Bank and payment statements"],
  },
  {
    key: "extract",
    n: "02",
    label: "Extract",
    what: "Only the records the report needs are pulled out — the right period, the right accounts — and linked to customers or cost centres.",
    input: "Database tables",
    output: "One report-ready dataset",
    tools: ["sql"],
  },
  {
    key: "clean",
    n: "03",
    label: "Clean & combine",
    what: "Dates, names and amounts are standardised the same way every time. Duplicates are removed and odd rows are set aside for review.",
    input: "Messy files",
    output: "Consistent, trusted rows",
    tools: ["pq", "python"],
  },
  {
    key: "calculate",
    n: "04",
    label: "Calculate",
    what: "Totals, margins and comparisons are worked out with formulas that reconcile back to the source data.",
    input: "Clean rows",
    output: "Financial figures",
    tools: ["excel", "vba"],
  },
  {
    key: "report",
    n: "05",
    label: "Report",
    what: "Figures are laid out in a readable report with short commentary, ready to share — and it refreshes next month without being rebuilt.",
    input: "Figures",
    output: "A report people can act on",
    tools: ["word", "llm"],
  },
];
