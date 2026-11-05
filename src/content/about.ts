// The About Me story. Only state what Rushi has confirmed: no employers, dates, scores or invented results.
// `stage` selects what the dots panel shows (0 Finance, 1 Questions, 2 Data, 3 Automation & AI).

export type StoryItem =
  | { kind: "chapter"; stage: number; title: string; text: string[] }
  | { kind: "milestone"; stage: number; status: string; now?: boolean; name: string; institute: string; areas: string }
  | { kind: "belief"; stage: number; text: string };

export const aboutIntro = {
  name: "Rushi Makwana",
  headline: [
    { text: "I don’t just work with financial data.", tone: "dim" },
    { text: "I find ways to make it work", tone: "" },
    { text: "smarter.", tone: "hi" },
  ],
  intro: "My journey began with finance and accounting. But over time, I became just as interested in the processes behind the numbers as the numbers themselves.",
};

export const stageLabels = ["Finance", "Questions", "Data", "Automation & AI"];

export const story: StoryItem[] = [
  {
    kind: "chapter",
    stage: 0,
    title: "Where it started",
    text: ["I started by understanding accounting, taxation, payroll and financial operations.", "Working with financial data showed me how businesses manage information, processes and decisions."],
  },
  {
    kind: "milestone",
    stage: 0,
    status: "Completed",
    name: "Certified Industrial Accountant",
    institute: "ICA Institute",
    areas: "Accounting and taxation, Advanced Excel, Tally Prime and professional development.",
  },
  {
    kind: "chapter",
    stage: 1,
    title: "Curiosity changed my direction",
    text: [
      "While working with recurring processes, I began asking a different question: can this be done more efficiently?",
      "That led me to Excel automation, VBA and Power Query. I explored how repetitive tasks could become structured workflows, with less manual effort and better control.",
    ],
  },
  {
    kind: "chapter",
    stage: 2,
    title: "From spreadsheets to systems",
    text: [
      "Excel was only the beginning. I became interested in SQL, Python and data analytics, and in how data could be cleaned, connected, checked and turned into useful information.",
      "I also began thinking beyond individual tasks, towards complete systems that simplify work, identify exceptions and make information easier to understand.",
    ],
  },
  {
    kind: "chapter",
    stage: 3,
    title: "Exploring applied AI",
    text: [
      "Eventually, my interest expanded into applied AI, local language models and intelligent automation.",
      "I enjoy experimenting with practical uses of AI, especially where it can work alongside structured financial data, automation and human review.",
    ],
  },
  {
    kind: "milestone",
    stage: 3,
    status: "Currently pursuing",
    now: true,
    name: "Data Analytics & Business Analytics with Applied AI",
    institute: "LearnBay",
    areas: "SQL and Python, data analytics and business analytics, applied AI and large language models (LLMs), AI tools and automation workflows.",
  },
  {
    kind: "chapter",
    stage: 3,
    title: "What I build today",
    text: ["Today, I build practical automation systems, financial reporting tools and AI-powered applications that turn complex workflows into simpler processes."],
  },
  { kind: "belief", stage: 3, text: "To me, technology isn’t valuable just because it’s new. It becomes valuable when it solves a real problem." },
];

export const aboutClosing = {
  lines: ["Curiosity drives the learning.", "Real problems drive the building."],
  support: "I’m still learning, experimenting and building, one practical problem at a time.",
  cta: "Explore the projects that bring these ideas to life.",
};
