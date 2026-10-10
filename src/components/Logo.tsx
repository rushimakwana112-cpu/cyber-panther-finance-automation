import { brand } from "../content/site";

/** Abstract mark: a rising "A" peak over three growing bars and a trend line. */
export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M3 28 L16 3.5 L29 28" stroke="var(--blue)" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
      <rect x="11.2" y="21" width="2.6" height="7" rx="0.6" fill="var(--blue)" />
      <rect x="14.7" y="18" width="2.6" height="10" rx="0.6" fill="var(--blue)" opacity="0.85" />
      <rect x="18.2" y="15" width="2.6" height="13" rx="0.6" fill="var(--blue)" opacity="0.7" />
      <path d="M12.4 17.6 L18.4 12.8" stroke="var(--text-2)" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="12.4" cy="17.6" r="1.7" fill="var(--blue)" />
      <circle cx="18.4" cy="12.8" r="1.9" fill="var(--purple)" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="logo">
      <LogoMark />
      <span className="logo__text">
        <span className="logo__name">{brand.name}</span>
        <span className="logo__desc">{brand.descriptor}</span>
      </span>
    </span>
  );
}
