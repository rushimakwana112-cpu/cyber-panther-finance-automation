import { useEffect, useRef, useState } from "react";
import { Icon } from "../components/Icon";
import { aboutClosing, aboutIntro, stageLabels, story } from "../content/about";
import { href } from "../lib/route";

// Four arrangements of the same 42 dots: ledger rows, grouped questions, data lanes and one rising line.
const N = 42;
const ledger = (i: number) => [40 + (i % 7) * 66, 42 + Math.floor(i / 7) * 43];
const groups = (i: number) => {
  const g = i % 3;
  const k = Math.floor(i / 3);
  return [90 + g * 150 + ((k % 4) - 1.5) * 22, 76 + Math.floor(k / 4) * 44 + (g === 1 ? -14 : 14)];
};
const lanes = (i: number) => [30 + (i / (N - 1)) * 420, 76 + (i % 3) * 74];
const rising = (i: number) => {
  const t = i / (N - 1);
  return [30 + t * 420, 250 - 200 * Math.pow(t, 1.5) + Math.sin(t * 12) * 6];
};
const layouts = [ledger, groups, lanes, rising];
const curve = Array.from({ length: N }, (_, i) => rising(i).join(",")).join(" ");

function dotFill(stage: number, i: number) {
  if (stage === 3) return i === N - 1 ? "#A855F7" : "#20C5FF";
  if (stage === 2 || (stage === 1 && i % 3 === 0)) return "#20C5FF";
  return "#74869B";
}

function Dots({ stage }: { stage: number }) {
  return (
    <svg viewBox="0 0 480 300">
      <polyline className="ab-link" points={curve} fill="none" stroke="#20C5FF" strokeWidth="1.5" style={{ opacity: stage === 3 ? 1 : 0 }} />
      <g className="ab-link" style={{ opacity: stage === 2 ? 1 : 0 }}>
        {[76, 150, 224].map((y) => (
          <line key={y} x1="30" x2="450" y1={y} y2={y} stroke="rgba(32,197,255,.28)" />
        ))}
      </g>
      {Array.from({ length: N }, (_, i) => {
        const [x, y] = layouts[stage](i);
        return <circle key={i} className="ab-dot" r="3" fill={dotFill(stage, i)} style={{ transform: `translate(${x}px,${y}px)` }} />;
      })}
    </svg>
  );
}

/** About Me: a scrolling story. The dots panel and the path follow whichever part is being read. */
export function About() {
  const [active, setActive] = useState(0);
  const [closed, setClosed] = useState(false);
  const items = useRef<(HTMLElement | null)[]>([]);
  const path = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const closing = useRef<HTMLElement>(null);

  useEffect(() => {
    let queued = false;
    const update = () => {
      const mid = window.innerHeight * (window.innerWidth <= 860 ? 0.6 : 0.52);
      let best = 0;
      let dist = Infinity;
      items.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = r.top <= mid && r.bottom >= mid ? 0 : Math.min(Math.abs(r.top - mid), Math.abs(r.bottom - mid));
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      setActive(best);
      const p = path.current?.getBoundingClientRect();
      if (p && fill.current) fill.current.style.setProperty("--p", String(Math.max(0, Math.min(1, (mid - p.top) / p.height))));
      const c = closing.current?.getBoundingClientRect();
      if (c) setClosed(c.top < window.innerHeight * 0.7);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        update();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  const stage = story[active].stage;
  let wordIndex = 0;
  const fullHeadline = aboutIntro.headline.map((h) => h.text).join(" ");

  return (
    <div className="ab">
      <section className="container ab-hero" aria-labelledby="ab-title">
        <p className="ab-who">{aboutIntro.name}</p>
        <h1 id="ab-title" aria-label={fullHeadline}>
          {aboutIntro.headline.map((h, line) => (
            <span key={h.text}>
              {line === 1 && <br />}
              {h.text.split(" ").map((w) => (
                <span key={w + wordIndex} className={`ab-w ${h.tone}`} aria-hidden="true" style={{ "--i": wordIndex++ } as React.CSSProperties}>
                  {w}{" "}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <p className="ab-intro">{aboutIntro.intro}</p>
        <span className="ab-cue" aria-hidden="true" />
      </section>

      <div className="container ab-journey">
        <div className="ab-stage" aria-hidden="true">
          <Dots stage={stage} />
          <div className="ab-cap">
            {stageLabels.map((l, i) => (
              <span key={l} className={i === stage ? "on" : ""}>
                {l}
              </span>
            ))}
          </div>
        </div>

        <div className="ab-path" ref={path}>
          <span className="ab-fill" ref={fill} aria-hidden="true" />
          {story.map((item, i) => {
            const on = i === active ? "on" : "";
            const set = (el: HTMLElement | null) => {
              items.current[i] = el;
            };
            if (item.kind === "milestone") {
              return (
                <aside key={item.name} ref={set} className={`ab-stop ${item.now ? "ab-stop--now" : ""} ${on}`} aria-label="Learning milestone">
                  <p className="ab-stop__s">{item.status}</p>
                  <h3>{item.name}</h3>
                  <p className="ab-stop__i">{item.institute}</p>
                  <p className="ab-stop__a">{item.areas}</p>
                </aside>
              );
            }
            if (item.kind === "belief") {
              return (
                <section key={item.text} ref={set} className={`ab-ch ab-ch--belief ${on}`}>
                  <p>{item.text}</p>
                </section>
              );
            }
            return (
              <section key={item.title} ref={set} className={`ab-ch ${on}`}>
                <h2>{item.title}</h2>
                {item.text.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </section>
            );
          })}
        </div>
      </div>

      <section className={`ab-close ${closed ? "on" : ""}`} ref={closing} aria-label="Closing statement">
        <div className="container">
          <h2>
            {aboutClosing.lines.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h2>
          <p className="ab-close__line">{aboutClosing.support}</p>
          <a className="ab-go" href={href.page("projects")}>
            {aboutClosing.cta} <Icon name="arrow" size={20} />
          </a>
        </div>
      </section>
    </div>
  );
}
