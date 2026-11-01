// Applied-AI case studies. Add a new object here to show another project — the section
// switches to tabs automatically when there is more than one.
// `demo` must match a key in sections/AiProjects.tsx (or be omitted for no interactive demo).
// Describe only what the project really does; no invented results or metrics.

export type AiProject = {
  id: string;
  demo?: "payroll-chat";
  title: string;
  status: string;
  summary: string;
  problem: string;
  steps: { t: string; d: string }[];
  stack: { group: string; items: string[] }[];
  features: string[];
  helps: { who: string; d: string }[];
  guardrails: string[];
  demoNote?: string;
  screenshot?: { src: string; alt: string; caption: string };
  analysis?: { title: string; d: string; examples: string[] };
};

export const aiProjects: AiProject[] = [
  {
    id: "payroll-ai",
    demo: "payroll-chat",
    title: "Payroll AI Assistant",
    status: "Internal tool · runs fully on-premise",
    summary:
      "A private chatbot that answers payroll questions in plain English — totals, work-order margin, TDS, projections — straight from the payroll database. The AI runs on an ordinary office PC, so salary data never leaves the building.",
    problem:
      "Every payroll question — “total CTC for September”, “which work orders lost margin”, “TDS under the new regime” — meant writing a fresh SQL query or building another pivot table. The team had to wait for someone who knew the database.",
    steps: [
      { t: "Ask", d: "Type a question in everyday words on the chat page, from any PC on the office network." },
      { t: "Understand", d: "A local language model (Qwen 2.5 via Ollama) reads the question and picks the right report, month type and filters." },
      { t: "Query", d: "The report runs as fixed, parameterised, read-only SQL on SQL Server — the AI chooses, it never edits data." },
      { t: "Apply rules", d: "The policy engine hides columns or limits rows for each user, and company formulas (base sales, margin, take-home) are applied the same way every time." },
      { t: "Answer", d: "A table, chart and short explanation, with follow-up questions and a full-row CSV download." },
    ],
    stack: [
      { group: "AI", items: ["Ollama", "Qwen 2.5 (3B, local)", "nomic-embed-text"] },
      { group: "Data", items: ["SQL Server", "T-SQL procedures", "TDS functions FY 2026-27"] },
      { group: "App", items: ["Python", "pandas", "pyodbc", "Starlette + Uvicorn", "HTML / JS chat", "Streamlit admin"] },
      { group: "Built with", items: ["Claude Code (AI pair-programmer)"] },
    ],
    features: [
      "Totals by salary month, liable month or payment month",
      "Work-order base sales (excl. GST), CTC and margin",
      "TDS calculator — old and new regime, FY 2026-27, worked out on the PC",
      "Salary run — salary to pay and TDS to deduct for every employee, as CSV",
      "Projections for coming months, and projected vs actual",
      "Employee work-order history — continuous or with breaks",
      "Query history — re-ask any past question in one click",
      "Follow-up questions, rankings, comparisons and CSV export",
    ],
    helps: [
      {
        who: "Me",
        d: "Questions I used to answer by writing a new query now take one sentence. My time goes into checking numbers, not assembling them.",
      },
      {
        who: "Payroll & finance team",
        d: "Anyone with an ID can ask in plain English — no SQL, no waiting. Answers arrive as a table, chart or CSV ready to share.",
      },
      {
        who: "Managers",
        d: "Work-order margin, month-on-month change and projections on demand, always calculated with the same company formulas.",
      },
      {
        who: "Data security",
        d: "No cloud AI, nothing in URLs, read-only queries and per-user permissions — sensitive salary data stays on the office network.",
      },
    ],
    guardrails: [
      "AI picks the report; SQL stays fixed, parameterised and read-only",
      "Per-user rules: hidden columns, totals-only, department limits",
      "Login with lockout, idle sign-out and an audit log",
      "Query time limits and a validity date set by the admin",
    ],
    demoNote:
      "This demo is a simplified copy, only to show how the assistant turns a question into data. It uses a few made-up rows; the real assistant works on the full payroll table.",
    screenshot: {
      src: "/payroll-assistant.jpg",
      alt: "The real Payroll AI Assistant answering “give me projection of oct-26” with a summary, four KPI tiles and a work-order margin chart.",
      caption: "The real assistant answering “give me projection of oct-26”. Running on dummy test data; work-order codes masked.",
    },
    analysis: {
      title: "Ask it any kind of analysis",
      d: "The examples above are only a few. Ask in your own words — totals, comparisons, rankings, projections, what-ifs or “why did this change”. When no ready-made report fits, the assistant writes its own read-only query, checks it, and explains the result.",
      examples: [
        "Why is the Sep-26 projection different from the actual?",
        "Top 10 employees by CTC this year",
        "Margin % by department for Q2",
        "Which work orders end next month?",
        "What if salaries rise 5% from Nov?",
        "Salary run for Oct-26 with TDS",
      ],
    },
  },
];
