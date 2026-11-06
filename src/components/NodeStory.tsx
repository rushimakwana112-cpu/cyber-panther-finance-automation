import { useEffect, useRef, useState } from "react";
import type { Scene, Story } from "../content/stories";
import { Icon } from "./Icon";
import { Section } from "./Section";

function Stage({ scenes, active }: { scenes: Scene[]; active: number }) {
  const scene = scenes[active];
  return (
    <svg viewBox="0 0 480 300">
      {scenes.map((s, i) => (
        <g key={i} className={`ns-edges ${i === active ? "on" : ""}`}>
          {s.edges.map(([a, b]) => (
            <line key={`${a}-${b}`} pathLength={1} x1={s.nodes[a].x} y1={s.nodes[a].y} x2={s.nodes[b].x} y2={s.nodes[b].y} />
          ))}
        </g>
      ))}
      {scene.nodes.map((n, i) => (
        <circle key={i} className={`ns-node ns-node--${n.tone}`} r={n.r ?? 3} style={{ transform: `translate(${n.x}px,${n.y}px)` }} />
      ))}
      {scenes.map((s, i) => (
        <g key={i} className={`ns-labels ${i === active ? "on" : ""}`}>
          {s.labels.map((l) => (
            <text key={l.t} x={l.x} y={l.y} textAnchor={l.anchor ?? "start"} className={l.strong ? "strong" : ""}>
              {l.t}
            </text>
          ))}
        </g>
      ))}
    </svg>
  );
}

/** A scrolling story in the same style as About Me: the picture follows whichever part is being read. */
export function NodeStory({ story }: { story: Story }) {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLElement | null)[]>([]);
  const path = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let queued = false;
    const update = () => {
      const p = path.current?.getBoundingClientRect();
      if (!p) return;
      // Nothing to do while this story is off screen.
      if (p.bottom < -200 || p.top > window.innerHeight + 200) return;
      const mid = window.innerHeight * (window.innerWidth <= 860 ? 0.68 : 0.52);
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
      fill.current?.style.setProperty("--p", String(Math.max(0, Math.min(1, (mid - p.top) / p.height))));
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

  const chapter = story.chapters[active];

  return (
    <Section id={story.id} eyebrow={story.eyebrow} title={story.title} intro={story.intro} className="ns">
      {story.note && <p className="ns-note">{story.note}</p>}
      <div className="ab-journey ns-journey">
        <div className="ab-stage ns-stage" aria-hidden="true">
          <Stage scenes={story.scenes} active={chapter.scene} />
          <p className="ns-cap">
            <span>
              {String(active + 1).padStart(2, "0")} / {String(story.chapters.length).padStart(2, "0")}
            </span>
            {chapter.title}
          </p>
        </div>
        <div className="ab-path ns-path" ref={path}>
          <span className="ab-fill" ref={fill} aria-hidden="true" />
          {story.chapters.map((c, i) => (
            <div
              key={c.title}
              ref={(el) => {
                items.current[i] = el;
              }}
              className={`ns-ch ${i === active ? "on" : ""}`}
            >
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              {c.link && (
                <a className="textlink" href={c.link.href}>
                  {c.link.label} <Icon name="arrow" size={15} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
