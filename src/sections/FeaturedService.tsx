import { useMemo, useState } from "react";
import { Code } from "../components/Code";
import { DemoTag } from "../components/DemoTag";
import { Icon } from "../components/Icon";
import { Section } from "../components/Section";
import { featuredService, services } from "../content/services";
import { INVOICES_PER_QUARTER, quarterRanges, sales } from "../data/demos";
import { goToContact } from "../lib/contact";
import { rupees } from "../lib/format";
import { useReducedMotion } from "../lib/hooks";

type Quarter = "all" | 1 | 2 | 3 | 4;
type GroupBy = "customer" | "region";

function buildQuery(q: Quarter, g: GroupBy) {
  const [from, to] = quarterRanges[String(q)];
  return `SELECT ${g},
       SUM(amount) AS total_amount,
       COUNT(*)    AS invoices
FROM   sales
WHERE  invoice_date BETWEEN '${from}' AND '${to}'
GROUP  BY ${g}
ORDER  BY total_amount DESC;`;
}

function runQuery(q: Quarter, g: GroupBy) {
  const totals = new Map<string, { total: number; count: number }>();
  for (const row of sales) {
    if (q !== "all" && row.q !== q) continue;
    const key = g === "customer" ? row.customer : row.region;
    const t = totals.get(key) ?? { total: 0, count: 0 };
    totals.set(key, { total: t.total + row.amount, count: t.count + INVOICES_PER_QUARTER });
  }
  return [...totals.entries()].map(([key, v]) => ({ key, ...v })).sort((a, b) => b.total - a.total);
}

function SqlConsole() {
  const [q, setQ] = useState<Quarter>("all");
  const [g, setG] = useState<GroupBy>("customer");
  const [ran, setRan] = useState<{ q: Quarter; g: GroupBy }>({ q: "all", g: "customer" });
  const [busy, setBusy] = useState(false);
  const reduced = useReducedMotion();

  const sql = useMemo(() => buildQuery(q, g), [q, g]);
  const rows = useMemo(() => runQuery(ran.q, ran.g), [ran]);
  const stale = ran.q !== q || ran.g !== g;
  const max = Math.max(...rows.map((r) => r.total));
  const total = rows.reduce((s, r) => s + r.total, 0);

  const run = () => {
    if (reduced) return setRan({ q, g });
    setBusy(true);
    window.setTimeout(() => {
      setRan({ q, g });
      setBusy(false);
    }, 450);
  };

  return (
    <div className="console" role="region" aria-label="SQL query demo with fictional data">
      <div className="console__bar">
        <span className="console__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="console__title">sales_report.sql</span>
        <DemoTag />
      </div>
      <div className="console__controls">
        <label>
          <span>Period</span>
          <select value={String(q)} onChange={(e) => setQ(e.target.value === "all" ? "all" : (Number(e.target.value) as Quarter))}>
            <option value="all">FY 2025-26</option>
            <option value="1">Q1 (Apr–Jun)</option>
            <option value="2">Q2 (Jul–Sep)</option>
            <option value="3">Q3 (Oct–Dec)</option>
            <option value="4">Q4 (Jan–Mar)</option>
          </select>
        </label>
        <label>
          <span>Group by</span>
          <select value={g} onChange={(e) => setG(e.target.value as GroupBy)}>
            <option value="customer">Customer</option>
            <option value="region">Region</option>
          </select>
        </label>
        <button className={`btn btn--sm ${stale ? "btn--primary" : "btn--ghost"}`} onClick={run} disabled={busy} aria-busy={busy}>
          {busy ? <span className="spinner" aria-hidden="true" /> : <Icon name="play" size={12} />} Run query
        </button>
      </div>
      <Code code={sql} lang="sql" label="Generated SQL query" />
      <div className={`console__result ${busy ? "is-busy" : ""} ${stale ? "is-stale" : ""}`} aria-live="polite">
        <div className="console__meta">
          <span>{busy ? "Running…" : `${rows.length} rows · ${rupees(total)} total`}</span>
          {stale && !busy && <span className="console__stale">Query changed — run to refresh</span>}
        </div>
        <div className="tablewrap">
          <table className="dtable dtable--compact">
            <thead>
              <tr>
                <th>{ran.g === "customer" ? "Customer" : "Region"}</th>
                <th className="r">Invoices</th>
                <th className="r">Total amount</th>
                <th className="bar-col" aria-hidden="true" />
              </tr>
            </thead>
            <tbody key={`${ran.q}-${ran.g}`}>
              {rows.map((r, i) => (
                <tr key={r.key} className="row-in" style={{ "--i": i } as React.CSSProperties}>
                  <td>{r.key}</td>
                  <td className="r mono">{r.count}</td>
                  <td className="r mono">{rupees(r.total)}</td>
                  <td className="bar-col" aria-hidden="true">
                    <span className="minibar" style={{ width: `${(r.total / max) * 100}%` }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function FeaturedService() {
  const others = services.filter((s) => !s.featured && s.summary);
  return (
    <Section
      id="services"
      index="04"
      eyebrow="Featured service"
      title={featuredService.title}
      intro="The service most of my work starts with: getting the right records out of your database and into a report you can trust."
      className="service"
    >
      <div className="service__grid">
        <div className="service__copy">
          <p className="service__summary">{featuredService.summary}</p>
          <ul className="checks">
            {featuredService.deliverables?.map((d) => (
              <li key={d}>
                <Icon name="check" size={16} />
                {d}
              </li>
            ))}
          </ul>
          <div className="service__cta">
            <button className="btn btn--primary" onClick={() => goToContact(featuredService.id)}>
              Discuss This Service <Icon name="arrow" size={16} />
            </button>
          </div>
          {others.length > 0 && (
            <div className="service__others">
              <p className="service__others-title">Also available</p>
              <ul>
                {others.map((s) => (
                  <li key={s.id}>
                    <button type="button" onClick={() => goToContact(s.id)}>
                      <span>
                        <strong>{s.title}</strong>
                        <span className="muted">{s.summary}</span>
                      </span>
                      <Icon name="arrow" size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <SqlConsole />
      </div>
    </Section>
  );
}
