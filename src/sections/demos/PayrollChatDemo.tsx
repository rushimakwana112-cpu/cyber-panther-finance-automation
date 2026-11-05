import { useEffect, useState } from "react";
import { Code } from "../../components/Code";
import { Icon } from "../../components/Icon";
import { monthTotals, payRows, woMargins } from "../../data/payrollBot";
import { percent, rupees, rupeesShort } from "../../lib/format";
import { rovingKey, useReducedMotion } from "../../lib/hooks";

// Mirrors the real assistant's answer layout: summary, KPI tiles, then Chart / Table / SQL / Insights tabs.
type Answer = {
  q: string;
  sql: string;
  text: string;
  kpis: { k: string; v: string }[];
  bars?: { label: string; value: number }[];
  cols: string[];
  rows: string[][];
  insight: string;
  policy?: string;
};

const sep = monthTotals("Sep-2026");
const aug = monthTotals("Aug-2026");
const sepWo = woMargins("Sep-2026");
const sum = (xs: number[]) => xs.reduce((s, x) => s + x, 0);
const sepBase = sum(sepWo.map((w) => w.base));
const sepMargin = sepBase - sep.ctc;

function changeInsight() {
  const augRows = payRows.filter((r) => r.month === "Aug-2026");
  const sepRows = payRows.filter((r) => r.month === "Sep-2026");
  const joined = sepRows.filter((r) => !augRows.some((a) => a.emp === r.emp)).map((r) => r.emp);
  const revised = sepRows.filter((r) => augRows.some((a) => a.emp === r.emp && a.ctc !== r.ctc)).map((r) => r.emp);
  return `The increase comes from a new joiner (${joined.join(", ")}) and a revised salary (${revised.join(", ")}).`;
}

const answers: Answer[] = [
  {
    q: "Give me projection of Oct-26",
    sql: `SELECT WorkOrder, Employee, CTC,
       InvoiceAmount * 100.0 / 118 AS BaseSales
FROM   payroll
WHERE  Month = ? AND Year = ?;   -- 9, 2026
-- every running work order is carried into Oct-2026`,
    text: `Projected for Oct-2026 (as on 30-Sep-26, based on Sep-2026): CTC ${rupees(sep.ctc)} · Base sales ${rupees(sepBase)} · Margin ${rupees(sepMargin)} (${percent((sepMargin / sep.ctc) * 100)} on CTC) · ${sepWo.length} work orders running.`,
    kpis: [
      { k: "Projected CTC", v: rupeesShort(sep.ctc) },
      { k: "Projected base sales", v: rupeesShort(sepBase) },
      { k: "Projected margin", v: rupeesShort(sepMargin) },
      { k: "Margin % (on CTC)", v: percent((sepMargin / sep.ctc) * 100) },
    ],
    bars: sepWo.map((w) => ({ label: w.wo, value: w.base })),
    cols: ["Work order", "Base sales", "CTC", "Margin"],
    rows: sepWo.map((w) => [w.wo, rupees(w.base), rupees(w.ctc), rupees(w.margin)]),
    insight: `${sepWo[0].wo} brings in most of the expected profit. ${sepWo[sepWo.length - 1].wo} is close to making no profit, so a salary increase there could cause a loss.`,
  },
  {
    q: "Which work order has the highest margin in Sep-26?",
    sql: `SELECT WorkOrder,
       MAX(InvoiceAmount) * 100.0 / 118 AS BaseSales,
       SUM(CTC) AS CTC
FROM   payroll
WHERE  Month = ? AND Year = ?
GROUP  BY WorkOrder;             -- 9, 2026`,
    text: `${sepWo[0].wo} has the highest margin in Sep-2026 at ${percent(sepWo[0].pct)} on CTC.`,
    kpis: [
      { k: "Best work order", v: sepWo[0].wo },
      { k: "Its margin %", v: percent(sepWo[0].pct) },
    ],
    bars: sepWo.map((w) => ({ label: w.wo, value: w.margin })),
    cols: ["Work order", "Base sales", "CTC", "Margin %"],
    rows: sepWo.map((w) => [w.wo, rupees(w.base), rupees(w.ctc), percent(w.pct)]),
    insight: `${sepWo[sepWo.length - 1].wo} has a low margin of ${percent(sepWo[sepWo.length - 1].pct)} , so it is worth reviewing.`,
  },
  {
    q: "Compare Aug-26 and Sep-26 CTC",
    sql: `SELECT Month, COUNT(DISTINCT Employee) AS Employees,
       SUM(CTC) AS CTC
FROM   payroll
WHERE  Year = ? AND Month IN (?, ?)
GROUP  BY Month;                 -- 2026, 8, 9`,
    text: `CTC rose from ${rupees(aug.ctc)} to ${rupees(sep.ctc)}.`,
    kpis: [
      { k: "Change", v: rupeesShort(sep.ctc - aug.ctc) },
      { k: "Change %", v: percent(((sep.ctc - aug.ctc) / aug.ctc) * 100) },
    ],
    bars: [aug, sep].map((t) => ({ label: t.month, value: t.ctc })),
    cols: ["Month", "Employees", "CTC"],
    rows: [aug, sep].map((t) => [t.month, String(t.employees), rupees(t.ctc)]),
    insight: changeInsight(),
  },
  {
    q: "List each employee’s salary for Sep-26 (for a user who can see totals only)",
    policy: "This user can see totals only",
    sql: `SELECT SUM(GrossAmount) AS Gross, SUM(CTC) AS CTC
FROM   payroll
WHERE  Month = ? AND Year = ?;   -- 9, 2026`,
    text: "This user can see totals only, so individual salaries are hidden. Here is the Sep-2026 total instead.",
    kpis: [
      { k: "Gross", v: rupeesShort(sep.gross) },
      { k: "CTC", v: rupeesShort(sep.ctc) },
    ],
    cols: ["Month", "Gross", "CTC"],
    rows: [["Sep-2026", rupees(sep.gross), rupees(sep.ctc)]],
    insight: "In this demo, individual salaries stay hidden because this user can see totals only.",
  },
];

