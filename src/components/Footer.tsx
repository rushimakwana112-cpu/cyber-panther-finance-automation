import { brand, moreNav, nav, socials } from "../content/site";
import { href } from "../lib/route";
import { Icon, type IconName } from "./Icon";
import { Logo } from "./Logo";

const socialIcon: Record<(typeof socials)[number]["label"], IconName> = { LinkedIn: "linkedin", GitHub: "github", Email: "mail" };

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <Logo />
          <p className="footer__desc">
            {brand.positioning.join(" · ")}.
          </p>
        </div>
        <nav aria-label="Footer" className="footer__nav">
          {[...nav, ...moreNav].map((item) => (
            <a key={item.id} href={href.page(item.id)}>
              {item.label}
            </a>
          ))}
        </nav>
        {socials.length > 0 && (
          <ul className="footer__social" aria-label="Social links">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target={s.label === "Email" ? undefined : "_blank"} rel="noopener noreferrer" aria-label={s.label}>
                  <Icon name={socialIcon[s.label]} size={18} />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="container footer__base">
        <span>
          © {new Date().getFullYear()} {brand.owner}, {brand.name}. All figures on this website are made up for demonstration.
        </span>
      </div>
    </footer>
  );
}
