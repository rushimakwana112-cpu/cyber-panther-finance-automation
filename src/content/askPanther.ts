// Ask Panther: a website guide that answers only from the approved text below.
// It is not an AI model. It runs in the visitor's browser, so questions go nowhere, and there is
// no API key or running cost. To add an answer, add an entry: longer keyword matches win.
// Keep answers in plain language and only state what the site itself says. Never invent anything.

export type Answer = { id: string; keys: string[]; text: string; link?: { href: string; label: string } };

const contact = { href: "#/contact", label: "Go to Contact" };
const projects = { href: "#/projects", label: "See the projects" };
const mpr = { href: "#/projects/mpr-checker", label: "Open MPR Checker" };
const payroll = { href: "#/projects/auto-payroll-dashboard", label: "Open Auto Payroll Dashboard" };
const assistant = { href: "#/projects/payroll-ai-assistant", label: "Open Payroll AI Assistant" };
const tech = { href: "#/technology", label: "See Technology" };

export const answers: Answer[] = [
  { id: "hello", keys: ["hi", "hello", "hey", "namaste", "good morning", "good evening"], text: "Hello! Ask me about Rushi's projects, skills or how to get in touch. You can use simple words." },
  { id: "thanks", keys: ["thanks", "thank you", "dhanyavad", "shukriya"], text: "You're welcome! Ask me anything else about this website." },
  { id: "bot", keys: ["are you ai", "are you real", "are you a bot", "who are you", "what are you", "ask panther", "panther", "how do you work", "tum kaun"], text: "I'm Ask Panther, a simple guide to this website. I'm not an AI model. I answer from approved information, and your questions stay in your browser." },
  { id: "who", keys: ["who is rushi", "about rushi", "rushi", "about you", "kaun hai", "introduce"], text: "Rushi Makwana started in finance and accounting, became curious about repetitive work, and now builds practical automation systems, financial reporting tools and AI-powered applications.", link: { href: "#/about", label: "Go to About Me" } },
  { id: "background", keys: ["qualification", "education", "degree", "college", "course", "study", "studied", "learning", "ica", "ica institute", "learnbay", "certified industrial accountant", "certificate", "certification", "padhai"], text: "Rushi completed the Certified Industrial Accountant course at ICA Institute and is currently pursuing Data Analytics & Business Analytics with Applied AI at LearnBay.", link: { href: "#/about", label: "Go to About Me" } },
  { id: "work-history", keys: ["employment", "experience", "work history", "resume", "cv", "achievement", "employer", "which company"], text: "This website tells Rushi's professional story, not a resume. You can read it on About Me, or ask Rushi directly through the contact form.", link: { href: "#/about", label: "Go to About Me" } },
  { id: "projects", keys: ["project", "portfolio", "what did", "what has", "built", "made", "banaya", "system"], text: "There are three main projects: MPR Checker checks attendance, Auto Payroll Dashboard runs payroll work from one screen, and Payroll AI Assistant answers payroll questions in everyday language.", link: projects },
  { id: "mpr", keys: ["mpr checker", "mpr", "attendance", "absent", "attendance report", "human review", "human in the loop", "hazri"], text: "An MPR is a monthly work-order document showing each employee's paid days. MPR Checker compares it with the attendance portal. It can read clean PDFs and scanned pages. If an MPR cannot be read or the numbers don't match, a person checks it.", link: mpr },
  { id: "auto-payroll", keys: ["auto payroll", "payroll dashboard", "bank file", "salary file", "bank letter", "payroll letter", "mail merge", "one click", "control screen"], text: "Auto Payroll Dashboard brings payroll work into one control screen: cleaning the salary data, bank files, letters, printing, checks and reports. It is built with Excel, Power Query and VBA.", link: payroll },
  { id: "assistant", keys: ["payroll ai", "ai assistant", "assistant", "chatbot", "chat bot", "hinglish", "ai", "artificial intelligence"], text: "Payroll AI Assistant is a private chat assistant built with Python, Streamlit and a local AI model. People ask payroll questions in everyday English or Hinglish, and it answers from the payroll database. It stays on the office network and is not on the internet.", link: assistant },
  { id: "payroll", keys: ["payroll", "salary", "tankhwah"], text: "Two projects focus on payroll. Auto Payroll Dashboard runs payroll work from one screen, and Payroll AI Assistant answers payroll questions in everyday language.", link: projects },
  { id: "safe", keys: ["data safe", "safe", "safety", "secure", "security", "privacy", "private", "confidential", "protect", "leak", "surakshit"], text: "Private data stays protected in three ways: the Payroll AI Assistant is not on the internet, a person reviews exceptions, and this website uses only made-up data.", link: { href: "#/security", label: "See Security & Approach" } },
  { id: "fictional", keys: ["real data", "fake", "fictional", "made up", "demo data", "is this real", "are these real", "real numbers", "real figures", "asli"], text: "All figures and demos on this website are made up. No real employee, salary, client or company information is shown.", link: { href: "#/capabilities", label: "Try the demos" } },
  { id: "demos", keys: ["demo", "try", "test", "example", "dashboard"], text: "You can try the financial dashboard, data cleaning, database reports and more. They all use made-up data.", link: { href: "#/capabilities", label: "Try the demos" } },
  { id: "results", keys: ["time saved", "save time", "saves time", "hours", "how much time", "kitna time", "roi", "results", "benefit", "impact"], text: "This website doesn't publish time-saving numbers. Each project page explains how it helps in plain words.", link: projects },
  { id: "capabilities", keys: ["capability", "capabilities", "what can", "what do you do", "what does rushi do", "help with", "kya kar", "automation", "automate", "reconciliation", "business intelligence"], text: "Rushi's work covers payroll automation, finance workflow automation, financial data analysis, database reporting, document processing, reconciliation, business intelligence and local AI assistants.", link: { href: "#/capabilities", label: "See Capabilities" } },
  { id: "tools", keys: ["tool", "skill", "technology", "software", "tech stack", "stack", "language", "tally", "sap", "excel", "programming"], text: "Tools include Excel, VBA, Power Query, Tally Prime, SAP Business One, Python, SQL Server, OCR and local AI. The Technology page explains each one in simple words.", link: tech },
  { id: "personal", keys: ["personal", "synk", "just go fit", "fitness", "android", "windows app", "copilot", "compliance", "rag", "side project"], text: "Personal projects are Synk (a Windows app on Microsoft Store), Just Go Fit (an Android fitness app) and the Payroll & Labour Compliance Copilot (a learning project still under construction).", link: { href: "#/personal", label: "See Personal Projects" } },
  { id: "hire", keys: ["hire", "hiring", "job", "recruiter", "recruit", "vacancy", "opportunity", "role", "position", "naukri", "employ"], text: "Please choose Professional Opportunities on the Contact page, tell Rushi about the role, and Rushi will reply by email.", link: { href: "#/contact/opportunity", label: "Professional Opportunities" } },
  { id: "business", keys: ["my business", "my company", "our company", "automation requirement", "need automation", "work with", "client", "freelance", "build for", "mera business"], text: "Please choose Discuss an Automation Requirement on the Contact page. Describe the work and the tools you use now, and Rushi will reply by email.", link: { href: "#/contact/automation", label: "Discuss a requirement" } },
  { id: "price", keys: ["price", "pricing", "cost", "fee", "charge", "rate", "budget", "quote", "paisa", "kitna paisa", "kitne ka", "how much"], text: "This website doesn't list prices. You can describe what you need on the Contact page and discuss it with Rushi by email.", link: { href: "#/contact/automation", label: "Discuss a requirement" } },
  { id: "contact", keys: ["contact", "email", "phone", "reach", "get in touch", "talk", "call", "linkedin", "whatsapp", "sampark"], text: "The best way to reach Rushi is the form on the Contact page. Rushi will reply by email.", link: contact },
  { id: "term-ocr", keys: ["ocr", "scanned", "scan"], text: "OCR means reading text from a picture or scanned page, so a computer can use it.", link: mpr },
  { id: "term-vba", keys: ["vba", "macro"], text: "VBA is used to write small programs that automate work in Excel, such as making files or printing.", link: payroll },
  { id: "term-pq", keys: ["power query"], text: "Power Query is a tool in Excel that cleans and combines data, and it can repeat the same steps again.", link: payroll },
  { id: "term-sql", keys: ["sql", "sql server", "t-sql", "database", "query"], text: "SQL is the language used to ask a database for information. SQL Server is a database that stores business data.", link: tech },
  { id: "term-python", keys: ["python", "pandas"], text: "Python is a programming language. Here it is used for jobs such as reading documents and working with data.", link: tech },
  { id: "term-ctc", keys: ["ctc"], text: "CTC means Cost to Company: the total cost of an employee to the company." },
  { id: "term-tds", keys: ["tds"], text: "TDS means Tax Deducted at Source: tax taken out of a payment, such as a salary, before it is paid." },
  { id: "term-pf", keys: ["pf", "provident fund"], text: "PF means Provident Fund: a retirement savings scheme for employees." },
  { id: "term-neft", keys: ["neft", "rtgs"], text: "NEFT and RTGS are ways to transfer money between banks in India." },
  { id: "term-margin", keys: ["margin", "profit", "work order", "profitability"], text: "Margin means what is left after cost. A work order is a piece of work for a client. The demo shows made-up profit for each work order.", link: { href: "#/capabilities/margin", label: "Try the profit demo" } },
  { id: "term-local", keys: ["local ai", "ollama", "qwen", "llm", "local model"], text: "Local AI means the AI runs on a computer you control instead of an internet service. Ollama is a tool for running it, and the model used is qwen2.5-coder:7b.", link: assistant },
];

export const fallback: Answer = {
  id: "fallback",
  keys: [],
  text: "Sorry, I don't have an answer for that and I won't guess. Try asking about the projects, tools or data safety, or send Rushi a message.",
  link: contact,
};

export const suggestions = ["What has Rushi built?", "What is MPR Checker?", "Is payroll data safe?", "What is OCR?", "How can I contact Rushi?"];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Finds the entry whose keywords best match the question. Longer matches count for more. */
export function findAnswer(question: string): Answer {
  const q = question.toLowerCase().replace(/[’']/g, "").replace(/\s+/g, " ").trim();
  let best: Answer = fallback;
  let bestScore = 0;
  for (const a of answers) {
    let score = 0;
    for (const k of a.keys) {
      if (new RegExp(`(^|[^a-z0-9])${escape(k)}(s|es)?($|[^a-z0-9])`).test(q)) score += k.length;
    }
    if (score > bestScore) {
      best = a;
      bestScore = score;
    }
  }
  return best;
}
