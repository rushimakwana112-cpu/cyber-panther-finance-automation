import { useEffect, useRef, useState } from "react";
import { Icon } from "../../components/Icon";
import { monthlyFiles } from "../../data/demos";
import { rupees, rupeesShort } from "../../lib/format";

export function RefreshDemo() {
  const [inFolder, setInFolder] = useState(3);
  const [loaded, setLoaded] = useState(3);
  const [busy, setBusy] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const files = monthlyFiles.slice(0, inFolder);
  const inReport = monthlyFiles.slice(0, loaded);
  const total = inReport.reduce((s, f) => s + f.total, 0);
  const rows = inReport.reduce((s, f) => s + f.rows, 0);
  const max = Math.max(...monthlyFiles.map((f) => f.total));

  return (
    <div className="demo demo--refresh">
      <div className="folder">
        <p className="folder__path mono">/Monthly Exports</p>
        <ul>
          {files.map((f, i) => (
            <li key={f.name} className={i >= loaded ? "is-new" : ""}>
              <Icon name="file" size={15} />
              <span className="mono">{f.name}</span>
              <span className="muted num">{f.rows} rows</span>
            </li>
          ))}
        </ul>
        <div className="folder__actions">
          <button className="btn btn--ghost btn--sm" onClick={() => setInFolder((n) => n + 1)} disabled={inFolder >= monthlyFiles.length}>
            <Icon name="plus" size={14} /> {inFolder < monthlyFiles.length ? `Add ${monthlyFiles[inFolder].name}` : "All files added"}
          </button>
          <button
            className={`btn btn--sm ${inFolder > loaded ? "btn--primary" : "btn--ghost"}`}
            onClick={() => {
              setBusy(true);
              timer.current = window.setTimeout(() => {
                setLoaded(inFolder);
                setBusy(false);
              }, 600);
            }}
            disabled={busy || inFolder === loaded}
            aria-busy={busy}
          >
            {busy ? <span className="spinner" aria-hidden="true" /> : <Icon name="refresh" size={14} />} Refresh report
          </button>
          {loaded > 3 && !busy && (
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => {
                setInFolder(3);
                setLoaded(3);
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>
      <div className={`report ${busy ? "is-busy" : ""}`} aria-live="polite">
        <p className="report__title">
          Sales summary · {inReport[0].month}–{inReport[inReport.length - 1].month}
        </p>
        <div className="report__kpis">
          <div>
            <span>Total sales</span>
            <strong className="num">{rupeesShort(total)}</strong>
          </div>
          <div>
            <span>Rows combined</span>
            <strong className="num">{rows.toLocaleString("en-IN")}</strong>
          </div>
          <div>
            <span>Files</span>
            <strong className="num">{inReport.length}</strong>
          </div>
        </div>
        <div className="vbars" role="img" aria-label={`Sales by month: ${inReport.map((f) => `${f.month} ${rupees(f.total)}`).join(", ")}`}>
          {monthlyFiles.map((f, i) => (
            <div key={f.month} className={`vbar ${i < loaded ? "" : "is-empty"}`}>
              <span className="vbar__fill" style={{ height: i < loaded ? `${(f.total / max) * 100}%` : "4%" }} title={i < loaded ? rupees(f.total) : "Not yet loaded"} />
              <span className="vbar__label">{f.month}</span>
            </div>
          ))}
        </div>
        {inFolder > loaded && !busy && <p className="demo__note">New file detected — refresh to include it.</p>}
      </div>
    </div>
  );
}
