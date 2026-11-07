import { mprRows, outcomeOf, type Outcome } from "../data/caseDemos";
import { woMargins } from "../data/payrollBot";
import { rupeesShort } from "../lib/format";
import type { CaseStudy } from "../content/projects";

// Small application previews for project cards and pages. They are drawn from the same made-up
// data as the demos, so they never show real figures. Decorative: the text next to them says it all.

const tone: Record<Outcome, string> = { "All clear": "good", "Already approved": "info", "Check by hand": "warn", Mismatched: "bad" };

function ReaderPreview() {
  return (
    <>
      <div className="apv__docs">
        <span className="apv__doc">PDF</span>
        <span className="apv__doc">PDF</span>
        <span className="apv__doc apv__doc--scan">Scan</span>
        <span className="apv__arrow" />
        <span className="apv__ref">Reference data</span>
      </div>
      <ul className="apv__rows">
        {mprRows.slice(0, 4).map((r) => {
          const o = outcomeOf(r);
          return (
            <li key={r.code}>
              <span className="mono">{r.code}</span>
              <span className={`apv__pill apv__pill--${tone[o]}`}>{o}</span>
            </li>
          );
        })}
      </ul>
      <span className="apv__scan" />
    </>
  );
}

const payrollSteps = ["Salary file", "Clean and group", "Bank files", "Checks", "Letters and PDFs"];

function ControlPreview() {
  return (
    <>
      <div className="apv__cards">
        <span>
          <b>Ready</b>
          <i className="apv__bar" />
        </span>
        <span>
          <b>Checks</b>
          <i className="apv__bar apv__bar--warn" />
        </span>
      </div>
      <ol className="apv__steps">
        {payrollSteps.map((s, i) => (
          <li key={s} style={{ "--i": i } as React.CSSProperties}>
            <i />
            {s}
          </li>
        ))}
      </ol>
    </>
  );
}

function ChatPreview() {
  const wo = woMargins("Sep-2026");
  const max = Math.max(...wo.map((w) => w.margin));
  return (
    <>
      <p className="apv__ask">Which work order has the highest margin?</p>
      <div className="apv__answer">
        {wo.map((w) => (
          <span key={w.wo} className="apv__hbar">
            <span className="mono">{w.wo}</span>
            <i style={{ "--w": `${(w.margin / max) * 100}%` } as React.CSSProperties} />
            <span className="mono">{rupeesShort(w.margin)}</span>
          </span>
        ))}
      </div>
    </>
  );
}

const titles: Record<CaseStudy["demo"], string> = { mpr: "Smart PDF & Image Reader", control: "Payroll control screen", chat: "Ask a finance question" };

export function AppPreview({ kind }: { kind: CaseStudy["demo"] }) {
  return (
    <div className={`apv apv--${kind}`} aria-hidden="true">
      <div className="apv__chrome">
        <i />
        <i />
        <i />
        <span>{titles[kind]}</span>
        <em>Demo data</em>
      </div>
      <div className="apv__body">{kind === "mpr" ? <ReaderPreview /> : kind === "control" ? <ControlPreview /> : <ChatPreview />}</div>
    </div>
  );
}
