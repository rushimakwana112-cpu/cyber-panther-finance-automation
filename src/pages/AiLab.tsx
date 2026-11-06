import { DemoTag } from "../components/DemoTag";
import { Icon } from "../components/Icon";
import { PageHead } from "../components/PageHead";
import { StageBadge, StageLegend } from "../components/StageBadge";
import { aiRules, labItems } from "../content/misc";
import { PayrollChatDemo } from "../sections/demos/PayrollChatDemo";

/** AI Lab: where AI is used, where it was tested and not used, and how answers stay trustworthy. */
export function AiLab() {
  return (
    <>
      <PageHead eyebrow="AI Lab" title="I use AI where it helps, and only there." lead="I test AI on real finance work. If a simpler method is more accurate, I keep the simpler method." />
      <div className="container page-body">
        <StageLegend />
        <ul className="lab">
          {labItems.map((item, i) => (
            <li key={item.title} className="stagger" style={{ "--i": i } as React.CSSProperties}>
              <StageBadge stage={item.stage} />
              <h2>{item.title}</h2>
              <p>{item.d}</p>
              <a className="textlink" href={item.link.href}>
                {item.link.label} <Icon name="arrow" size={15} />
              </a>
            </li>
          ))}
        </ul>

        <section className="lab-rules" aria-labelledby="lab-rules-title">
          <h2 id="lab-rules-title">How I use AI on financial work</h2>
          <ul>
            {aiRules.map((r) => (
              <li key={r.t}>
                <Icon name={r.icon} size={20} />
                <h3>{r.t}</h3>
                <p>{r.d}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="cs__block cs__demo" aria-labelledby="lab-demo-title">
          <h2 id="lab-demo-title">Try the demo</h2>
          <p className="cs__sub">A simple copy of Finance Operations Intelligence with made-up data. It is not connected to any real system.</p>
          <DemoTag>Demo · made-up data</DemoTag>
          <PayrollChatDemo />
        </section>
      </div>
    </>
  );
}
