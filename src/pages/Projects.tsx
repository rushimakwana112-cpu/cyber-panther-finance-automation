import { useEffect } from "react";
import { DemoTag } from "../components/DemoTag";
import { Icon } from "../components/Icon";
import { PageHead } from "../components/PageHead";
import { StageBadge, StageLegend } from "../components/StageBadge";
import { projectById, projects, type CaseStudy } from "../content/projects";
import { href } from "../lib/route";
import { MprCheckDemo } from "../sections/demos/MprCheckDemo";
import { PayrollChatDemo } from "../sections/demos/PayrollChatDemo";
import { PayrollControlDemo } from "../sections/demos/PayrollControlDemo";
import { ProjectCards } from "./Home";
import { PersonalList } from "./OtherPages";

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
      <PageHead eyebrow="Projects" title="Daily manual work, turned into systems." lead="What I built, why it is useful and why it is better. No real employee, client or company information appears here, and every demo uses made-up data." />
      <div className="container page-body">
        <StageLegend />
        <ProjectCards />
        <section className="projects-more" aria-labelledby="personal-title">
          <h2 id="personal-title">Personal projects and experiments</h2>
          <p>I build these to solve my own problems and to learn. They are separate from my company projects.</p>
          <PersonalList />
        </section>
      </div>
    </>
  );
}

function ProjectDetail({ id }: { id: string }) {
  const p = projectById(id);
  const valid = !!p;
  useEffect(() => {
    if (p) document.title = `${p.title} | Rushi Makwana`;
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
        <StageBadge stage={p.stage} />
        <div className="cs__plainbox">
          <strong>What I built</strong>
          <p>{p.built}</p>
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
          <Checks title="Why it is useful" items={p.useful} />
          <Checks title="Why it is better" items={p.better} />
        </div>

        <div className="cs__block cs__demo">
          <h2>Try it yourself</h2>
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
          <a className="btn btn--primary" href={href.opportunity}>
            Contact me about a role <Icon name="arrow" size={16} />
          </a>
        </nav>
      </div>
    </article>
  );
}
