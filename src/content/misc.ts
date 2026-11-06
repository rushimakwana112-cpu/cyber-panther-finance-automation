// Smaller content blocks: technology groups, approach and personal projects.
import type { IconName } from "../components/Icon";
import type { ProjectStage } from "./projects";

/** Every tool has a plain meaning next to it, so nobody needs a technical background to follow. */
export const techGroups: { title: string; plain: string; icon: IconName; items: { name: string; plain: string }[] }[] = [
  {
    title: "Financial tools",
    plain: "Everyday tools of finance work",
    icon: "ledger",
    items: [
      { name: "Excel", plain: "Spreadsheets and reports" },
      { name: "VBA", plain: "Small programs that automate Excel" },
      { name: "Power Query", plain: "Cleans and combines data in Excel" },
      { name: "Tally Prime", plain: "Accounting software" },
      { name: "SAP Business One", plain: "Business management software" },
    ],
  },
  {
    title: "Data",
    plain: "Storing and working with information",
    icon: "database",
    items: [
      { name: "Python", plain: "A programming language" },
      { name: "pandas", plain: "Works with tables of data in Python" },
      { name: "openpyxl", plain: "Lets Python read and write Excel files" },
      { name: "SQL Server", plain: "A database for business data" },
      { name: "T-SQL", plain: "The language used to ask SQL Server for data" },
      { name: "pyodbc", plain: "Connects Python to a database" },
    ],
  },
  {
    title: "Automation",
    plain: "Letting computers do repeated work",
    icon: "flow",
    items: [
      { name: "Regex", plain: "Finds patterns in text" },
      { name: "PDF extraction", plain: "Pulls text out of PDFs" },
      { name: "OCR", plain: "Reads text from images and scans" },
      { name: "Document processing", plain: "Reads and checks documents automatically" },
      { name: "Workflow automation", plain: "Connects tasks so they run in order" },
    ],
  },
  {
    title: "AI",
    plain: "Tools that understand everyday language",
    icon: "insight",
    items: [
      { name: "Ollama", plain: "Runs AI models on your own computer" },
      { name: "Local LLMs", plain: "AI models that run without the internet" },
      { name: "Hybrid chatbot architecture", plain: "A chatbot using both fixed rules and AI" },
      { name: "Streamlit", plain: "Builds simple web screens with Python" },
      { name: "AI-assisted development", plain: "Using AI to help write software" },
    ],
  },
];

export const approachSteps = [
  { t: "Understand the problem", d: "Learn how the work is really done and where it goes wrong." },
  { t: "Define the rules", d: "Write down the business rules before building anything." },
  { t: "Build the solution", d: "Choose a tool that suits the work and the people who will use it." },
  { t: "Check the results", d: "Compare the results with the original data." },
  { t: "Ask a person when unsure", d: "Send unclear or mismatched items to a person instead of guessing." },
  { t: "Protect private information", d: "Treat payroll and financial data as private at every step." },
  { t: "Test before changing", d: "Test every change before relying on it." },
];

export const principles: { t: string; d: string; icon: IconName }[] = [
  { t: "Privacy first", d: "Private financial and payroll data should stay where it belongs.", icon: "shield" },
  { t: "Local processing", d: "Private data can be processed on local computers. Finance Operations Intelligence runs its AI this way.", icon: "database" },
  { t: "People stay in control", d: "Automation does the repeated work. A person decides on the exceptions.", icon: "check" },
  { t: "Made-up examples only", d: "Every figure and demo on this website is made up. The site is not connected to any company system.", icon: "alert" },
];

export const personalProjects: { id: string; title: string; kind: string; stage: ProjectStage; status: string; d: string; tags: string[]; link?: { href: string; label: string } }[] = [
  {
    id: "synk",
    title: "Synk",
    kind: "Windows desktop app",
    stage: "in-use",
    status: "In use, updated as needed",
    d: "A Windows app with notes, screen time, reminders and text tools that work offline.",
    tags: ["Windows"],
    link: { href: "https://apps.microsoft.com/detail/9n4tmbkq849c?hl=en-US&gl=IN", label: "Get Synk on Microsoft Store" },
  },
  {
    id: "just-go-fit",
    title: "Just Go Fit",
    kind: "Android app",
    stage: "in-use",
    status: "In use, updated as needed",
    d: "A fitness app that helps you stay on track with workouts, streaks and rewards. You can pause it during illness or an emergency without losing progress.",
    tags: ["Android"],
  },
  {
    id: "compliance-copilot",
    title: "Payroll & Labour Compliance Copilot",
    kind: "Learning project",
    stage: "experiment",
    status: "Under construction",
    d: "A project I am building to learn how AI can answer questions from documents (a method called RAG), using Indian payroll and labour-law documents. It is for learning and is not a finished product.",
    tags: ["RAG", "Local AI", "Python"],
  },
];


/** AI Lab items. Labels must stay honest: only the owner can confirm a label. */
export const labItems: { title: string; stage: ProjectStage; d: string; link: { href: string; label: string } }[] = [
  {
    title: "Finance Operations Intelligence",
    stage: "in-use",
    d: "A private chat assistant for finance questions. AI helps understand the question, and the figures come from the company's data.",
    link: { href: "#/projects/finance-operations-intelligence", label: "See what it does" },
  },
  {
    title: "Document Matcher: AI tested, not used",
    stage: "in-use",
    d: "I tested AI models for reading documents. A simpler method without AI was more accurate, so I kept the simpler method.",
    link: { href: "#/projects/document-matcher", label: "See what it does" },
  },
  {
    title: "Payroll & Labour Compliance Copilot",
    stage: "experiment",
    d: "A project I am building to learn how AI can answer questions from documents, using Indian payroll and labour-law documents.",
    link: { href: "#/personal", label: "See personal projects" },
  },
];

export const aiRules: { t: string; d: string; icon: IconName }[] = [
  { t: "Figures come from the data", d: "Numbers are calculated from the data. They are not guessed by an AI.", icon: "database" },
  { t: "Private data stays private", d: "AI that works with private data runs on a local computer, not an internet service.", icon: "shield" },
  { t: "A person makes the decision", d: "AI and automation do the repeated work. A person decides on the exceptions.", icon: "check" },
];
