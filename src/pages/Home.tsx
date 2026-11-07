import { AppPreview } from "../components/AppPreview";
import { Icon } from "../components/Icon";
import { NodeStory } from "../components/NodeStory";
import { Section } from "../components/Section";
import { StageBadge } from "../components/StageBadge";
import { demoList } from "../content/capabilities";
import { projects } from "../content/projects";
import { brand, manualVsSystem, startingPoints } from "../content/site";
import { stories } from "../content/stories";
import { href } from "../lib/route";
import { AutomationFlow } from "../sections/AutomationFlow";
import { HeroMatch } from "../sections/HeroMatch";
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
            <p className="pcard__solves">
              <b>Problem solved</b>
              {p.solves}
            </p>
            <span className="pcard__key">
              <b>Key functions</b>
              {p.keyFunctions.map((k) => (
                <span key={k}>
                  <Icon name="check" size={13} /> {k}
                </span>
              ))}
            </span>
            <span className="pcard__tags">
              {p.stack.map((s) => (
                <span key={s} className="tag">
                  {s}
                </span>
              ))}
            </span>
            <span className="pcard__go pcard__explore">
              Explore project <Icon name="arrow" size={15} />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Home() {
  return (
    <>
      <section className="hero hero--portfolio" aria-labelledby="hero-title">
        <div className="hero__glow" aria-hidden="true" />
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="hero__name">{brand.owner}</p>
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
            <p className="hero__open">
              <i aria-hidden="true" /> Open to job opportunities.{" "}
              <a href={href.opportunity}>
                Contact me <Icon name="arrow" size={14} />
              </a>
            </p>
          </div>
          <nav className="hero__starts" aria-label="Where to start">
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
          </nav>
          <div className="hero__viz">
            <HeroMatch />
          </div>
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

      <Section id="home-connect" eyebrow="Contact" title="Looking for someone who works this way?" intro="I am open to job opportunities. Tell me about the role and I will reply by email.">
        <a className="btn btn--primary" href={href.opportunity}>
          Contact me <Icon name="arrow" size={16} />
        </a>
      </Section>
    </>
  );
}
