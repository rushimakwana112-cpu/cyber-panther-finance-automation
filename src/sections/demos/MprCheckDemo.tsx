import { useEffect, useRef, useState } from "react";
import { DemoTag } from "../../components/DemoTag";
import { Icon } from "../../components/Icon";
import { mprRows, outcomeOf, type Outcome } from "../../data/caseDemos";
import { useReducedMotion } from "../../lib/hooks";

const outcomes: Outcome[] = ["All clear", "Already ticked", "Unreadable", "Mismatched"];
const tone: Record<Outcome, string> = { "All clear": "good", "Already ticked": "info", Unreadable: "warn", Mismatched: "bad" };
const exceptions = mprRows.filter((r) => ["Unreadable", "Mismatched"].includes(outcomeOf(r)));

/** Fictional attendance check: run it, then act as the human reviewer on the exceptions. */
export function MprCheckDemo() {
  const [scanned, setScanned] = useState(0);
  const [running, setRunning] = useState(false);
  const [reviewed, setReviewed] = useState<string[]>([]);
  const timer = useRef<number | undefined>(undefined);
  const reduced = useReducedMotion();
  const done = scanned >= mprRows.length;

  useEffect(() => () => window.clearInterval(timer.current), []);

  const run = () => {
    window.clearInterval(timer.current);
    setReviewed([]);
    if (reduced) {
      setScanned(mprRows.length);
      return;
    }
    setScanned(0);
    setRunning(true);
    let i = 0;
    timer.current = window.setInterval(() => {
      i += 1;
      setScanned(i);
      if (i >= mprRows.length) {
        window.clearInterval(timer.current);
        setRunning(false);
      }
    }, 320);
  };

  const shown = mprRows.slice(0, scanned);

  return (
    <div className="cdemo" role="region" aria-label="MPR check demo with fictional data">
      <div className="cdemo__bar">
        <DemoTag>Demo · made-up data</DemoTag>
        <button className="btn btn--primary btn--sm" onClick={run} disabled={running} aria-busy={running}>
          <Icon name={done ? "refresh" : "play"} size={13} /> {done ? "Run again" : running ? "Checking…" : "Run check"}
        </button>
      </div>

      <div className="tablewrap">
        <table className="dtable dtable--compact cdemo__table">
          <thead>
            <tr>
              <th>Employee</th>
              <th className="r">Absent in MPR</th>
              <th className="r">Absent in portal</th>
              <th>Could it be read?</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {mprRows.map((r, i) => {
              const seen = i < scanned;
              const o = outcomeOf(r);
              return (
                <tr key={r.code} className={running && i === scanned ? "is-scanning" : ""}>
                  <td className="mono">{r.code}</td>
                  <td className="r mono">{seen ? (r.mpr ?? "?") : "·"}</td>
                  <td className="r mono">{seen ? r.portal : "·"}</td>
                  <td>{seen ? r.readable : "·"}</td>
                  <td>{seen ? <span className={`outcome outcome--${tone[o]}`}>{o}</span> : <span className="muted">Waiting</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="cdemo__counts" aria-live="polite">
        {outcomes.map((o) => (
          <li key={o}>
            <strong className={`num outcome-n--${tone[o]}`}>{shown.filter((r) => outcomeOf(r) === o).length}</strong>
            <span>{o}</span>
          </li>
        ))}
      </ul>

      {done && (
        <div className="cdemo__review">
          <p className="cdemo__k">
            Items for a person to check · {reviewed.length} of {exceptions.length} done
          </p>
          <ul>
            {exceptions.map((r) => {
              const isDone = reviewed.includes(r.code);
              return (
                <li key={r.code} className={isDone ? "is-done" : ""}>
                  <span>
                    <strong className="mono">{r.code}</strong>{" "}
                    {outcomeOf(r) === "Unreadable" ? `The MPR could not be read. Portal shows ${r.portal}.` : `MPR shows ${r.mpr}, portal shows ${r.portal}.`}
                  </span>
                  <button
                    className="btn btn--ghost btn--sm"
                    aria-pressed={isDone}
                    onClick={() => setReviewed((x) => (isDone ? x.filter((c) => c !== r.code) : [...x, r.code]))}
                  >
                    {isDone ? (
                      <>
                        <Icon name="check" size={14} /> Reviewed
                      </>
                    ) : (
                      "Mark reviewed"
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
