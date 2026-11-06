import { useEffect, useRef, useState } from "react";
import { Icon } from "../components/Icon";
import { PageHead } from "../components/PageHead";
import { capabilities, demoList, type DemoId } from "../content/capabilities";
import { projectById } from "../content/projects";
import { rovingKey, useReducedMotion } from "../lib/hooks";
import { href } from "../lib/route";
import { Dashboard } from "../sections/Dashboard";
import { DataCleaning } from "../sections/DataCleaning";
import { JoinDemo } from "../sections/demos/JoinDemo";
import { MarginDemo } from "../sections/demos/MarginDemo";
import { RefreshDemo } from "../sections/demos/RefreshDemo";
import { SqlConsole } from "../sections/demos/SqlConsole";

const views: Record<DemoId, () => React.JSX.Element> = {
  dashboard: () => <Dashboard />,
  cleaning: DataCleaning,
  sql: SqlConsole,
  join: JoinDemo,
  refresh: RefreshDemo,
  margin: MarginDemo,
};

const isDemo = (x?: string): x is DemoId => demoList.some((d) => d.id === x);

export function Tools({ demo }: { demo?: string }) {
  const [active, setActive] = useState<DemoId>(isDemo(demo) ? demo : "dashboard");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const area = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // A link to a specific demo opens it and brings it into view.
  useEffect(() => {
    if (!isDemo(demo)) return;
    setActive(demo);
    const frame = requestAnimationFrame(() => area.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }));
    return () => cancelAnimationFrame(frame);
  }, [demo, reduced]);

  const current = demoList.find((d) => d.id === active)!;
  const View = views[active];

  return (
    <>
      <PageHead eyebrow="Finance tools" title="Finance tools you can try." lead="Small working demos from finance, accounting and payroll work. They use made-up data, so you can click anything." />
      <section className="demos" ref={area} aria-labelledby="demos-title">
        <div className="container">
          <p className="eyebrow">Demos</p>
          <h2 id="demos-title" className="section__title">
            Choose a demo.
          </h2>
          <p className="demos__note">These small examples show the kind of work involved. They are demos, not client or company projects.</p>
          <div className="dtabs" role="tablist" aria-label="Demos">
            {demoList.map((d, i) => (
              <button
                key={d.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`dtab-${d.id}`}
                aria-selected={active === d.id}
                aria-controls="dpanel"
                tabIndex={active === d.id ? 0 : -1}
                className={active === d.id ? "is-active" : ""}
                onClick={() => setActive(d.id)}
                onKeyDown={(e) => {
                  const to = rovingKey(e, i, demoList.length);
                  if (to === null) return;
                  setActive(demoList[to].id);
                  tabs.current[to]?.focus();
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
          <div id="dpanel" role="tabpanel" aria-labelledby={`dtab-${active}`} key={active} className="dpanel">
            <p className="dpanel__d">{current.d}</p>
            <View />
          </div>
        </div>
      </section>
      <div className="container page-body tools-caps">
        <h2 className="section__title">What I can do.</h2>
        <ul className="caps">
          {capabilities.map((c, i) => (
            <li key={c.id} className="stagger" style={{ "--i": i } as React.CSSProperties}>
              <Icon name={c.icon} size={22} />
              <h2>{c.title}</h2>
              <p>{c.d}</p>
              <div className="caps__links">
                {c.project && (
                  <a href={href.project(c.project)}>
                    {projectById(c.project)?.title} <Icon name="arrow" size={13} />
                  </a>
                )}
                {c.demo && (
                  <a href={href.demo(c.demo)} onClick={() => c.demo === demo && area.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" })}>
                    Try the demo <Icon name="arrow" size={13} />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
