import { Icon } from "../components/Icon";
import { PageHead } from "../components/PageHead";
import { approachSteps, personalProjects, principles, techGroups } from "../content/misc";
import { Workflow } from "../sections/Workflow";

export function Technology() {
  return (
    <>
      <PageHead eyebrow="Technology" title="The tools I use." lead="Each tool is listed with a simple explanation of what it does." />
      <div className="container page-body">
        <ul className="tech">
          {techGroups.map((g, i) => (
            <li key={g.title} className="stagger" style={{ "--i": i } as React.CSSProperties}>
              <h2>
                <Icon name={g.icon} size={20} /> {g.title}
              </h2>
              <p className="tech__plain">{g.plain}</p>
              <ul className="tech__items">
                {g.items.map((t) => (
                  <li key={t.name}>
                    <strong>{t.name}</strong>
                    <span>{t.plain}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <Workflow />
    </>
  );
}

export function SecurityApproach() {
  return (
    <>
      <PageHead eyebrow="Security & approach" title="How I work, and how I protect data." lead="Automation only helps if people can trust it. These are the steps I follow." />
      <div className="container page-body">
        <ol className="approach">
          {approachSteps.map((s, i) => (
            <li key={s.t} className="stagger" style={{ "--i": i } as React.CSSProperties}>
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2>{s.t}</h2>
                <p>{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
        <ul className="principles">
          {principles.map((p) => (
            <li key={p.t}>
              <Icon name={p.icon} size={20} />
              <h2>{p.t}</h2>
              <p>{p.d}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function Personal() {
  return (
    <>
      <PageHead eyebrow="Personal projects" title="Things I build for myself." lead="I build these to solve my own problems and to learn. They are separate from my company projects." />
      <div className="container page-body">
        <ul className="personal">
          {personalProjects.map((p, i) => (
            <li key={p.id} className="stagger" style={{ "--i": i } as React.CSSProperties}>
              <p className="personal__kind">{p.kind}</p>
              <h2>{p.title}</h2>
              <p>{p.d}</p>
              <div className="pcard__tags">
                {p.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
              {p.link && (
                <a className="textlink" href={p.link.href} target="_blank" rel="noopener noreferrer">
                  {p.link.label} <Icon name="arrow" size={15} />
                </a>
              )}
              <p className="personal__status">
                <i aria-hidden="true" /> {p.status}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
