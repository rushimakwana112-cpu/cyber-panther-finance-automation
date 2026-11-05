import { useEffect } from "react";
import { Architecture } from "../components/Architecture";
import { DemoTag } from "../components/DemoTag";
import { Icon } from "../components/Icon";
import { PageHead } from "../components/PageHead";
import { projectById, projects, type CaseStudy } from "../content/projects";
import { href } from "../lib/route";
import { MprCheckDemo } from "../sections/demos/MprCheckDemo";
import { PayrollChatDemo } from "../sections/demos/PayrollChatDemo";
import { PayrollControlDemo } from "../sections/demos/PayrollControlDemo";
import { ProjectCards } from "./Home";

const demos: Record<CaseStudy["demo"], () => React.JSX.Element> = {
  mpr: MprCheckDemo,
  control: PayrollControlDemo,
  chat: PayrollChatDemo,
};

function Checks({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="cs__block">
      <h2>{title}</h2>
      <ul className="cs__checks">
        {items.map((i) => (
          <li key={i}>
            <Icon name="check" size={15} />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Projects({ id }: { id?: string }) {
  if (id) return <ProjectDetail id={id} />;
  return (
    <>
      <PageHead eyebrow="Projects" title="Three real systems, explained simply." lead="These are systems for real finance and payroll work. No employee, client or company information appears here, and every demo uses made-up data." />
      <div className="container page-body">
        <ProjectCards />
      </div>
    </>
  );
}

function ProjectDetail({ id }: { id: string }) {
  const p = projectById(id);
  const valid = !!p;
  useEffect(() => {
    if (p) document.title = `${p.title} | Cyber Panther`;
  }, [p, valid]);

  if (!p) {
    return (
      <PageHead eyebrow="Projects" title="That project isn't here.">
        <a className="btn btn--primary phead__cta" href={href.page("projects")}>
          Back to all projects
        </a>
      </PageHead>
    );
  }

  const Demo = demos[p.demo];
  const next = projects[(projects.indexOf(p) + 1) % projects.length];

  return (
    <article>
      <PageHead eyebrow="Company project" title={p.title} lead={p.tagline}>
        <div className="cs__plainbox">
          <strong>In simple words</strong>
          <p>{p.plain}</p>
        </div>
        <div className="pcard__tags">
          {p.stack.map((s) => (
            <span key={s} className="tag">
              {s}
            </span>
          ))}
        </div>
      </PageHead>

      <div className="container page-body cs">
        <div className="cs__two">
          <div className="cs__block">
            <h2>The problem</h2>
            <p>{p.problem}</p>
          </div>
          <div className="cs__block">
            <h2>Why it needed automating</h2>
            <ul className="cs__plain">
              {p.why.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="cs__block cs__solution">
          <h2>The solution</h2>
          <p>{p.solution}</p>
        </div>

        <div className="cs__block">
          <h2>How it works, step by step</h2>
          <ol className="steps">
            {p.steps.map((s, i) => (
              <li key={s.t} className="stagger" style={{ "--i": i } as React.CSSProperties}>
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <strong>{s.t}</strong>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="cs__block">
          <h2>How the system is built</h2>
          <p className="cs__sub">{p.architecture.intro}</p>
          <Architecture columns={p.architecture.columns} label={`How ${p.title} is built`} />
          {p.architecture.note && (
            <p className="arch__note">
              <Icon name="shield" size={15} /> {p.architecture.note}
            </p>
          )}
        </div>

        <div className="cs__block">
          <h2>What it can do</h2>
          <ul className="cs__features">
            {p.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>

        <div className="cs__three">
          <Checks title="How mistakes are caught" items={p.validation} />
          <Checks title="How information is protected" items={p.security} />
          <Checks title="How it helps" items={p.value} />
        </div>

        <div className="cs__block cs__demo">
          <h2>{p.demoTitle}</h2>
          <p className="cs__sub">{p.demoNote}</p>
          {p.demo === "chat" && <DemoTag>Demo · made-up data</DemoTag>}
          <Demo />
        </div>

        <nav className="cs__next" aria-label="Next steps">
          <a href={href.project(next.id)}>
            <span>Next project</span>
            <strong>
              {next.title} <Icon name="arrow" size={16} />
            </strong>
          </a>
          <a className="btn btn--primary" href={href.automation()}>
            Discuss an Automation Requirement <Icon name="arrow" size={16} />
          </a>
        </nav>
      </div>
    </article>
  );
}
