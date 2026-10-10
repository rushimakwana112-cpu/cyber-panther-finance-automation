import { useMemo, useState } from "react";
import { DemoTag } from "../components/DemoTag";
import { LineChart } from "../components/LineChart";
import {
  expenseMix,
  margin as marginSeries,
  metrics,
  months,
  periods,
  profit as profitSeries,
  series,
  totalFor,
  type MetricKey,
  type PeriodKey,
} from "../data/finance";
import { formatMetric, percent, rupees, rupeesShort } from "../lib/format";
import { rovingKey, useTweened, useTweenedArray } from "../lib/hooks";

const metricColor: Record<MetricKey, string> = {
  revenue: "var(--blue)",
  expenses: "var(--violet)",
  profit: "var(--blue)",
  margin: "var(--purple)",
};

function Kpi(props: {
  id: string;
  label: string;
  value: number;
  kind: "currency" | "percent";
  delta?: number;
  deltaLabel?: string;
  invert?: boolean;
  active: boolean;
  onSelect: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}) {
  const v = useTweened(props.value);
  const good = props.delta === undefined ? true : props.invert ? props.delta <= 0 : props.delta >= 0;
  return (
    <button
      id={props.id}
      role="tab"
      aria-selected={props.active}
      aria-controls="dash-panel"
      tabIndex={props.active ? 0 : -1}
      className={`kpi ${props.active ? "is-active" : ""}`}
      onClick={props.onSelect}
      onKeyDown={props.onKeyDown}
    >
      <span className="kpi__label">{props.label}</span>
      <span className="kpi__value num">{formatMetric(props.kind, v)}</span>
      {props.delta !== undefined && (
        <span className={`kpi__delta ${good ? "is-good" : "is-bad"}`}>
          {props.delta >= 0 ? "▲" : "▼"} {props.kind === "percent" ? `${Math.abs(props.delta).toFixed(1)} pts` : percent(Math.abs(props.delta))}
          <span className="kpi__delta-label"> {props.deltaLabel}</span>
        </span>
      )}
    </button>
  );
}

