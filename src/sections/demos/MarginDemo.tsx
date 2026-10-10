import { useState } from "react";
import { MARGIN_THRESHOLD, workOrders } from "../../data/demos";
import { percent, rupees } from "../../lib/format";
import { rovingKey } from "../../lib/hooks";

export function MarginDemo() {
  const [selected, setSelected] = useState(workOrders[3].id);
  const wo = workOrders.find((w) => w.id === selected)!;
  const max = Math.max(...workOrders.map((w) => w.revenue));
  const parts = [
    { k: "Labour", v: wo.labour },
    { k: "Material", v: wo.material },
    { k: "Overhead", v: wo.overhead },
  ];
  const low = (m: number) => m < MARGIN_THRESHOLD;

  return (
    <div className="demo demo--margin">
      <div className="wo-chart" role="radiogroup" aria-label="Work orders — select one">
        {workOrders.map((w, i) => (
          <button
            key={w.id}
            role="radio"
            aria-checked={selected === w.id}
            aria-label={`${w.id}, ${w.dept}, margin ${percent(w.margin, 0)}`}
            tabIndex={selected === w.id ? 0 : -1}
            className={`wo ${selected === w.id ? "is-active" : ""} ${low(w.margin) ? "is-low" : ""}`}
            onClick={() => setSelected(w.id)}
            onKeyDown={(e) => {
              const to = rovingKey(e, i, workOrders.length);
              if (to === null) return;
              setSelected(workOrders[to].id);
              (e.currentTarget.parentElement?.children[to] as HTMLElement | undefined)?.focus();
            }}
          >
            <span className="wo__bars" aria-hidden="true">
              <span className="wo__rev" style={{ height: `${(w.revenue / max) * 100}%` }} />
              <span className="wo__cost" style={{ height: `${(w.cost / max) * 100}%` }} />
            </span>
            <span className="wo__m num">{percent(w.margin, 0)}</span>
            <span className="wo__id mono">{w.id.slice(3)}</span>
          </button>
        ))}
      </div>
      <p className="legend-row">
        <span className="legend">
          <i className="dot dot--0" /> Revenue
        </span>
        <span className="legend">
          <i className="dot dot--3" /> Cost
        </span>
        <span className="legend">
          <i className="dot dot--warn" /> Below {MARGIN_THRESHOLD}% margin
        </span>
      </p>
      <div className="wo-detail" aria-live="polite">
        <div className="wo-detail__head">
          <strong className="mono">{wo.id}</strong>
          <span className="muted">{wo.dept}</span>
          <span className={`pill ${low(wo.margin) ? "pill--warn" : "pill--ok"}`}>{percent(wo.margin)} margin</span>
        </div>
        <div className="stack" aria-hidden="true">
          {parts.map((p, i) => (
            <span key={p.k} className={`stack__seg stack__seg--${i}`} style={{ width: `${(p.v / wo.revenue) * 100}%` }} />
          ))}
          <span className="stack__seg stack__seg--profit" style={{ width: `${((wo.revenue - wo.cost) / wo.revenue) * 100}%` }} />
        </div>
        <dl className="wo-detail__grid">
          {parts.map((p) => (
            <div key={p.k}>
              <dt>{p.k}</dt>
              <dd className="num">{rupees(p.v)}</dd>
            </div>
          ))}
          <div>
            <dt>Revenue</dt>
            <dd className="num">{rupees(wo.revenue)}</dd>
          </div>
          <div>
            <dt>Gross profit</dt>
            <dd className="num accent">{rupees(wo.revenue - wo.cost)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
