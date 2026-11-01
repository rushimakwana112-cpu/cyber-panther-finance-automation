import { useRef, useState } from "react";
import { DemoTag } from "../components/DemoTag";
import { Icon } from "../components/Icon";
import { Section } from "../components/Section";
import { aiProjects, type AiProject } from "../content/aiProjects";
import { rovingKey } from "../lib/hooks";
import { PayrollChatDemo } from "./demos/PayrollChatDemo";

const demos: Record<NonNullable<AiProject["demo"]>, () => React.JSX.Element> = {
  "payroll-chat": PayrollChatDemo,
};

export function AiProjects() {
  const [activeId, setActiveId] = useState(aiProjects[0].id);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const p = aiProjects.find((x) => x.id === activeId)!;
  const Demo = p.demo ? demos[p.demo] : null;
  const many = aiProjects.length > 1;

  return (
    <Section
      id="ai-projects"
      index="06"
      eyebrow="Applied AI"
      title="From automation to applied AI."
      intro="My earlier work is SQL, Excel and VBA. Learning applied AI changed how I build: I now pair local AI models with the accounting rules and SQL I already know — and learning by building real tools is how I pick up new skills fast."
      className="aip"
    >
      {many && (
        <div className="ptabs" role="tablist" aria-label="AI projects">
          {aiProjects.map((x, i) => (
            <button
              key={x.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`aitab-${x.id}`}
              aria-selected={activeId === x.id}
              aria-controls="aipanel"
              tabIndex={activeId === x.id ? 0 : -1}
              className={`ptab ${activeId === x.id ? "is-active" : ""}`}
              onClick={() => setActiveId(x.id)}
              onKeyDown={(e) => {
                const to = rovingKey(e, i, aiProjects.length);
                if (to === null) return;
                setActiveId(aiProjects[to].id);
                tabs.current[to]?.focus();
              }}
            >
              <span className="ptab__n num">0{i + 1}</span>
              <span className="ptab__t">{x.title}</span>
            </button>
          ))}
        </div>
      )}

      <article
        className="aip__case"
        key={p.id}
        {...(many ? { id: "aipanel", role: "tabpanel", "aria-labelledby": `aitab-${p.id}` } : {})}
      >
        <header className="aip__head">
          <span className="aip__status">
            <span className="aip__live" aria-hidden="true" />
            {p.status}
          </span>
          <h3>{p.title}</h3>
          <p className="aip__summary">{p.summary}</p>
        </header>

        <div className="aip__grid">
          <div className="aip__copy">
            <p className="aip__k">The problem</p>
            <p className="aip__problem">{p.problem}</p>

            <p className="aip__k">How it works</p>
            <ol className="aip__steps">
              {p.steps.map((s, i) => (
                <li key={s.t}>
                  <span className="num">0{i + 1}</span>
                  <div>
                    <strong>{s.t}</strong>
                    <p>{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {Demo && (
            <div className="pproject__demo aip__demo">
              <DemoTag>Demo · fictional data</DemoTag>
              {p.demoNote && <p className="aip__note">{p.demoNote}</p>}
              <Demo />
            </div>
          )}
        </div>

        {(p.screenshot || p.analysis) && (
          <div className="aip__real">
            {p.screenshot && (
              <figure className="aip__shot">
                <p className="aip__k">The real assistant</p>
                <img src={p.screenshot.src} alt={p.screenshot.alt} width={800} height={538} loading="lazy" decoding="async" />
                <figcaption>{p.screenshot.caption}</figcaption>
              </figure>
            )}
            {p.analysis && (
              <div className="aip__ask">
                <p className="aip__k">No fixed menu</p>
                <h4>{p.analysis.title}</h4>
                <p>{p.analysis.d}</p>
                <ul>
                  {p.analysis.examples.map((e) => (
                    <li key={e}>“{e}”</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="aip__helps">
          <p className="aip__k">Who it helps</p>
          <ul>
            {p.helps.map((h, i) => (
              <li key={h.who} className="stagger" style={{ "--i": i } as React.CSSProperties}>
                <strong>{h.who}</strong>
                <p>{h.d}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="aip__foot">
          <div>
            <p className="aip__k">What it can do</p>
            <ul className="aip__list">
              {p.features.map((f) => (
                <li key={f}>
                  <Icon name="check" size={15} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="aip__k">Built-in guardrails</p>
            <ul className="aip__list aip__list--guard">
              {p.guardrails.map((g) => (
                <li key={g}>
                  <Icon name="shield" size={15} />
                  {g}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="aip__k">Tools I used</p>
            <dl className="aip__stack">
              {p.stack.map((s) => (
                <div key={s.group}>
                  <dt>{s.group}</dt>
                  <dd className="tags">
                    {s.items.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </article>
    </Section>
  );
}
