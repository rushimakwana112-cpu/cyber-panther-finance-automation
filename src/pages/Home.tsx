import { ArchStrip } from "../components/Architecture";
import { Icon } from "../components/Icon";
import { Section } from "../components/Section";
import { capabilities, demoList } from "../content/capabilities";
import { projects } from "../content/projects";
import { brand } from "../content/site";
import { href } from "../lib/route";
import { Dashboard } from "../sections/Dashboard";

export function ProjectCards() {
  return (
    <ul className="pcards">
      {projects.map((p, i) => (
        <li key={p.id} className="stagger" style={{ "--i": i } as React.CSSProperties}>
          <a className="pcard" href={href.project(p.id)}>
            <span className="pcard__n num">0{i + 1}</span>
            <h3>{p.title}</h3>
            <p className="pcard__tag">{p.tagline}</p>
            <p className="pcard__sum">{p.summary}</p>
            <ArchStrip columns={p.architecture.columns} />
            <span className="pcard__tags">
              {p.stack.map((s) => (
                <span key={s} className="tag">
                  {s}
                </span>
              ))}
            </span>
            <span className="pcard__go">
              Read how it works <Icon name="arrow" size={15} />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function ConnectPaths() {
  return (
    <div className="paths">
      <a className="path" href={href.opportunity}>
        <span className="path__who">For recruiters and employers</span>
        <strong>Professional Opportunities</strong>
        <span className="path__go">
          Get in touch <Icon name="arrow" size={15} />
        </span>
      </a>
      <a className="path" href={href.automation()}>
        <span className="path__who">For businesses</span>
        <strong>Discuss an Automation Requirement</strong>
        <span className="path__go">
          Tell me about it <Icon name="arrow" size={15} />
        </span>
      </a>
    </div>
  );
}

export function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__glow" aria-hidden="true" />
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="hero__pos">
              {brand.positioning.map((r) => (
                <span key={r}>{r}</span>
              ))}
            </p>
            <h1 id="hero-title" className="hero__title hero__title--stack">
              <span>{brand.headline[0]}</span>
              <em>{brand.headline[1]}</em>
              <span>{brand.headline[2]}</span>
            </h1>
            <p className="hero__message">{brand.message}</p>
            <p className="hero__lead">{brand.lead}</p>
            <div className="hero__ctas">
              <a href={href.page("projects")} className="btn btn--primary">
                Explore Projects <Icon name="arrow" size={16} />
              </a>
              <a href={href.page("contact")} className="btn btn--ghost">
                Connect With Me
              </a>
            </div>
          </div>
          <div className="hero__viz">
            <Dashboard compact />
            <p className="hero__hint">Made-up data. Click a number or period, then hover over or tap the chart to see exact values.</p>
          </div>
        </div>
      </section>

      <Section id="home-projects" eyebrow="Projects" title="Three systems built for real finance work." intro="Each project explains the problem, how the system works and how it helps. You can also try a demo with made-up data.">
        <ProjectCards />
      </Section>

      <Section id="home-capabilities" eyebrow="Capabilities" title="What I can do.">
        <ul className="capstrip">
          {capabilities.map((c) => (
            <li key={c.id}>
              <Icon name={c.icon} size={18} />
              {c.title}
            </li>
          ))}
        </ul>
        <a className="textlink" href={href.page("capabilities")}>
          See all of them, explained <Icon name="arrow" size={15} />
        </a>
      </Section>

      <Section id="home-demos" eyebrow="Live demos" title="Try it yourself." intro="These small demos use made-up data, so you can click anything.">
        <ul className="demotiles">
          {demoList.slice(0, 3).map((d) => (
            <li key={d.id}>
              <a href={href.demo(d.id)}>
                <strong>{d.label}</strong>
                <span>{d.d}</span>
                <Icon name="arrow" size={15} />
              </a>
            </li>
          ))}
          <li>
            <a href={href.project("payroll-ai-assistant")}>
              <strong>Payroll AI demo</strong>
              <span>Pick a question and see how the answer is created.</span>
              <Icon name="arrow" size={15} />
            </a>
          </li>
        </ul>
      </Section>

      <Section id="home-connect" eyebrow="Connect" title="Two ways to get in touch.">
        <ConnectPaths />
      </Section>
    </>
  );
}
