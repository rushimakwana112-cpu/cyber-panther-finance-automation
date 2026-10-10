import type { ReactNode } from "react";
import { useInView } from "../lib/hooks";

type Props = {
  id: string;
  index?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** Standard page section: numbered eyebrow, title on the left, intro on the right. */
export function Section({ id, index, eyebrow, title, intro, className = "", children }: Props) {
  const { ref, visible } = useInView<HTMLElement>();
  const titleId = `${id}-title`;
  return (
    <section id={id} ref={ref} className={`section reveal ${visible ? "is-visible" : ""} ${className}`} aria-labelledby={titleId}>
      <div className="container">
        <header className="section__head">
          <div className="section__heading">
            <p className="eyebrow">
              {index && <span className="eyebrow__n">{index}</span>}
              {eyebrow}
            </p>
            <h2 id={titleId} className="section__title">
              {title}
            </h2>
          </div>
          {intro && <p className="section__intro">{intro}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
