import { useEffect, useRef, useState } from "react";
import { Icon } from "../components/Icon";
import { LogoMark } from "../components/Logo";
import { findAnswer, suggestions, type Answer } from "../content/askPanther";

type Msg = { from: "bot" | "me"; text: string; link?: Answer["link"] };

const welcome: Msg = { from: "bot", text: "Hi, I'm Panther. Ask me about Rushi's projects and skills, or what a word on this website means." };

/** Website guide that answers from approved text in the browser. No AI service, no data sent anywhere. */
export function AskPanther() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([welcome]);
  const log = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [msgs, open]);

  useEffect(() => {
    if (!open) return;
    field.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const ask = (q: string) => {
    const text = q.trim();
    if (!text) return;
    const a = findAnswer(text);
    setMsgs((m) => [...m, { from: "me", text }, { from: "bot", text: a.text, link: a.link }]);
    setInput("");
  };

  return (
    <div className="ask">
      {open && (
        <div className="ask__panel" role="dialog" aria-label="Ask Panther">
          <div className="ask__head">
            <LogoMark size={28} />
            <div>
              <strong>Ask Panther</strong>
              <span>Answers from approved information only</span>
            </div>
            <button
              type="button"
              className="ask__close"
              aria-label="Close Ask Panther"
              onClick={() => {
                setOpen(false);
                toggle.current?.focus();
              }}
            >
              <Icon name="close" size={18} />
            </button>
          </div>
          <div className="ask__log" ref={log} aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`ask__msg ask__msg--${m.from}`}>
                {m.text}
                {m.link && (
                  <a href={m.link.href} onClick={() => setOpen(false)}>
                    {m.link.label} →
                  </a>
                )}
              </div>
            ))}
          </div>
          <div className="ask__chips">
            {suggestions.map((s) => (
              <button key={s} type="button" className="chip" onClick={() => ask(s)}>
                {s}
              </button>
            ))}
          </div>
          <form
            className="ask__form"
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
          >
            <label className="sr-only" htmlFor="ask-input">
              Your question
            </label>
            <input ref={field} id="ask-input" value={input} maxLength={200} autoComplete="off" onChange={(e) => setInput(e.target.value)} placeholder="Type your question…" />
            <button className="btn btn--primary btn--sm" type="submit">
              Ask
            </button>
          </form>
          <p className="ask__note">Your questions stay in your browser.</p>
        </div>
      )}
      <button ref={toggle} type="button" className="ask__toggle" aria-expanded={open} aria-label="Ask Panther" onClick={() => setOpen((o) => !o)}>
        <LogoMark size={26} />
        <span className="ask__label">Ask Panther</span>
      </button>
    </div>
  );
}
