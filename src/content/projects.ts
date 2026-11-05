// The three public case studies, written so that anyone can follow them.
// Rules: plain words first, and explain a technical term the first time it appears.
// No invented results, metrics, libraries or employer names. Portal and bank names stay generic on purpose.

export type ArchNode = { t: string; d?: string; tone?: "hub" | "good" | "warn" | "bad" | "info" | "human" };
export type ArchColumn = { label: string; nodes: ArchNode[] };

export type CaseStudy = {
  id: string;
  demo: "mpr" | "control" | "chat";
  title: string;
  tagline: string;
  /** One-paragraph explanation for someone with no technical background. */
  plain: string;
  summary: string;
  stack: string[];
  problem: string;
  why: string[];
  solution: string;
  steps: { t: string; d: string }[];
  architecture: { intro: string; columns: ArchColumn[]; note?: string };
  features: string[];
  validation: string[];
  security: string[];
  value: string[];
  demoTitle: string;
  demoNote: string;
};

export const projects: CaseStudy[] = [
  {
    id: "mpr-checker",
    demo: "mpr",
    title: "MPR Checker",
    tagline: "Automated Attendance Verification with Human-in-the-Loop Controls",
    plain:
      "An MPR is a monthly work-order document that shows each employee's paid days. Its absent days must match the attendance portal. This tool does that comparison, and when it is unsure or finds a difference, it asks a person to check.",
    summary: "A tool that compares MPRs (monthly documents showing employees' paid days) with the attendance portal, and asks a person to check anything unclear.",
    stack: ["Python", "PDF reading", "OCR", "Excel reports"],
    problem:
      "An MPR is a monthly work-order document that shows each employee's paid days, with details such as the order number, month, leave and employee code. Its absent days must match the attendance portal. MPRs are not all the same: some are clean PDFs, while others are scanned copies with stamps, signatures or blank pages.",
    why: [
      "Checking every row by eye is slow and repetitive, and small differences are easy to miss.",
      "A scanned page is really a picture, so a computer cannot simply read its text.",
      "An MPR that cannot be read must never be treated as correct.",
    ],
    solution:
      "The tool collects the MPRs and the portal information, reads each MPR, matches every row by employee code and gives each one a clear result. A person then looks at the items that need a decision.",
    steps: [
      { t: "Collect", d: "Downloads the MPRs and the absent days from the portal." },
      { t: "Read the text", d: "Reads the words directly from the PDF when the PDF contains text." },
      { t: "Match rows", d: "Sorts what it read into rows, using the employee code." },
      { t: "Read the scans", d: "Treats each page as a picture and uses OCR (reading text from images). It also checks stamps, signatures and blank pages." },
      { t: "Rate the quality", d: "Records whether the MPR could be read: Yes, Partly or No." },
      { t: "Compare", d: "Compares the MPR with the absent days in the portal." },
      { t: "Give a result", d: "Marks each item as all clear, already ticked, unreadable or mismatched." },
      { t: "Report", d: "Creates an Excel report and a separate list of items for a person to check." },
    ],
    architecture: {
      intro: "Information moves from left to right, and every item ends with a clear result.",
      columns: [
        { label: "What goes in", nodes: [{ t: "MPR documents" }, { t: "Absent days from the portal" }] },
        { label: "Reading", nodes: [{ t: "Reads PDF text directly" }, { t: "Reads scanned pages", d: "Using OCR" }] },
        { label: "Checking", nodes: [{ t: "Matches rows", d: "By employee code" }, { t: "Rates readability", d: "Yes, Partly or No" }, { t: "Compares with the portal" }] },
        {
          label: "Result",
          nodes: [
            { t: "All clear", tone: "good" },
            { t: "Already ticked", tone: "info" },
            { t: "Unreadable", tone: "warn" },
            { t: "Mismatched", tone: "bad" },
          ],
        },
        { label: "What comes out", nodes: [{ t: "Excel report" }, { t: "List of items to check" }, { t: "A person reviews", tone: "human" }] },
      ],
    },
    features: [
      "Downloads the MPRs and portal information",
      "Reads text directly from PDFs",
      "Matches rows by employee code",
      "Reads scanned pages using OCR",
      "Checks stamps, signatures and blank pages",
      "Rates each MPR as readable: Yes, Partly or No",
      "Marks items as all clear, already ticked, unreadable or mismatched",
      "Creates an Excel report and a list of items to check",
    ],
    validation: [
      "Every MPR gets a readability rating.",
      "An MPR that cannot be read is marked unreadable, never all clear.",
      "Items that need attention go on a separate list.",
      "A person makes the final decision on those items.",
    ],
    security: ["No employee, client or portal information appears on this website.", "The demo on this page uses only made-up data."],
    value: [
      "People can focus on the items that need attention instead of every row.",
      "The same checks run the same way on every MPR.",
      "Every result is saved in a report that can be looked at later.",
    ],
    demoTitle: "Try it yourself",
    demoNote: "A simple example with made-up data. Press Run check, then mark the problem items as reviewed, just as a person would.",
  },
  {
    id: "auto-payroll-dashboard",
    demo: "control",
    title: "Auto Payroll Dashboard",
    tagline: "One-Click Payroll Processing and Financial Control System",
    plain:
      "Paying salaries involves many files, letters and checks. This system brings that work into one control screen, so each job runs from one place using the same checked data.",
    summary: "One control screen that takes payroll from the salary file to bank files, letters and reports.",
    stack: ["Power Query", "VBA", "Excel", "Word mail merge"],
    problem:
      "One payroll run creates many outputs: bank transfer files, files split by category, printed documents, payroll and bank letters, and HR reports. All of them depend on the same data being clean and checked first.",
    why: [
      "Preparing the same data by hand for many files, every time, can lead to differences between them.",
      "A mistake found late can affect every file made after it.",
      "Banks and HR each need their own format, so everything should come from one trusted source.",
    ],
    solution:
      "One Excel workbook uses Power Query (Excel's data cleaning tool) to bring in, clean and group the salary data. A second workbook uses VBA (small programs that automate Excel) to run each job from one control screen.",
    steps: [
      { t: "Bring in", d: "Loads the salary file." },
      { t: "Clean and group", d: "Tidies the data and groups it for the later steps." },
      { t: "Make bank files", d: "Prepares bank transfer files, including NEFT/RTGS and bank-specific formats." },
      { t: "Split", d: "Separates files by category." },
      { t: "Check", d: "Runs HR checks and PF (provident fund) checks, and lists any errors." },
      { t: "Print and write letters", d: "Handles printing, PDFs, payroll letters and bank letters in Word." },
      { t: "Summarise", d: "Creates HR reports and a summary for each work order." },
    ],
    architecture: {
      intro: "One source of data, one control screen, and every output comes from there.",
      columns: [
        { label: "Data", nodes: [{ t: "Salary file" }, { t: "Power Query workbook", d: "Cleans and groups the data" }] },
        { label: "Automation", nodes: [{ t: "VBA workbook", d: "Runs the jobs" }] },
        { label: "Control", nodes: [{ t: "One control screen", d: "Each job starts here", tone: "hub" }] },
        {
          label: "What comes out",
          nodes: [
            { t: "Bank transfer files" },
            { t: "Letters" },
            { t: "Split files" },
            { t: "Prints and PDFs" },
            { t: "HR reports and checks" },
            { t: "Work-order summaries" },
          ],
        },
      ],
    },
    features: [
      "Brings in the salary file",
      "Cleans and groups the data",
      "Prepares NEFT/RTGS and bank-specific files",
      "Splits files by category",
      "Prints and creates PDFs automatically",
      "Creates payroll letters and bank letters",
      "Runs HR checks and creates HR reports",
      "Checks PF (provident fund) details",
      "Creates a list of errors",
      "Summarises each work order",
    ],
    validation: [
      "HR checks are part of the process.",
      "PF checks look at the data the outputs depend on.",
      "Errors are listed so they can be checked and corrected.",
      "Work-order summaries give another way to check the run.",
    ],
    security: ["No employee, salary or bank information appears on this website.", "The demo on this page uses only made-up data."],
    value: [
      "A process with many files runs from one place.",
      "Every output starts from the same cleaned data.",
      "Problems appear in an error list instead of staying hidden in the files.",
    ],
    demoTitle: "Try it yourself",
    demoNote: "A simple example with made-up data. Press Run payroll, then select any finished step to see its result.",
  },
  {
    id: "payroll-ai-assistant",
    demo: "chat",
    title: "Payroll AI Assistant",
    tagline: "Private AI-Powered Payroll Business Intelligence",
    plain:
      "Think of it as a private chat assistant for payroll. People ask a question in everyday English or Hinglish and get an answer from the payroll database. It stays inside the office and is not on the internet.",
    summary: "A private chat assistant that answers payroll questions in everyday English or Hinglish, inside the office.",
    stack: ["Python", "Streamlit", "SQL Server", "Ollama", "qwen2.5-coder:7b"],
    problem:
      "Questions about salary, total employee cost (CTC), departments, work orders, tax deducted from salary (TDS) and trends all need data from the payroll database. Usually, someone has to write a database query or build a report to answer them.",
    why: [
      "The same kinds of question come up again and again, asked in different words.",
      "Payroll information is private, so it should not depend on an AI service on the internet.",
      "Figures must be calculated from real data, not guessed by an AI.",
    ],
    solution:
      "Common questions are recognised by their keywords. Less clear questions go to an AI model (qwen2.5-coder:7b) running on the office PC. The figures come from the payroll database, and the answer appears as a summary, table or chart.",
    steps: [
      { t: "Ask", d: "A person types a question in English or Hinglish on a chat screen built with Streamlit." },
      { t: "Understand", d: "Common questions are recognised by keywords. Less clear ones go to the local AI model." },
      { t: "Find the data", d: "The data and calculations come from the payroll database (SQL Server)." },
      { t: "Answer", d: "The answer appears as a summary, table or chart, and can be downloaded." },
    ],
    architecture: {
      intro: "Each question takes one of two routes, and the data stays on-premises (inside the company).",
      columns: [
        { label: "Question", nodes: [{ t: "Asked in English or Hinglish", d: "On a Streamlit chat screen" }] },
        {
          label: "Understanding it",
          nodes: [
            { t: "Keyword matching", d: "For common questions" },
            { t: "Local AI model", d: "qwen2.5-coder:7b on Ollama, for less clear questions", tone: "hub" },
          ],
        },
        { label: "Data", nodes: [{ t: "Payroll database", d: "SQL Server does the calculations" }] },
        { label: "Answer", nodes: [{ t: "Summary" }, { t: "Table" }, { t: "Chart" }, { t: "Download" }] },
      ],
      note: "Runs on an office PC and the office network only. It is not on the internet.",
    },
    features: [
      "Understands everyday English and Hinglish",
      "Answers salary and total employee cost (CTC) questions",
      "Shows figures by department and category",
      "Analyses work orders and their profit",
      "Gives employee-level answers, subject to permissions",
      "Answers tax (TDS) questions",
      "Shows trends and projections",
      "Calculates figures from the database",
      "Gives summaries, tables, charts and downloads",
      "An administrator controls who has access",
    ],
    validation: [
      "Figures are calculated from the database.",
      "Common questions use keyword matching before the AI is involved.",
      "Tables and downloads let people check the answers.",
    ],
    security: ["The data stays inside the company.", "The AI runs on a local computer.", "The assistant is not on the internet.", "An administrator issues the login details."],
    value: [
      "People can ask for payroll information in everyday language.",
      "Work-order profit, trends and projections are available on request.",
      "The team can use AI on payroll questions without sending data to an internet service.",
    ],
    demoTitle: "Try it yourself",
    demoNote:
      "A separate, simple copy with made-up data. It is not connected to any real system. CTC means the total cost of an employee, base sales means invoice value before GST, and margin means what is left after cost.",
  },
];

export const projectById = (id?: string) => projects.find((p) => p.id === id);