/** Hero dashboard: metric tabs, period switch, interactive trend and expense mix. */
export function Dashboard() {
  const [metricKey, setMetricKey] = useState<MetricKey>("revenue");
  const [periodKey, setPeriodKey] = useState<PeriodKey>("fy");
  const [mixKey, setMixKey] = useState<string | null>(null);

  const period = periods.find((p) => p.key === periodKey)!;
  const metric = metrics.find((m) => m.key === metricKey)!;
  const labels = months.slice(period.start);
  const target = useMemo(() => series(metricKey).slice(period.start), [metricKey, period.start]);
  const values = useTweenedArray(target);
  const [lo, hi] = useTweenedArray(
    useMemo(() => {
      const min = Math.min(...target);
      const max = Math.max(...target);
      const span = max - min || 1;
      return [min - span * 0.3, max + span * 0.18];
    }, [target]),
  );

  const periodExpenses = totalFor("expenses", period.start, 12);
  const mix = expenseMix.find((m) => m.key === mixKey);

  const metricIndex = metrics.findIndex((m) => m.key === metricKey);
  const onMetricKey = (e: React.KeyboardEvent, i: number) => {
    const to = rovingKey(e, i, metrics.length);
    if (to === null) return;
    setMetricKey(metrics[to].key);
    document.getElementById(`kpi-${metrics[to].key}`)?.focus();
  };

  const tip = (i: number) => {
    const m = period.start + i;
    const secondary =
      metricKey === "margin" ? `Net profit ${rupeesShort(profitSeries[m])}` : `Margin ${percent(marginSeries[m])}`;
    return (
      <>
        <span>{labels[i]} · {metric.label}</span>
        <strong>{formatMetric(metric.kind, target[i], false)}</strong>
        <em>{secondary}</em>
      </>
    );
  };

  return (
    <div className="dash" role="region" aria-label="Interactive financial dashboard (demonstration data)">
      <div className="dash__head">
        <div>
          <p className="dash__title">Financial overview</p>
          <p className="dash__sub">
            {period.long} · <DemoTag />
          </p>
        </div>
        <div className="seg" role="radiogroup" aria-label="Reporting period">
          {periods.map((p, i) => (
            <button
              key={p.key}
              role="radio"
              aria-checked={periodKey === p.key}
              tabIndex={periodKey === p.key ? 0 : -1}
              className={periodKey === p.key ? "is-active" : ""}
              onClick={() => setPeriodKey(p.key)}
              onKeyDown={(e) => {
                const to = rovingKey(e, i, periods.length);
                if (to === null) return;
                setPeriodKey(periods[to].key);
                (e.currentTarget.parentElement?.children[to] as HTMLElement | undefined)?.focus();
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="dash__kpis" role="tablist" aria-label="Metric">
        {metrics.map((m, i) => {
          const value = totalFor(m.key, period.start, 12);
          let delta: number | undefined;
          if (period.compare) {
            const prev = totalFor(m.key, period.compare[0], period.compare[1]);
            delta = m.kind === "percent" ? value - prev : ((value - prev) / Math.abs(prev)) * 100;
          }
          return (
            <Kpi
              key={m.key}
              id={`kpi-${m.key}`}
              label={m.label}
              value={value}
              kind={m.kind}
              delta={delta}
              deltaLabel={period.compareLabel}
              invert={m.invert}
              active={metricKey === m.key}
              onSelect={() => setMetricKey(m.key)}
              onKeyDown={(e) => onMetricKey(e, i)}
            />
          );
        })}
      </div>

      <div className="dash__chart" id="dash-panel" role="tabpanel" aria-labelledby={`kpi-${metrics[metricIndex].key}`}>
        <LineChart
          labels={labels}
          values={values}
          domain={[lo, hi]}
          formatTick={(v) => (metric.kind === "percent" ? percent(v, 0) : rupeesShort(v).replace(".00", ""))}
          describe={(i) => `${labels[i]}: ${formatMetric(metric.kind, target[i], false)}`}
          renderTip={tip}
          label={`${metric.label} by month, ${period.long}`}
          color={metricColor[metricKey]}
          height={196}
        />
      </div>

      <div className="dash__mix">
        <div className="dash__mix-head">
          <span>Expense mix</span>
          <span className="num">{rupeesShort(periodExpenses)}</span>
        </div>
        <div className="mixbar" aria-hidden="true">
          {expenseMix.map((m, i) => (
            <span
              key={m.key}
              className={`mixbar__seg mixbar__seg--${i} ${mixKey === m.key ? "is-active" : ""} ${mixKey && mixKey !== m.key ? "is-dim" : ""}`}
              style={{ flexGrow: m.share }}
              onClick={() => setMixKey((k) => (k === m.key ? null : m.key))}
            />
          ))}
        </div>
        <div className="mixlegend" role="group" aria-label="Expense categories — select one for details">
          {expenseMix.map((m, i) => (
            <button
              key={m.key}
              type="button"
              className={`mixlegend__item ${mixKey === m.key ? "is-active" : ""}`}
              aria-pressed={mixKey === m.key}
              onClick={() => setMixKey((k) => (k === m.key ? null : m.key))}
            >
              <i className={`dot dot--${i}`} />
              {m.label}
              <span className="num">{Math.round(m.share * 100)}%</span>
            </button>
          ))}
        </div>
        <p className="dash__mix-detail" aria-live="polite">
          {mix ? (
            <>
              <strong>{mix.label}</strong> <span className="num">{rupees(periodExpenses * mix.share)}</span> — {mix.note}
            </>
          ) : (
            <span className="muted">Select a category to see its amount for {period.long}.</span>
          )}
        </p>
      </div>
    </div>
  );
}
