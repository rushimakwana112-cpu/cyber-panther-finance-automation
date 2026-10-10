import { useEffect, useId, useRef, useState, type ReactNode } from "react";

const PAD = { t: 14, r: 14, b: 26, l: 54 };

type Props = {
  labels: string[];
  values: number[];
  /** Short format for axis ticks. */
  formatTick: (v: number) => string;
  /** Screen-reader text for a single point. */
  describe: (i: number) => string;
  /** Tooltip body for the active point. */
  renderTip: (i: number) => ReactNode;
  label: string;
  domain: [number, number];
  height?: number;
  color?: string;
};

/**
 * Responsive SVG area/line chart.
 * Hover to read values, click/tap to pin a month, arrow keys when focused.
 */
export function LineChart({ labels, values, formatTick, describe, renderTip, label, domain, height = 210, color = "var(--blue)" }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(560);
  const [hover, setHover] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const gid = useId().replace(/:/g, "");

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(260, e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // A shorter series (period change) can invalidate a pinned index.
  useEffect(() => setPinned((p) => (p !== null && p >= values.length ? null : p)), [values.length]);

  const n = values.length;
  const [lo, hi] = domain;
  const iw = width - PAD.l - PAD.r;
  const ih = height - PAD.t - PAD.b;
  const x = (i: number) => PAD.l + (n === 1 ? iw / 2 : (i / (n - 1)) * iw);
  const y = (v: number) => PAD.t + ih - ((v - lo) / (hi - lo || 1)) * ih;

  const pts = values.map((v, i) => [x(i), y(v)] as const);
  const line = pts
    .map(([px, py], i) => {
      if (i === 0) return `M${px},${py}`;
      const [qx, qy] = pts[i - 1];
      const c = (px - qx) * 0.4;
      return `C${qx + c},${qy} ${px - c},${py} ${px},${py}`;
    })
    .join(" ");
  const area = `${line} L${x(n - 1)},${PAD.t + ih} L${x(0)},${PAD.t + ih} Z`;
  const ticks = [0.15, 0.5, 0.85].map((f) => lo + (hi - lo) * f);

  const indexAt = (clientX: number, rect: DOMRect) => {
    const px = ((clientX - rect.left) / rect.width) * width;
    return Math.max(0, Math.min(n - 1, Math.round(((px - PAD.l) / iw) * (n - 1))));
  };

  const active = hover ?? pinned;
  const leftPct = active === null ? 0 : (x(active) / width) * 100;

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      setPinned((p) => Math.max(0, Math.min(n - 1, (p ?? (dir === 1 ? -1 : n)) + dir)));
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      setPinned(e.key === "Home" ? 0 : n - 1);
    } else if (e.key === "Escape") setPinned(null);
  };

  return (
    <div className="linechart" ref={wrap}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${label}. Focus and use the arrow keys to read each month.`}
        tabIndex={0}
        onPointerMove={(e) => e.pointerType === "mouse" && setHover(indexAt(e.clientX, e.currentTarget.getBoundingClientRect()))}
        onPointerLeave={() => setHover(null)}
        onClick={(e) => {
          const i = indexAt(e.clientX, e.currentTarget.getBoundingClientRect());
          setPinned((p) => (p === i && hover === null ? null : i));
        }}
        onKeyDown={onKey}
      >
        <defs>
          <linearGradient id={`fill-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={PAD.l} x2={width - PAD.r} y1={y(t)} y2={y(t)} className="linechart__grid" />
            <text x={PAD.l - 10} y={y(t) + 3.5} textAnchor="end" className="linechart__tick">
              {formatTick(t)}
            </text>
          </g>
        ))}
        <path d={area} fill={`url(#fill-${gid})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" className="linechart__line" />
        {labels.map((l, i) => (
          <text key={l + i} x={x(i)} y={height - 6} textAnchor="middle" className={`linechart__label ${active === i ? "is-active" : ""}`}>
            {l}
          </text>
        ))}
        {active !== null && (
          <g>
            <line x1={x(active)} x2={x(active)} y1={PAD.t} y2={PAD.t + ih} className="linechart__cross" />
            <circle cx={x(active)} cy={y(values[active])} r="9" fill={color} opacity="0.16" />
            <circle cx={x(active)} cy={y(values[active])} r="4" fill="var(--bg)" stroke={color} strokeWidth="2" />
          </g>
        )}
        {active === null && n > 0 && <circle cx={x(n - 1)} cy={y(values[n - 1])} r="3.5" fill={color} />}
      </svg>
      {active !== null && (
        <div
          className={`linechart__tip ${hover === null ? "is-pinned" : ""}`}
          style={{ left: `${leftPct}%`, transform: `translateX(${leftPct > 70 ? "-100%" : leftPct < 30 ? "0" : "-50%"})` }}
        >
          {renderTip(active)}
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {pinned === null ? "" : describe(pinned)}
      </p>
    </div>
  );
}
