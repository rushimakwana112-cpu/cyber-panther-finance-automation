import { AppPreview } from "../components/AppPreview";
import { Icon } from "../components/Icon";
import { NodeStory } from "../components/NodeStory";
import { Section } from "../components/Section";
import { StageBadge } from "../components/StageBadge";
import { demoList } from "../content/capabilities";
import { projects } from "../content/projects";
import { brand, credential, manualVsSystem, startingPoints } from "../content/site";
import { stories } from "../content/stories";
import { href } from "../lib/route";
import { AutomationFlow } from "../sections/AutomationFlow";
import { GrowthPath } from "../sections/GrowthPath";
import { ImpactFacts } from "../sections/ImpactFacts";

export function ProjectCards() {
  return (
    <ul className="pcards">
      {projects.map((p, i) => (
        <li key={p.id} className="stagger" style={{ "--i": i } as React.CSSProperties}>
          <a className="pcard pcard--app" href={href.project(p.id)}>
            <AppPreview kind={p.demo} />
            <span className="pcard__top">
              <span className="pcard__n num">0{i + 1}</span>
              <StageBadge stage={p.stage} />
            </span>
            <h3>{p.title}</h3>
            <p className="pcard__tag">{p.tagline}</p>
            <p className="pcard__sum">{p.summary}</p>
            <ul className="pcard__useful">
              {p.useful.map((u) => (
                <li key={u}>
                  <Icon name="check" size={15} /> {u}
                </li>
              ))}
            </ul>
            <span className="pcard__go pcard__explore">
              Explore project <Icon name="arrow" size={15} />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

const inUse = projects.filter((p) => p.stage === "in-use").length;

export function Home() {
  return (
    <>
      <section className="hero hero--portfolio" aria-labelledby="hero-title">
        <div className="hero__glow" aria-hidden="true" />
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="hero__open">
              <i aria-hidden="true" /> {brand.owner} · Open to job opportunities
            </p>
            <p className="hero__roles">
              {brand.positioning.map((r) => (
                <span key={r}>{r}</span>
              ))}
            </p>
            <h1 id="hero-title" className="hero__title hero__title--stack">
              <span>{brand.headline[0]}</span>
              <em>{brand.headline[1]}</em>
            </h1>
            <p className="hero__lead">{brand.lead}</p>
            <div className="hero__ctas">
              <a className="btn btn--primary" href={href.page("projects")}>
                Explore my projects <Icon name="arrow" size={16} />
              </a>
              <a className="btn btn--ghost" href={href.page("about")}>
                Discover my journey
              </a>
            </div>
          </div>
          <div className="hero__viz">
            <GrowthPath />
          </div>
        </div>
      </section>

      <section className="credstrip" aria-label="Credentials">
        <div className="container credstrip__inner">
          <p className="credstrip__main">
            <Icon name="shield" size={20} />
            <span>
              {credential.name} <span className="credstrip__dim">· {credential.institute}</span>
            </span>
          </p>
          <ul className="credstrip__facts">
            <li>
              <b className="num">{inUse}</b> {inUse === 1 ? "system" : "systems"} in real use
            </li>
            <li>Demos with made-up data</li>
            <li>A person makes the final call</li>
          </ul>
        </div>
      </section>

      <Section id="home-projects" eyebrow="Featured projects" title="Three systems built for real finance work." intro="What I built, why it is useful and why it is better. You can try each one with made-up data.">
        <ProjectCards />
      </Section>

      <Section id="home-flow" eyebrow="Automation workflow" title="From raw Excel to bank files." intro="Hover over or tap a step to see what it does.">
        <AutomationFlow />
      </Section>

      <Section id="home-better" eyebrow="My Automation Impact" title="Daily manual work, done by a system." intro="This shows the kind of change my systems make.">
        <ImpactFacts />
        <p className="ifacts__note">These counts describe how the systems are built. They are not measured results.</p>
        <ul className="versus">
          <li className="versus__head" aria-hidden="true">
            <span />
            <span>By hand</span>
            <span />
            <span>With my system</span>
          </li>
          {manualVsSystem.map((r, i) => (
            <li key={r.label} className="stagger" style={{ "--i": i } as React.CSSProperties}>
              <strong>{r.label}</strong>
              <div>
                <span>By hand</span>
                <p>{r.manual}</p>
              </div>
              <Icon name="arrow" size={18} />
              <div className="versus__system">
                <span>With my system</span>
                <p>{r.system}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <NodeStory story={stories.build} />

      <section className="section" aria-label="Where to start">
        <div className="container">
          <ul className="starts">
            {startingPoints.map((s) => (
              <li key={s.to}>
                <a href={href.page(s.to)}>
                  <span className="starts__n">{s.n}</span>
                  <strong>
                    {s.title} <Icon name="arrow" size={16} />
                  </strong>
                  <span>{s.d}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section id="home-demos" eyebrow="Finance tools" title="Try it yourself." intro="These small demos use made-up data, so you can click anything.">
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
            <a href={href.page("ai-lab")}>
              <strong>AI Lab</strong>
              <span>Pick a question and see how the answer is created.</span>
              <Icon name="arrow" size={15} />
            </a>
          </li>
        </ul>
        <a className="textlink" href={href.page("tools")}>
          See all finance tools <Icon name="arrow" size={15} />
        </a>
      </Section>

      <section className="section hirecta" aria-labelledby="hire-title">
        <div className="container">
          <div className="hirecta__box">
            <div>
              <h2 id="hire-title">Hiring for finance, data or automation?</h2>
              <p>I am open to job opportunities. Tell me about the role and I will reply by email.</p>
            </div>
            <a className="btn btn--primary" href={href.opportunity}>
              Get in touch <Icon name="arrow" size={16} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
