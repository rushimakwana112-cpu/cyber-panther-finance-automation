import { useEffect, useRef, useState } from "react";
import { moreNav, nav, navParent } from "../content/site";
import { href, type PageId } from "../lib/route";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

export function Header({ page }: { page: PageId }) {
  const current = navParent[page] ?? page;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
          <a
            href={href.page("home")}
            className="header__brand"
            aria-label="Rushi Makwana, Cyber Panther: home"
            onClick={() => {
              setOpen(false);
              if (page === "home") window.scrollTo(0, 0);
            }}
          >
            <Logo />
          </a>
          <nav className="header__nav" aria-label="Primary">
            {nav.map((item) => (
              <a key={item.id} href={href.page(item.id)} className={current === item.id ? "is-active" : ""} aria-current={page === item.id ? "page" : undefined} onClick={() => page === item.id && window.scrollTo(0, 0)}>
                {item.label}
              </a>
            ))}
          </nav>
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
            <a key={item.id} href={href.page(item.id)} aria-current={page === item.id ? "page" : undefined} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <p className="mobile-nav__more">More</p>
          {moreNav.map((item) => (
            <a key={item.id} className="mobile-nav__sub" href={href.page(item.id)} aria-current={page === item.id ? "page" : undefined} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
