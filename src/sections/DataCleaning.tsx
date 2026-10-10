import { useEffect, useRef, useState } from "react";
import { DemoTag } from "../components/DemoTag";
import { Icon, type IconName } from "../components/Icon";
import { Section } from "../components/Section";
import {
  byCustomer,
  changeLog,
  counts,
  grossSales,
  issueCount,
  issueFilters,
  issueLabels,
  netSales,
  outcomes,
  rawRows,
  refunds,
  type IssueKey,
  type RawRow,
} from "../data/cleaning";
import { rupees } from "../lib/format";
import { useReducedMotion } from "../lib/hooks";

const steps: { key: string; label: string; icon: IconName; what: string }[] = [
  {
    key: "raw",
    label: "Raw data",
    icon: "file",
    what: "An export as it really arrives: mixed date formats, stray spaces, amounts typed as text and a duplicated row. Select an issue below to highlight it.",
  },
  {
    key: "clean",
    label: "Clean & transform",
    icon: "filter",
    what: "Each field is fixed by the same rule every time. Nothing is silently dropped — the duplicate is removed and the incomplete row is held for review.",
  },
  {
    key: "analyze",
    label: "Analyze",
    icon: "calc",
    what: "Clean rows are summarised: net sales by customer, with the refund kept separate, and totals that reconcile back to the source.",
  },
  {
    key: "report",
    label: "Report",
    icon: "report",
    what: "The steps are saved once, so next month’s export runs through the same rules and the report refreshes without being rebuilt.",
  },
  {
    key: "insight",
    label: "Business insights",
    icon: "insight",
    what: "The output is a short, readable answer a business owner can act on — not another spreadsheet to decode.",
  },
];

