import { growthPath } from "../content/site";

// Points along the rising line, one per stage (viewBox 460 × 300). The last stage is "now".
const points = [
  { x: 30, y: 250 },
  { x: 130, y: 205 },
  { x: 230, y: 150 },
  { x: 330, y: 90 },
];
const line = "M30 250 C 80 248, 100 220, 130 205 S 200 170, 230 150 S 300 105, 330 90";
// Label position for each stage: [x, y] of the first line.
const labelAt = [
  [20, 222],
  [96, 178],
  [190, 122],
  [244, 58],
];

/** Split a stage name into two short lines for the chart labels. */
function twoLines(s: string): [string, string] {
  const words = s.split(" ");
  const half = Math.ceil(words.length / 2);
  return [words.slice(0, half).join(" "), words.slice(half).join(" ")];
}

/** Home hero picture: a career path that keeps rising, from finance to automation and AI. No figures. */
export function GrowthPath() {
  const { stages, tools } = growthPath;
  const now = stages.length - 1;
  return (
    <figure className="growth">
      <figcaption className="growth__cap">
        <span>Growth path</span>
        <span>Finance → Intelligent systems</span>
      </figcaption>
      <svg className="growth__svg" viewBox="0 0 460 300" role="img" aria-label={`A rising line through ${stages.join(", ")}, continuing upward because I am still growing.`}>
        <defs>
          <linearGradient id="growth-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--blue)" stopOpacity="0.22" />
            <stop offset="1" stopColor="var(--blue)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="growth__grid">
          {[60, 120, 180, 240].map((y) => (
            <line key={y} x1="0" y1={y} x2="460" y2={y} />
          ))}
        </g>
        <path className="growth__area" d={`${line} L 330 290 L 30 290 Z`} fill="url(#growth-area)" />
        <path className="growth__line" d={line} pathLength={1} />
        <path className="growth__next" d="M330 90 C 370 72, 400 50, 440 26" />
        {points.map((p, i) =>
          i === now ? (
            <g key={i} className="growth__now">
              <circle className="growth__pulse" cx={p.x} cy={p.y} r="14" />
              <circle cx={p.x} cy={p.y} r="7" />
            </g>
          ) : (
            <circle key={i} className="growth__dot" cx={p.x} cy={p.y} r="6" style={{ "--i": i } as React.CSSProperties} />
          ),
        )}
        {stages.map((s, i) => {
          const [a, b] = twoLines(s);
          const [x, y] = labelAt[i];
          return (
            <text key={s} className={i === now ? "growth__label growth__label--now" : "growth__label"} x={x} y={y}>
              <tspan x={x}>{a}</tspan>
              <tspan x={x} dy="15">
                {b}
              </tspan>
            </text>
          );
        })}
        <rect className="growth__tag" x="338" y="100" width="40" height="18" rx="9" />
        <text className="growth__tagtext" x="358" y="113" textAnchor="middle">
          NOW
        </text>
        <text className="growth__still" x="372" y="22">
          <tspan x="372">STILL</tspan>
          <tspan x="372" dy="14">
            GROWING
          </tspan>
        </text>
      </svg>
      <p className="growth__tools">{tools.join(" · ")}</p>
    </figure>
  );
}
