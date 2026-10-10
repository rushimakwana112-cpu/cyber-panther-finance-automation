import { useState } from "react";
import { Code } from "../../components/Code";
import { customers, invoices } from "../../data/demos";
import { rupees } from "../../lib/format";
import { rovingKey } from "../../lib/hooks";

type Join = "INNER" | "LEFT";
const joins: Join[] = ["INNER", "LEFT"];

export function JoinDemo() {
  const [join, setJoin] = useState<Join>("INNER");

  const rows =
    join === "INNER"
      ? invoices.map((i) => ({ name: customers.find((c) => c.id === i.cust)!.name, inv: i.no, amount: i.amount as number | null }))
      : customers.flatMap((c) => {
          const own = invoices.filter((i) => i.cust === c.id);
          return own.length
            ? own.map((i) => ({ name: c.name, inv: i.no, amount: i.amount as number | null }))
            : [{ name: c.name, inv: "NULL", amount: null }];
        });

  const missing = customers.filter((c) => !invoices.some((i) => i.cust === c.id)).map((c) => c.name);

  return (
    <div className="demo">
      <div className="seg seg--sm" role="radiogroup" aria-label="Join type">
        {joins.map((j, i) => (
          <button
            key={j}
            role="radio"
            aria-checked={join === j}
            tabIndex={join === j ? 0 : -1}
            className={join === j ? "is-active" : ""}
            onClick={() => setJoin(j)}
            onKeyDown={(e) => {
              const to = rovingKey(e, i, joins.length);
              if (to === null) return;
              setJoin(joins[to]);
              (e.currentTarget.parentElement?.children[to] as HTMLElement | undefined)?.focus();
            }}
          >
            {j} JOIN
          </button>
        ))}
      </div>
      <Code
        lang="sql"
        label="Join query"
        code={`SELECT c.name, i.invoice_no, i.amount
FROM   ${join === "INNER" ? "invoices i" : "customers c"}
${join} JOIN ${join === "INNER" ? "customers c" : "invoices i"}
       ON i.customer_id = c.id;`}
      />
      <div className="tablewrap">
        <table className="dtable dtable--compact">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Invoice</th>
              <th className="r">Amount</th>
            </tr>
          </thead>
          <tbody key={join}>
            {rows.map((r, i) => (
              <tr key={r.name + r.inv} className={`row-in ${r.amount === null ? "is-null" : ""}`} style={{ "--i": i } as React.CSSProperties}>
                <td>{r.name}</td>
                <td className="mono">{r.inv}</td>
                <td className="r mono">{r.amount === null ? "NULL" : rupees(r.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="demo__note" aria-live="polite">
        {join === "INNER"
          ? `${rows.length} rows — only customers with invoices. ${missing.join(", ")} is excluded.`
          : `${rows.length} rows — every customer appears. ${missing.join(", ")} shows NULL: a customer with no billing this period.`}
      </p>
    </div>
  );
}
