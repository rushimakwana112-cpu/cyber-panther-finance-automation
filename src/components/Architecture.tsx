import type { ArchColumn } from "../content/projects";

/** Left-to-right system diagram built in HTML, so it reflows to a vertical stack on phones. */
export function Architecture({ columns, label }: { columns: ArchColumn[]; label: string }) {
  return (
    <div className="arch" role="group" aria-label={label} style={{ "--cols": columns.length } as React.CSSProperties}>
      {columns.map((c) => (
        <div className="arch__col" key={c.label}>
          <p className="arch__label">{c.label}</p>
          <ul>
            {c.nodes.map((n) => (
              <li key={n.t} className={`arch__node ${n.tone ? `arch__node--${n.tone}` : ""}`}>
                <strong>{n.t}</strong>
                {n.d && <span>{n.d}</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Compact version of the same diagram, used on project cards. */
export function ArchStrip({ columns }: { columns: ArchColumn[] }) {
  return (
    <ol className="strip" aria-hidden="true">
      {columns.map((c) => (
        <li key={c.label}>{c.label}</li>
      ))}
    </ol>
  );
}
