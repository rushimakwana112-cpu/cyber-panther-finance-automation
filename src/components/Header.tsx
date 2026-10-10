import { useEffect, useRef, useState } from "react";
import { nav, navAliases } from "../content/site";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

/** Ids of every section that should drive the active nav item. */
const tracked = ["home", ...nav.map((n) => n.id), ...Object.keys(navAliases)];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight whichever section crosses the middle of the viewport.
  useEffect(() => {
    const els = tracked.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(navAliases[e.target.id] ?? e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Close the mobile menu if the viewport grows past the breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <header className={`header ${scrolled || open ? "is-scrolled" : ""}`}>
        <div className="container header__inner">
          <a href="#home" className="header__brand" aria-label="Cyber Panther — back to top">
            <Logo />
          </a>
          <nav className="header__nav" aria-label="Primary">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={active === item.id ? "is-active" : ""}
                aria-current={active === item.id ? "true" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a href="#contact" className="btn btn--ghost btn--sm header__cta">
            Work With Me <Icon name="arrow" size={15} />
          </a>
          <button
            ref={toggle}
            className="header__toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? "close" : "menu"} size={22} />
          </button>
        </div>
      </header>
      {/* Outside <header>: its backdrop-filter would otherwise trap this fixed overlay. */}
      <div id="mobile-nav" className={`mobile-nav ${open ? "is-open" : ""}`} hidden={!open}>
        <nav aria-label="Mobile">
          {nav.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a href="#contact" className="btn btn--primary" onClick={() => setOpen(false)}>
            Work With Me <Icon name="arrow" size={16} />
          </a>
        </nav>
      </div>
    </>
  );
}
