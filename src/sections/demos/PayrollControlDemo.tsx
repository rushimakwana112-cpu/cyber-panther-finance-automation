import { useEffect, useRef, useState } from "react";
import { DemoTag } from "../../components/DemoTag";
import { Icon } from "../../components/Icon";
import { groupLines, payLines, sumNet } from "../../data/caseDemos";
import { rupees } from "../../lib/format";
import { useReducedMotion } from "../../lib/hooks";

const line = (g: { name: string; count: number; total: number }) => `${g.name}: ${g.count} employees, ${rupees(g.total)}`;
const errors = payLines.filter((r) => !r.pfOk);

const steps = [
  { t: "Bring in the salary file", out: [`${payLines.length} employees loaded, salary to pay ${rupees(sumNet(payLines))}`] },
  { t: "Clean and group", out: [`${groupLines((r) => r.category).length} categories, ${groupLines((r) => r.wo).length} work orders`] },
  { t: "Make bank files", out: groupLines((r) => r.bank).map(line) },
  { t: "Split by category", out: groupLines((r) => r.category).map(line) },
  { t: "HR and PF checks", out: [`${errors.length} of ${payLines.length} employees flagged`, ...errors.map((r) => `Error list: ${r.code}, PF details need checking`)], warn: true },
  { t: "Letters, prints and PDFs", out: [`${groupLines((r) => r.bank).length} bank letters prepared, 1 payroll letter per category`] },
  { t: "Work-order summaries", out: groupLines((r) => r.wo).map(line) },
];

/** Fictional control screen: shows each step in order, and results come from the rows. */
export function PayrollControlDemo() {
  const [reached, setReached] = useState(0);
  const [running, setRunning] = useState(false);
  const [open, setOpen] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  const reduced = useReducedMotion();
  const done = reached >= steps.length;

  useEffect(() => () => window.clearInterval(timer.current), []);

  const run = () => {
    window.clearInterval(timer.current);
    if (reduced) {
      setReached(steps.length);
      setOpen(steps.length - 1);
      return;
    }
    setReached(0);
    setOpen(0);
    setRunning(true);
    let i = 0;
    timer.current = window.setInterval(() => {
      i += 1;
      setReached(i);
      setOpen(Math.min(i - 1, steps.length - 1));
      if (i >= steps.length) {
        window.clearInterval(timer.current);
        setRunning(false);
      }
    }, 520);
  };

  const current = steps[open];

  return (
    <div className="cdemo" role="region" aria-label="Payroll control dashboard demo with fictional data">
      <div className="cdemo__bar">
        <DemoTag>Demo · made-up data</DemoTag>
        <button className="btn btn--primary btn--sm" onClick={run} disabled={running} aria-busy={running}>
          <Icon name={done ? "refresh" : "play"} size={13} /> {done ? "Run again" : running ? "Running…" : "Run payroll"}
        </button>
      </div>
      <div className="control">
        <ol className="control__steps">
          {steps.map((s, i) => {
            const isDone = i < reached;
            return (
              <li key={s.t}>
                <button type="button" disabled={!isDone} aria-current={isDone && open === i ? "step" : undefined} className={`${isDone ? "is-done" : ""} ${isDone && open === i ? "is-open" : ""}`} onClick={() => setOpen(i)}>
                  <span className="control__mark">{isDone ? <Icon name={s.warn ? "alert" : "check"} size={14} /> : i + 1}</span>
                  {s.t}
                </button>
              </li>
            );
          })}
        </ol>
        <div className="control__out" aria-live="polite">
          {reached === 0 ? (
            <p className="muted">Press Run payroll to see each step in order. You can then select a step to see its result.</p>
          ) : (
            <>
              <p className="cdemo__k">{current.t}</p>
              <ul>
                {current.out.map((o) => (
                  <li key={o} className={current.warn && o.startsWith("Error") ? "is-warn" : ""}>
                    {o}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
