import { Icon } from "../components/Icon";
import { Section } from "../components/Section";
import { strengths } from "../content/strengths";

export function Strengths() {
  return (
    <Section
      id="strengths"
      index="01"
      eyebrow="Professional strengths"
      title="Finance knowledge, meeting technology."
      intro="Three disciplines that rarely sit in one person — so the report follows how your accounts actually work, not the other way round."
      className="strengths"
    >
      <ol className="strengths__list">
        {strengths.map((s, i) => (
          <li key={s.key} className="strength stagger" style={{ "--i": i } as React.CSSProperties}>
            <span className="strength__icon">
              <Icon name={s.icon} size={20} />
            </span>
            <h3 className="strength__title">{s.title}</h3>
            <p className="strength__body">{s.body}</p>
            <p className="strength__detail">{s.detail}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
