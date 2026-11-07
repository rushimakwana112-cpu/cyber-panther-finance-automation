import { DemoTag } from "../components/DemoTag";
import { Icon } from "../components/Icon";
import { mprRows, outcomeOf, type Outcome } from "../data/caseDemos";
import { href } from "../lib/route";

const tone: Record<Outcome, string> = { "All clear": "good", "Already approved": "info", "Check by hand": "warn", Mismatched: "bad" };
const rows = mprRows.slice(0, 5);

/** The home page picture: a document being checked against a system, with problems passed to a person. */
export function HeroMatch() {
  return (
    <figure className="hmatch">
      <figcaption>
        <strong>Document check</strong>
        <DemoTag>Demo · made-up data</DemoTag>
      </figcaption>
      <table className="dtable dtable--compact">
        <thead>
          <tr>
            <th>Employee</th>
            <th className="r">Document</th>
            <th className="r">System</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const o = outcomeOf(r);
            return (
              <tr key={r.code} style={{ "--i": i } as React.CSSProperties}>
                <td className="mono">{r.code}</td>
                <td className="r mono">{r.mpr ?? "?"}</td>
                <td className="r mono">{r.portal}</td>
                <td>
                  <span className={`outcome outcome--${tone[o]}`}>{o}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="hmatch__note">
        <Icon name="shield" size={16} /> The system finds the problems. A person makes the decision.
      </p>
      <a className="textlink" href={href.project("pdf-image-reader")}>
        Try this demo <Icon name="arrow" size={15} />
      </a>
    </figure>
  );
}
