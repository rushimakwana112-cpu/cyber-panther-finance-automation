import type { ReactNode } from "react";

/** Opening block of an inner page. */
export function PageHead({ eyebrow, title, lead, children }: { eyebrow: string; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <header className="phead">
      <div className="hero__glow" aria-hidden="true" />
      <div className="container phead__inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="phead__title">{title}</h1>
        {lead && <p className="phead__lead">{lead}</p>}
        {children}
      </div>
    </header>
  );
}
