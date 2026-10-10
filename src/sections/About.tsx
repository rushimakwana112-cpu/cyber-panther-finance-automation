import { Section } from "../components/Section";
import { principles } from "../content/strengths";

export function About() {
  return (
    <Section id="about" index="06" eyebrow="About" title="Hi, I’m Rushi." className="about">
      <div className="about__grid">
        <div className="about__copy">
          <p className="about__lead">
            I’m an accountant who works with financial data every day — payroll, bank transfers, work orders and the reports built from them.
          </p>
          <p>
            Over time I found that most reporting pain isn’t about the numbers. It’s about how they get assembled: files merged by hand, the same
            clean-up done every month, totals checked twice because nobody trusts the spreadsheet.
          </p>
          <p>
            So I combine accounting knowledge with financial data analysis and automation — SQL, Excel, Power Query, VBA and Python — to build
            reports that are accurate, repeatable and quick to refresh. Because I understand the finance side, the automation follows how your
            accounts actually work, not the other way round.
          </p>
        </div>
        <div>
          <p className="about__ptitle">How I work</p>
          <ul className="about__principles">
            {principles.map((p, i) => (
              <li key={p.t} className="stagger" style={{ "--i": i } as React.CSSProperties}>
                <span className="num">0{i + 1}</span>
                <div>
                  <strong>{p.t}</strong>
                  <p>{p.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
