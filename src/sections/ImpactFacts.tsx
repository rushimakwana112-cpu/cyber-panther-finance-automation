import { useInView, useTweened } from "../lib/hooks";

// Facts about how the systems are built, not performance results. Never add a measured result here
// unless the owner has measured and approved it.
const facts = [
  { n: 3, label: "Systems in real use", d: "Built for daily finance and payroll work." },
  { n: 2, label: "Reads of every page", d: "A value counts only when both reads agree." },
  { n: 1, label: "Control screen for payroll", d: "Every payroll job starts from one place." },
  { n: 0, label: "Internet AI services used", d: "Private data stays inside the office." },
];

function Counter({ to, run }: { to: number; run: boolean }) {
  const v = useTweened(run ? to : 0, 1200);
  return <>{Math.round(v)}</>;
}

export function ImpactFacts() {
  const { ref, visible } = useInView<HTMLUListElement>();
  return (
    <ul className="ifacts" ref={ref}>
      {facts.map((f, i) => (
        <li key={f.label} className="stagger" style={{ "--i": i } as React.CSSProperties}>
          <strong className="num" aria-label={String(f.n)}>
            <Counter to={f.n} run={visible} />
          </strong>
          <span>{f.label}</span>
          <p>{f.d}</p>
        </li>
      ))}
    </ul>
  );
}
