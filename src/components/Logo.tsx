import logoSrc from "../assets/panther-logo.png?inline";
import { brand } from "../content/site";

/** The owner's panther logo. Inlined so it also works in the single-file build. */
export function LogoMark({ size = 38 }: { size?: number }) {
  return <img className="logo__mark" src={logoSrc} alt="" width={size} height={size} />;
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
