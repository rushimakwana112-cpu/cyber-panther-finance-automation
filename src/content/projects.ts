// The three public projects. Keep each one short: what I built, why it is useful, why it is better.
// Rules: plain words, no invented results, and no internal detail. Never name the employer, portals, banks,
// tables, formulas, business rules or AI model versions here: this file is public.

/** In use: working and used in real work. Prototype: a working early version. Experiment: built to learn. */
export type ProjectStage = "in-use" | "prototype" | "experiment";

export const stageInfo: Record<ProjectStage, { label: string; d: string }> = {
  "in-use": { label: "In use", d: "Working and used in real work." },
  prototype: { label: "Prototype", d: "A working early version." },
  experiment: { label: "Experiment", d: "Built to learn. Not finished." },
};

export type CaseStudy = {
  id: string;
  stage: ProjectStage;
  demo: "mpr" | "control" | "chat";
  title: string;
  tagline: string;
  /** One line for project cards. */
  summary: string;
  /** What I built, in a sentence or two. */
  built: string;
  useful: string[];
  better: string[];
  stack: string[];
  demoNote: string;
};

export const projects: CaseStudy[] = [
  {
    id: "document-matcher",
    stage: "in-use",
    demo: "mpr",
    title: "Document Matcher",
    tagline: "PDF & Image Data Extraction and Verification",
    summary: "Reads PDF and image documents, compares them with system records and shows where they do not match.",
    built: "A system that reads information from PDF and image documents, compares it with system records and shows where they do not match. It replaces checking every row by hand.",
    useful: ["Nobody has to compare every row by hand.", "People see only the items that need attention.", "Every result is saved in an Excel report."],
    better: [
      "Each page is read twice, and a value counts only when both reads agree.",
      "When it is unsure, it asks a person instead of guessing.",
      "It only reads the records. It can never change or approve anything.",
      "It runs on a normal office computer, with no internet service.",
    ],
    stack: ["Python", "OCR (reading text from images)", "Excel"],
    demoNote: "Made-up data. Press Run check, then mark the problem items as reviewed, just as a person would.",
  },
  {
    id: "auto-payroll-dashboard",
    stage: "in-use",
    demo: "control",
    title: "Auto Payroll Dashboard",
    tagline: "Payroll Work From One Control Screen",
    summary: "One control screen that takes payroll from the salary file to bank files, letters and reports.",
    built: "An Excel-based control screen that takes payroll from the salary file to bank files, letters, prints and HR reports. It replaces preparing the same data by hand for each file.",
    useful: ["Payroll jobs run from one place instead of many separate files.", "Bank files, letters and reports all come from the same cleaned data.", "Repeated preparation is done by the system."],
    better: [
      "The same steps run the same way every time.",
      "Errors appear in a list instead of staying hidden in the files.",
      "Only people with a login can run it.",
      "It is built in Excel, so nobody needs to learn new software.",
    ],
    stack: ["Excel", "Power Query", "VBA", "Word"],
    demoNote: "Made-up data. Press Run payroll, then select any finished step to see its result.",
  },
  {
    id: "finance-operations-intelligence",
    stage: "in-use",
    demo: "chat",
    title: "Finance Operations Intelligence",
    tagline: "AI-Powered Financial Analytics & Decision Support",
    summary: "A private chat assistant that answers finance and payroll questions in everyday language.",
    built: "A private chat assistant for work orders, salary, invoicing, revenue, margin and financial projections. People ask in everyday English or Hinglish and get a summary, table or chart.",
    useful: ["People get answers without writing a database query.", "Common questions no longer need a new report each time.", "Answers can be downloaded and checked."],
    better: [
      "Figures are calculated from the company's data, not guessed by AI.",
      "Data stays inside the office and goes to no internet AI service.",
      "Each person sees only what they are allowed to see.",
      "It runs on a normal office computer.",
    ],
    stack: ["Python", "SQL Server", "Local AI"],
    demoNote: "Made-up data, not connected to any real system. CTC means the total cost of an employee, and margin means what is left after cost.",
  },
];

export const projectById = (id?: string) => projects.find((p) => p.id === id);
