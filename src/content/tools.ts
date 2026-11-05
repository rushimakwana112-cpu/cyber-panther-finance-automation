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
    short: "Gets information out of a database.",
    finance:
      "Pulls out only the records a report needs, such as one month of sales, and adds them up.",
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
    short: "Cleans and combines data in Excel.",
    finance:
      "Reads a folder of monthly files, cleans them the same way every time and updates the report when a new file arrives.",
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
    short: "A programming language for repeated data work.",
    finance:
      "Combines and cleans files that are too large or messy for a spreadsheet, and repeats the same work every month.",
    lang: "python",
    snippet: `import pandas as pd

df = pd.concat(pd.read_csv(f) for f in files)
df = df.drop_duplicates("txn_id")
summary = df.groupby("month")["amount"].sum()`,
  },
  {
    key: "excel",
    name: "Excel",
    short: "Spreadsheets, formulas and reports.",
    finance:
      "Shows the final numbers in tables and reports that most finance teams already know how to read.",
    lang: "excel",
    snippet: `=SUMIFS(Txn[Amount],
        Txn[Month], $B$2,
        Txn[CostCentre], A5)`,
  },
  {
    key: "vba",
    name: "VBA",
    short: "Small programs that automate Excel.",
    finance:
      "Does repeated clicks for you, such as splitting a sheet into one file per department or formatting a report.",
    lang: "vba",
    snippet: `For Each ws In ThisWorkbook.Worksheets
    ws.Range("A1").CurrentRegion _
      .Columns.AutoFit
Next ws`,
  },
  {
    key: "word",
    name: "Word",
    short: "Letters and report templates.",
    finance:
      "Fills names and amounts into letter templates automatically, a feature called mail merge.",
    lang: "text",
    snippet: `«Vendor_Name»
Payment of ₹«Amount» for invoice «Invoice_No»
has been processed on «Payment_Date».`,
  },
  {
    key: "llm",
    name: "AI models",
    short: "Help with analysis and writing.",
    finance:
      "Helps draft formulas, queries and comments. The results are always checked against the original numbers.",
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
    what: "Where the numbers already are. The process only reads this data and does not change it.",
    input: "Your current systems",
    output: "Raw data",
    tools: [],
    sources: ["Accounting software", "Monthly Excel and CSV files", "Bank and payment statements"],
  },
  {
    key: "extract",
    n: "02",
    label: "Get the data",
    what: "Only the records the report needs are pulled out, such as the right month and accounts.",
    input: "Database tables",
    output: "One set of data for the report",
    tools: ["sql"],
  },
  {
    key: "clean",
    n: "03",
    label: "Clean and combine",
    what: "Dates, names and amounts are corrected the same way every time. Repeated rows are removed and unusual rows are kept aside for a person to check.",
    input: "Messy files",
    output: "Clean data",
    tools: ["pq", "python"],
  },
  {
    key: "calculate",
    n: "04",
    label: "Calculate",
    what: "Totals, profit and comparisons are calculated, and can be traced back to the original data.",
    input: "Clean rows",
    output: "Final numbers",
    tools: ["excel", "vba"],
  },
  {
    key: "report",
    n: "05",
    label: "Report",
    what: "The numbers appear in a clear report with short comments. Next month it can be updated without starting again.",
    input: "Final numbers",
    output: "A report people can act on",
    tools: ["word", "llm"],
  },
];
