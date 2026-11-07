import { useState } from "react";
import { rovingKey } from "../lib/hooks";

// The connected workflow on the home page. Plain words only, and no internal detail.
const steps = [
  { t: "Raw Excel", d: "Salary and finance files, as they arrive." },
  { t: "Power Query", d: "Cleans and combines the data in Excel." },
  { t: "SQL", d: "Gets the right records out of a database." },
  { t: "Validation", d: "Checks totals and rules, and lists anything that looks wrong." },
  { t: "Reports", d: "Summaries and reports, all from the same checked data." },
  { t: "Bank Files", d: "Bank transfer files, ready to send to the bank." },
];

export function AutomationFlow() {
  const [active, setActive] = useState(0);
  return (
    <div className="aflow">
      <ol className="aflow__track" aria-label="Automation workflow">
        {steps.map((s, i) => (
          <li key={s.t} className={`${i === active ? "is-on" : ""} ${i < active ? "is-done" : ""}`} style={{ "--i": i } as React.CSSProperties}>
            <button
              type="button"
              aria-pressed={i === active}
              aria-describedby="aflow-detail"
              tabIndex={i === active ? 0 : -1}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                const to = rovingKey(e, i, steps.length);
                if (to === null) return;
                setActive(to);
                (e.currentTarget.closest("ol")?.querySelectorAll("button")[to] as HTMLButtonElement | undefined)?.focus();
              }}
            >
              <span className="aflow__n num">{String(i + 1).padStart(2, "0")}</span>
              <span className="aflow__dot" aria-hidden="true" />
              <span className="aflow__t">{s.t}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="aflow__detail" id="aflow-detail" aria-live="polite">
        <strong>{steps[active].t}</strong>
        {steps[active].d}
      </p>
    </div>
  );
}
