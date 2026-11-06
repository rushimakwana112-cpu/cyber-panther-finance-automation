// The connected-node stories. Each scene is one arrangement of the same dots.
// Rules: plain words, keep them short, and no invented results.
import { techGroups } from "./misc";

export type Tone = "faint" | "dim" | "on" | "accent";
export type StoryNode = { x: number; y: number; tone: Tone; r?: number };
export type StoryLabel = { x: number; y: number; t: string; anchor?: "start" | "middle" | "end"; strong?: boolean };
export type Scene = { nodes: StoryNode[]; edges: [number, number][]; labels: StoryLabel[] };
export type StoryChapter = { scene: number; title: string; text: string; link?: { href: string; label: string } };
export type Story = { id: string; eyebrow: string; title: string; intro: string; note?: string; scenes: Scene[]; chapters: StoryChapter[] };

// ---------- How I Build Systems: scattered steps settle into one connected chain.
const chain = [
  { x: 56, y: 62, t: "Daily work" },
  { x: 176, y: 62, t: "Rules" },
  { x: 296, y: 62, t: "Build" },
  { x: 416, y: 62, t: "Check" },
  { x: 404, y: 190, t: "Person decides" },
  { x: 240, y: 236, t: "Protect" },
  { x: 76, y: 236, t: "Test" },
];
const scatter = [
  [120, 210],
  [320, 240],
  [230, 130],
  [420, 150],
  [90, 120],
  [340, 110],
  [170, 260],
];

function buildScene(revealed: number): Scene {
  return {
    nodes: chain.map((c, i) => (i < revealed ? { x: c.x, y: c.y, tone: i === 4 ? "accent" : "on", r: 7 } : { x: scatter[i][0], y: scatter[i][1], tone: "dim", r: 4 })),
    edges: chain.slice(1, revealed).map((_, i) => [i, i + 1]),
    labels: chain.slice(0, revealed).map((c) => ({ x: c.x, y: c.y + 28, t: c.t, anchor: "middle", strong: true })),
  };
}

const buildStory: Story = {
  id: "how-i-build",
  eyebrow: "How I Build Systems",
  title: "From daily manual work to a system I can control.",
  intro: "Every system follows the same path.",
  scenes: [1, 3, 5, 7].map(buildScene),
  chapters: [
    { scene: 0, title: "Find the daily work", text: "I start with work that is done by hand again and again, and learn where it goes wrong." },
    { scene: 1, title: "Turn it into a system", text: "I write down the rules, then build the system with a tool that suits the work." },
    { scene: 2, title: "Check that it is accurate", text: "Results are compared with the original data. Anything unclear goes to a person instead of being guessed." },
    { scene: 3, title: "Keep it under control", text: "Private data is treated as private, every change is tested, and a person makes the final decision.", link: { href: "#/security", label: "See how I work" } },
  ],
};

// ---------- My Technology Ecosystem: one hub, four groups of tools.
const HUB = 0;
const groupIndex = (g: number) => 1 + g;
const leafStart = techGroups.reduce<number[]>((acc, _, i) => [...acc, i === 0 ? 5 : acc[i - 1] + techGroups[i - 1].items.length], []);
const leafIndex = (g: number, k: number) => leafStart[g] + k;
const homes = [
  [100, 70],
  [380, 70],
  [380, 226],
  [100, 226],
];
const parked = [
  [28, 40],
  [28, 262],
  [110, 40],
  [110, 262],
];

const allEdges = (): [number, number][] => techGroups.flatMap((g, gi) => [[HUB, groupIndex(gi)] as [number, number], ...g.items.map((_, k) => [groupIndex(gi), leafIndex(gi, k)] as [number, number])]);

function ecoOverview(lit: boolean): Scene {
  const nodes: StoryNode[] = [{ x: 240, y: 148, tone: "accent", r: 9 }];
  techGroups.forEach((_, gi) => nodes.push({ x: homes[gi][0], y: homes[gi][1], tone: "on", r: 7 }));
  techGroups.forEach((g, gi) => {
    g.items.forEach((_, k) => {
      const a = (k / g.items.length) * Math.PI * 2 + gi;
      nodes.push({ x: homes[gi][0] + Math.cos(a) * 42, y: homes[gi][1] + Math.sin(a) * 36, tone: lit ? "on" : "dim", r: 3 });
    });
  });
  return {
    nodes,
    edges: allEdges(),
    labels: [
      { x: 240, y: 178, t: "Finance work", anchor: "middle", strong: true },
      ...techGroups.map((g, gi) => ({ x: homes[gi][0], y: homes[gi][1] + 5, t: g.title, anchor: "middle" as const })),
    ],
  };
}

function ecoFocus(active: number): Scene {
  const group = techGroups[active];
  const nodes: StoryNode[] = [{ x: 30, y: 150, tone: "accent", r: 8 }];
  let slot = 0;
  const parkOf = techGroups.map((_, gi) => (gi === active ? [0, 0] : parked[slot++]));
  techGroups.forEach((_, gi) => nodes.push(gi === active ? { x: 116, y: 150, tone: "on", r: 8 } : { x: parkOf[gi][0], y: parkOf[gi][1], tone: "faint", r: 3 }));
  techGroups.forEach((g, gi) => {
    g.items.forEach((_, k) => {
      if (gi === active) {
        const gap = 240 / Math.max(1, g.items.length - 1);
        nodes.push({ x: 204, y: 30 + k * gap, tone: "on", r: 4 });
      } else {
        nodes.push({ x: parkOf[gi][0], y: parkOf[gi][1], tone: "faint", r: 1.5 });
      }
    });
  });
  return {
    nodes,
    edges: [[HUB, groupIndex(active)], ...group.items.map((_, k) => [groupIndex(active), leafIndex(active, k)] as [number, number])],
    labels: [
      { x: 116, y: 124, t: group.title, anchor: "middle", strong: true },
      ...group.items.map((t, k) => ({ x: 218, y: 35 + k * (240 / Math.max(1, group.items.length - 1)), t: t.name, anchor: "start" as const })),
    ],
  };
}

const ecosystemStory: Story = {
  id: "technology-ecosystem",
  eyebrow: "My Technology Ecosystem",
  title: "The tools connect around the finance work.",
  intro: "I choose each tool for what the work needs. Together they cover a job from start to finish.",
  scenes: [ecoOverview(false), ecoFocus(0), ecoFocus(1), ecoFocus(2), ecoFocus(3), ecoOverview(true)],
  chapters: [
    { scene: 0, title: "Finance comes first", text: "Everything starts with a real finance task. The tools are there to serve it." },
    { scene: 1, title: "Financial tools", text: "Excel, VBA, Power Query, Tally Prime and SAP Business One are the everyday tools of finance work." },
    { scene: 2, title: "Data", text: "Python and SQL Server store and work with information, so it can be cleaned, connected and checked." },
    { scene: 3, title: "Automation", text: "PDF reading and OCR (reading text from images) turn documents into data. Workflow automation connects tasks so they run in order." },
    { scene: 4, title: "AI", text: "AI models running on a local computer can answer questions in everyday language, without sending data to the internet." },
    { scene: 5, title: "One connected system", text: "Each part passes its work to the next, so one job can run from start to finish.", link: { href: "#/technology", label: "See every tool, explained" } },
  ],
};

export const stories = { build: buildStory, ecosystem: ecosystemStory };