function RawTable({ focus }: { focus: IssueKey | null }) {
  const cell = (r: RawRow, keys: IssueKey[], base = "") => {
    const flagged = keys.some((k) => r.issues.includes(k));
    const focused = focus !== null && r.issues.includes(focus) && (keys.includes(focus) || focus === "duplicate");
    return `${base} ${flagged ? "flag" : ""} ${focused ? "is-focus" : ""}`;
  };
  return (
    <div className="tablewrap">
      <table className="dtable" data-focus={focus ?? undefined}>
        <caption className="sr-only">Raw transaction export with data quality issues highlighted</caption>
        <thead>
          <tr>
            <th>Txn ID</th>
            <th>Date</th>
            <th>Customer</th>
            <th className="r">Amount</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {rawRows.map((r, i) => (
            <tr key={i} className={r.issues.includes("duplicate") ? "is-issue-row" : ""} title={r.issues.map((k) => issueLabels[k]).join(" · ")}>
              <td className={cell(r, [], "mono")}>{r.id}</td>
              <td className={cell(r, ["date"], "mono")}>{r.date}</td>
              <td className={cell(r, ["name"])}>
                <span className="ws">{r.customer}</span>
              </td>
              <td className={cell(r, ["amount", "missing"], "mono r")}>{r.amount || "—"}</td>
              <td className={cell(r, ["category"])}>{r.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RawView() {
  const [focus, setFocus] = useState<IssueKey | null>(null);
  return (
    <div className="pview">
      <RawTable focus={focus} />
      <div className="issues" role="group" aria-label="Data quality issues — select one to highlight it">
        {issueFilters.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`issue ${f.key === "duplicate" ? "issue--dup" : ""} ${focus === f.key ? "is-active" : ""}`}
            aria-pressed={focus === f.key}
            onPointerEnter={(e) => e.pointerType === "mouse" && setFocus(f.key)}
            onPointerLeave={(e) => e.pointerType === "mouse" && setFocus(null)}
            onClick={() => setFocus((k) => (k === f.key ? null : f.key))}
          >
            <span className="num">{issueCount(f.key)}</span>
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CleanView() {
  return (
    <div className="pview pview--split">
      <div className="tablewrap">
        <table className="dtable dtable--clean">
          <caption className="sr-only">Cleaned transactions with the outcome for each original row</caption>
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th className="r">Amount</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {outcomes.map((o, i) => {
              const raw = rawRows[i];
              const fixed = (k: IssueKey) => (raw.issues.includes(k) ? "fixed" : "");
              const style = { "--i": i } as React.CSSProperties;
              return o.kind === "kept" ? (
                <tr key={i} className="row-in" style={style}>
                  <td className="mono">{o.row.id}</td>
                  <td className={`mono ${fixed("date")}`}>{o.row.date}</td>
                  <td className={fixed("name")}>{o.row.customer}</td>
                  <td className={`mono r ${fixed("amount")}`}>{rupees(o.row.amount)}</td>
                  <td className={fixed("category")}>{o.row.category}</td>
                </tr>
              ) : (
                <tr key={i} className={`row-out row-out--${o.kind}`} style={style}>
                  <td className="mono">{raw.id}</td>
                  <td colSpan={4}>
                    <span className="pill">{o.note}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div>
        <p className="tlog__title">What changed</p>
        <ul className="tlog">
          {changeLog.map((c, i) => (
            <li key={c.label} style={{ "--n": i } as React.CSSProperties}>
              <span className="num">{c.count}</span>
              {c.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AnalyzeView() {
  const max = Math.max(...byCustomer.map((c) => c.net));
  return (
    <div className="pview">
      <p className="tlog__title">Net sales by customer</p>
      <div className="hbars" role="list">
        {byCustomer.map((c, i) => (
          <div key={c.customer} className="hbar" role="listitem" style={{ "--i": i } as React.CSSProperties}>
            <span className="hbar__label">{c.customer}</span>
            <span className="hbar__track" aria-hidden="true">
              <span className="hbar__fill" style={{ width: `${Math.max(0, c.net / max) * 100}%` }} />
            </span>
            <span className={`hbar__val num ${c.net < 0 ? "is-neg" : ""}`}>{rupees(c.net)}</span>
          </div>
        ))}
      </div>
      <dl className="totals">
        <div>
          <dt>Gross sales</dt>
          <dd className="num">{rupees(grossSales)}</dd>
        </div>
        <div>
          <dt>Refunds</dt>
          <dd className="num">{rupees(netSales - grossSales)}</dd>
        </div>
        <div>
          <dt>Net sales</dt>
          <dd className="num accent">{rupees(netSales)}</dd>
        </div>
      </dl>
    </div>
  );
}

function ReportView() {
  return (
    <div className="pview pview--split">
      <pre className="code" aria-label="Saved transformation steps (Power Query)" tabIndex={0}>
        <code>
          <span className="c-cm">// Saved once — reruns on every new file</span>
          {"\n"}
          <span className="c-kw">let</span>
          {"\n  Source  "}
          <span className="c-op">=</span> Folder.Files(<span className="c-str">"Exports"</span>),
          {"\n  Dates   "}
          <span className="c-op">=</span> ToISODate(Source, <span className="c-str">"Date"</span>),
          {"\n  Names   "}
          <span className="c-op">=</span> Text.Proper(Text.Trim(...)),
          {"\n  Amounts "}
          <span className="c-op">=</span> Number.From(Clean(...)),
          {"\n  Unique  "}
          <span className="c-op">=</span> Table.Distinct(..., {"{"}
          <span className="c-str">"TxnID"</span>
          {"}"}),
          {"\n  Review  "}
          <span className="c-op">=</span> Table.SelectRows(..., <span className="c-kw">each</span> [Amount] = null)
          {"\n"}
          <span className="c-kw">in</span> Unique
        </code>
      </pre>
      <ul className="sched">
        <li>
          <Icon name="refresh" size={16} />
          <span>
            <strong>Refresh</strong> when a new export lands in the folder
          </span>
        </li>
        <li>
          <Icon name="check" size={16} />
          <span>
            <strong>Same rules</strong> applied every month — no manual edits
          </span>
        </li>
        <li>
          <Icon name="alert" size={16} />
          <span>
            <strong>Exceptions</strong> routed to a review tab, not deleted
          </span>
        </li>
      </ul>
    </div>
  );
}

function InsightView() {
  const top = byCustomer[0];
  const refundTotal = refunds.reduce((s, r) => s + r.amount, 0);
  return (
    <div className="pview insights">
      <p className="insights__big">
        <span className="num">{rupees(netSales)}</span> net sales from {counts.raw} raw rows, across {byCustomer.filter((c) => c.sales > 0).length} paying customers.
      </p>
      <ul>
        <li>
          <strong>{Math.round((top.net / netSales) * 100)}%</strong> of net sales came from {top.customer}.
        </li>
        <li>
          <strong>
            {refunds.length} refund{refunds.length === 1 ? "" : "s"}
          </strong>{" "}
          ({rupees(Math.abs(refundTotal))}) kept separate from sales, so gross revenue isn’t understated.
        </li>
        <li>
          <strong>
            {counts.held} transaction{counts.held === 1 ? "" : "s"}
          </strong>{" "}
          waiting for an amount — flagged, not guessed.
        </li>
      </ul>
      <p className="recon" aria-label="Row reconciliation">
        <span className="num">{counts.raw}</span> raw rows <span className="op">=</span> <span className="num">{counts.kept}</span> reported{" "}
        <span className="op">+</span> <span className="num">{counts.removed}</span> duplicate removed <span className="op">+</span>{" "}
        <span className="num">{counts.held}</span> held for review
        <Icon name="check" size={14} />
      </p>
    </div>
  );
}

const views = [RawView, CleanView, AnalyzeView, ReportView, InsightView];

export function DataCleaning() {
  const [current, setCurrent] = useState(0);
  const [reached, setReached] = useState(0);
  const [running, setRunning] = useState(false);
  const reduced = useReducedMotion();
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const run = () => {
    window.clearTimeout(timer.current);
    if (reduced) {
      setReached(steps.length - 1);
      setCurrent(1);
      return;
    }
    setRunning(true);
    setCurrent(0);
    setReached(0);
    let i = 0;
    const next = () => {
      i += 1;
      setCurrent(i);
      setReached(i);
      if (i < steps.length - 1) timer.current = window.setTimeout(next, i === 1 ? 1800 : 1200);
      else setRunning(false);
    };
    timer.current = window.setTimeout(next, 500);
  };

  const reset = () => {
    window.clearTimeout(timer.current);
    setRunning(false);
    setCurrent(0);
    setReached(0);
  };

  const View = views[current];
  const step = steps[current];

  return (
    <Section
      id="process"
      index="03"
      eyebrow="Data cleaning, step by step"
      title="From messy export to a clear answer."
      intro="A small example of the work, on fictional records. Press Transform to watch seven raw rows become a reliable report, then click any stage to look closer."
      className="pipeline"
    >
      <div className="pipe">
        <div className="pipe__bar">
          <ol className="flow" aria-label="Transformation stages">
            {steps.map((s, i) => {
              const locked = i > reached;
              const done = i < reached || (i === reached && !running && reached > 0);
              return (
                <li key={s.key} className={`flow__step ${current === i ? "is-current" : ""} ${done ? "is-done" : ""} ${locked ? "is-locked" : ""}`}>
                  <button
                    type="button"
                    onClick={() => !locked && !running && setCurrent(i)}
                    aria-disabled={locked || running}
                    aria-current={current === i ? "step" : undefined}
                    title={locked ? "Run the transform to unlock this stage" : s.what}
                  >
                    <span className="flow__node">
                      <Icon name={s.icon} size={17} />
                    </span>
                    <span className="flow__label">{s.label}</span>
                  </button>
                  {i < steps.length - 1 && (
                    <span className={`flow__link ${i < reached ? "is-on" : ""} ${running && i === reached ? "is-running" : ""}`} aria-hidden="true">
                      <i />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
          <div className="pipe__actions">
            {reached === 0 || running ? (
              <button className="btn btn--primary" onClick={run} disabled={running} aria-busy={running}>
                {running ? (
                  <>
                    <span className="spinner" aria-hidden="true" /> Transforming…
                  </>
                ) : (
                  <>
                    <Icon name="play" size={14} /> Transform data
                  </>
                )}
              </button>
            ) : (
              <button className="btn btn--ghost" onClick={reset}>
                <Icon name="refresh" size={15} /> Reset demo
              </button>
            )}
          </div>
        </div>
        <div className="pipe__body">
          <div className="pipe__explain" aria-live="polite">
            <p className="pipe__stage-n num">
              Stage {current + 1} / {steps.length}
            </p>
            <h3>{step.label}</h3>
            <p>{step.what}</p>
            <DemoTag>Illustrative · fictional records</DemoTag>
          </div>
          <div className="pipe__view" key={current}>
            <View />
          </div>
        </div>
      </div>
    </Section>
  );
}
