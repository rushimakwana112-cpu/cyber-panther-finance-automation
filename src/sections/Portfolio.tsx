import { useRef, useState } from "react";
import { DemoTag } from "../components/DemoTag";
import { Section } from "../components/Section";
import { projects, type Project } from "../content/projects";
import { rovingKey } from "../lib/hooks";
import { JoinDemo } from "./demos/JoinDemo";
import { MarginDemo } from "./demos/MarginDemo";
import { RefreshDemo } from "./demos/RefreshDemo";

const demos: Record<Project["demo"], () => React.JSX.Element> = {
  join: JoinDemo,
  refresh: RefreshDemo,
  margin: MarginDemo,
};

export function Portfolio() {
  const [activeId, setActiveId] = useState(projects[0].id);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const project = projects.find((p) => p.id === activeId)!;
  const Demo = demos[project.demo];

  return (
    <Section
      id="portfolio"
      index="05"
      eyebrow="Demo projects"
      title="Work you can actually click."
      intro="Three demonstrations built on fictional data, showing the kind of problems I solve and how. These are not client projects."
      className="portfolio"
    >
      <div className="ptabs" role="tablist" aria-label="Projects">
        {projects.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            id={`ptab-${p.id}`}
            aria-selected={activeId === p.id}
            aria-controls="ppanel"
            tabIndex={activeId === p.id ? 0 : -1}
            className={`ptab ${activeId === p.id ? "is-active" : ""}`}
            onClick={() => setActiveId(p.id)}
            onKeyDown={(e) => {
              const to = rovingKey(e, i, projects.length);
              if (to === null) return;
              setActiveId(projects[to].id);
              tabs.current[to]?.focus();
            }}
          >
            <span className="ptab__n num">0{i + 1}</span>
            <span className="ptab__t">{p.title}</span>
          </button>
        ))}
      </div>

      <div className="pproject" id="ppanel" role="tabpanel" aria-labelledby={`ptab-${project.id}`} key={project.id}>
        <div className="pproject__copy">
          <DemoTag>Demo · fictional data</DemoTag>
          <h3>{project.title}</h3>
          <dl className="pproject__dl">
            <div>
              <dt>Problem</dt>
              <dd>{project.problem}</dd>
            </div>
            <div>
              <dt>Solution</dt>
              <dd>{project.approach}</dd>
            </div>
            <div>
              <dt>Tools used</dt>
              <dd className="tags">
                {project.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </dd>
            </div>
            <div className="pproject__try">
              <dt>Try it</dt>
              <dd>{project.shows}</dd>
            </div>
          </dl>
        </div>
        <div className="pproject__demo">
          <Demo />
        </div>
      </div>
    </Section>
  );
}
