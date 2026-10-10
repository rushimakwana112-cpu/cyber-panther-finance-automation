export function DemoTag({ children = "Demo data" }: { children?: string }) {
  return <span className="demo-tag">{children}</span>;
}