const steps = ["Question received", "Worked out what you are asking", "Found the data", "Answer written"];
type View = "Chart" | "Table" | "SQL" | "Insights";

function AnswerView({ a }: { a: Answer }) {
  const views: View[] = a.bars ? ["Chart", "Table", "SQL", "Insights"] : ["Table", "SQL", "Insights"];
  const [view, setView] = useState<View>(views[0]);
  const max = Math.max(...(a.bars ?? []).map((b) => Math.abs(b.value)), 1);

  return (
    <div className="bubble bubble--bot">
      <p>{a.text}</p>
      <div className="chatdemo__kpis">
        {a.kpis.map((k) => (
          <div key={k.k}>
            <span>{k.k}</span>
            <strong className="num">{k.v}</strong>
          </div>
        ))}
      </div>
      <div className="seg seg--sm" role="tablist" aria-label="Answer view">
        {views.map((v, i) => (
          <button
            key={v}
            role="tab"
            aria-selected={view === v}
            tabIndex={view === v ? 0 : -1}
            className={view === v ? "is-active" : ""}
            onClick={() => setView(v)}
            onKeyDown={(e) => {
              const to = rovingKey(e, i, views.length);
              if (to === null) return;
              setView(views[to]);
              (e.currentTarget.parentElement?.children[to] as HTMLElement | undefined)?.focus();
            }}
          >
            {v}
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-label={view}>
        {view === "Chart" && a.bars && (
          <ul className="chatdemo__bars">
            {a.bars.map((b, i) => (
              <li key={b.label} style={{ "--w": `${(Math.abs(b.value) / max) * 100}%`, "--i": i } as React.CSSProperties}>
                <span className="mono">{b.label}</span>
                <span className="chatdemo__bar-track">
                  <span className="chatdemo__bar-fill" />
                </span>
                <span className="mono">{rupeesShort(b.value)}</span>
              </li>
            ))}
          </ul>
        )}
        {view === "Table" && (
          <div className="tablewrap">
            <table className="dtable dtable--compact">
              <thead>
                <tr>
                  {a.cols.map((c, ci) => (
                    <th key={c} className={ci ? "r" : ""}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {a.rows.map((r, ri) => (
                  <tr key={r[0]} className="row-in" style={{ "--i": ri } as React.CSSProperties}>
                    {r.map((v, ci) => (
                      <td key={ci} className={ci ? "r mono" : "mono"}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {view === "SQL" && <Code lang="sql" label="Read-only SQL the assistant ran" code={a.sql} />}
        {view === "Insights" && <p className="chatdemo__insight">{a.insight}</p>}
      </div>
    </div>
  );
}

export function PayrollChatDemo() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (active === null) return;
    if (reduced) {
      setStep(steps.length);
      return;
    }
    setStep(1);
    const id = window.setInterval(() => setStep((s) => (s >= steps.length ? s : s + 1)), 450);
    return () => window.clearInterval(id);
  }, [active, reduced]);

  const a = active === null ? null : answers[active];

  return (
    <div className="demo chatdemo">
      <div className="chatdemo__bar">
        <span className="chatdemo__dot" aria-hidden="true" />
        <span className="mono">Demo copy · fictional rows · runs in your browser</span>
      </div>
      <p className="chatdemo__label">Try a question</p>
      <div className="chatdemo__qs">
        {answers.map((x, i) => (
          <button key={x.q} className={`chip ${active === i ? "is-active" : ""}`} aria-pressed={active === i} onClick={() => setActive(i)}>
            {x.q}
          </button>
        ))}
      </div>

      <div className="chatdemo__log" aria-live="polite">
        {!a ? (
          <p className="chatdemo__empty">Pick a question to see how the assistant answers it.</p>
        ) : (
          <div key={active}>
            <div className="bubble bubble--user">{a.q}</div>
            <ol className="chatdemo__steps">
              {steps.map((s, i) => (
                <li key={s} className={step > i ? "is-done" : step === i ? "is-now" : ""}>
                  <span className="chatdemo__tick">{step > i ? <Icon name="check" size={13} /> : <span className="num">{i + 1}</span>}</span>
                  <span>
                    {s}
                                        {i === 3 && step > 3 && a.policy && <span className="pill pill--warn chatdemo__policy">{a.policy}</span>}
                  </span>
                </li>
              ))}
            </ol>
            {step > 3 && <AnswerView a={a} />}
          </div>
        )}
      </div>
    </div>
  );
}
