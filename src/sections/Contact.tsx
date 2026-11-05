import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "../components/Icon";
import { PageHead } from "../components/PageHead";
import { capabilities } from "../content/capabilities";
import { contactConfig, opportunityTypes } from "../content/site";
import { rovingKey } from "../lib/hooks";

type Path = "opportunity" | "automation";
type Form = { name: string; email: string; company: string; topic: string; message: string; website: string };
type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; dryRun?: boolean } | { kind: "error"; msg: string } | { kind: "unconfigured" };
type FieldErrors = Partial<Record<keyof Form, string>>;

const empty: Form = { name: "", email: "", company: "", topic: "", message: "", website: "" };
const required = ["name", "email", "topic", "message"] as const;
/** Mirrors the server limits in api/contact.ts. */
const maxLen = { name: 100, email: 254, company: 120, message: 5000 } as const;

const paths: Record<Path, { tab: string; prefix: string; intro: string; prompts: string[]; companyLabel: string; topicLabel: string; topicEmpty: string; topics: { id: string; label: string }[]; placeholder: string }> = {
  opportunity: {
    tab: "Professional Opportunities",
    prefix: "Professional opportunity",
    intro: "For recruiters and employers. Tell me about the job and I will reply by email.",
    prompts: ["The job and team", "Location and working hours", "How you would like to talk next"],
    companyLabel: "Company or recruiting firm",
    topicLabel: "Type of work",
    topicEmpty: "Select a type",
    topics: opportunityTypes.map((t) => ({ id: t, label: t })),
    placeholder: "e.g. We are hiring for a finance role and would like to talk about your payroll work…",
  },
  automation: {
    tab: "Discuss an Automation Requirement",
    prefix: "Automation requirement",
    intro: "For businesses. Describe the work you want to improve and I will reply by email.",
    prompts: ["The work and how it is done today", "The files and tools you use", "What you want at the end"],
    companyLabel: "Company",
    topicLabel: "What do you need help with?",
    topicEmpty: "Select an area",
    topics: [...capabilities.map((c) => ({ id: c.id, label: c.title })), { id: "other", label: "Something else" }],
    placeholder: "e.g. We rebuild the same payroll and bank files by hand every month from several workbooks…",
  },
};
const order: Path[] = ["opportunity", "automation"];

function validate(f: Form) {
  const e: FieldErrors = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Please enter a valid email address.";
  if (!f.topic) e.topic = "Please choose one option.";
  if (f.message.trim().length < 20) e.message = "A sentence or two (20+ characters) helps me give a useful reply.";
  return e;
}

function Field(props: { id: string; label: string; required?: boolean; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div className={`field ${props.error ? "has-error" : ""}`}>
      <label htmlFor={`f-${props.id}`}>
        {props.label}
        {props.required && <span aria-hidden="true"> *</span>}
        {props.hint && <span className="field__hint"> ({props.hint})</span>}
      </label>
      {props.children}
      {props.error && (
        <p className="field__error" id={`e-${props.id}`}>
          {props.error}
        </p>
      )}
    </div>
  );
}

export function Contact({ path: pathParam, topic: topicParam }: { path?: string; topic?: string }) {
  const [path, setPath] = useState<Path>(pathParam === "automation" ? "automation" : "opportunity");
  const [form, setForm] = useState<Form>(empty);
  const [touched, setTouched] = useState<Partial<Record<keyof Form, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [copied, setCopied] = useState(false);
  const [serverErrors, setServerErrors] = useState<FieldErrors>({});
  const shownAt = useRef(Date.now());
  const errors = validate(form);
  const p = paths[path];

  // Links such as "Discuss" on a capability open the right path with the area preselected.
  useEffect(() => {
    if (pathParam !== "automation" && pathParam !== "opportunity") return;
    setPath(pathParam);
    if (topicParam && paths[pathParam].topics.some((t) => t.id === topicParam)) setForm((f) => ({ ...f, topic: topicParam }));
  }, [pathParam, topicParam]);

  const choose = (next: Path) => {
    if (next === path) return;
    setPath(next);
    setForm((f) => ({ ...f, topic: "" }));
    setTouched((t) => ({ ...t, topic: false }));
    setServerErrors((se) => ({ ...se, topic: undefined }));
  };

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setServerErrors((se) => (se[k] ? { ...se, [k]: undefined } : se));
    if (status.kind === "error" || status.kind === "unconfigured") setStatus({ kind: "idle" });
  };
  const blur = (k: keyof Form) => () => setTouched((t) => ({ ...t, [k]: true }));
  const err = (k: keyof Form) => serverErrors[k] ?? (touched[k] ? errors[k] : undefined);
  const aria = (k: keyof Form) => ({ "aria-invalid": !!err(k), "aria-describedby": err(k) ? `e-${k}` : undefined });

  const topicLabel = p.topics.find((t) => t.id === form.topic)?.label ?? "";
  const subject = topicLabel ? `${p.prefix}: ${topicLabel}` : p.prefix;
  const plain = `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company || "-"}\nRegarding: ${subject}\n\n${form.message}`;
  const mailto = contactConfig.email ? `mailto:${contactConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plain)}` : "";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, topic: true, message: true });
    const firstBad = required.find((k) => errors[k]);
    if (firstBad) {
      document.getElementById(`f-${firstBad}`)?.focus();
      return;
    }
    if (!contactConfig.endpoint) {
      setStatus({ kind: "unconfigured" });
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch(contactConfig.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim(),
          service: subject,
          budget: "",
          message: form.message.trim(),
          website: form.website, // honeypot: real visitors never see or fill this
          elapsedMs: Date.now() - shownAt.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; fields?: Record<string, string>; dryRun?: boolean };
      if (res.status === 503) {
        setStatus({ kind: "unconfigured" });
        return;
      }
      if (!res.ok) {
        if (data.fields) {
          const { service, ...rest } = data.fields;
          setServerErrors({ ...rest, topic: service });
        }
        throw new Error(data.error || `The server responded with ${res.status}.`);
      }
      setStatus({ kind: "sent", dryRun: data.dryRun });
      setForm(empty);
      setTouched({});
      setServerErrors({});
      shownAt.current = Date.now();
    } catch (error) {
      const offline = error instanceof TypeError; // fetch network failure
      setStatus({ kind: "error", msg: offline ? "The server couldn't be reached." : error instanceof Error ? error.message : "Unknown error." });
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(plain);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the text is still in the form */
    }
  };

  return (
    <>
      <PageHead eyebrow="Contact" title="Let's start a conversation." lead="Choose the path that fits and I will reply by email." />
      <div className="container page-body">
        <div className="cpaths" role="tablist" aria-label="Reason for contacting">
          {order.map((id, i) => (
            <button
              key={id}
              id={`cpath-${id}`}
              role="tab"
              aria-selected={path === id}
              aria-controls="cpanel"
              tabIndex={path === id ? 0 : -1}
              className={path === id ? "is-active" : ""}
              onClick={() => choose(id)}
              onKeyDown={(e) => {
                const to = rovingKey(e, i, order.length);
                if (to === null) return;
                choose(order[to]);
                document.getElementById(`cpath-${order[to]}`)?.focus();
              }}
            >
              {paths[id].tab}
            </button>
          ))}
        </div>

        <div className="contact__grid" id="cpanel" role="tabpanel" aria-labelledby={`cpath-${path}`}>
          <div className="contact__aside">
            <p>{p.intro}</p>
            <p className="contact__k">Helpful to include</p>
            <ul className="contact__prompts">
              {p.prompts.map((t) => (
                <li key={t}>
                  <Icon name="check" size={15} />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {status.kind === "sent" ? (
            <div className="form-result" role="status">
              <Icon name="check" size={22} />
              <h3>{status.dryRun ? "Test submission received." : "Message sent."}</h3>
              <p>{status.dryRun ? "Local test mode: the server accepted the message but did not email it." : "Thanks. Your message was delivered and I will reply by email."}</p>
              <button className="btn btn--ghost btn--sm" onClick={() => setStatus({ kind: "idle" })}>
                Send another message
              </button>
            </div>
          ) : (
            <form className="form" noValidate onSubmit={submit} aria-describedby="form-note">
              <div className="form__row">
                <Field id="name" label="Name" required error={err("name")}>
                  <input id="f-name" autoComplete="name" maxLength={maxLen.name} value={form.name} onChange={set("name")} onBlur={blur("name")} {...aria("name")} />
                </Field>
                <Field id="email" label="Email" required error={err("email")}>
                  <input id="f-email" type="email" autoComplete="email" maxLength={maxLen.email} value={form.email} onChange={set("email")} onBlur={blur("email")} {...aria("email")} />
                </Field>
              </div>
              <div className="form__row">
                <Field id="company" label={p.companyLabel} hint="optional">
                  <input id="f-company" autoComplete="organization" maxLength={maxLen.company} value={form.company} onChange={set("company")} />
                </Field>
                <Field id="topic" label={p.topicLabel} required error={err("topic")}>
                  <select id="f-topic" value={form.topic} onChange={set("topic")} onBlur={blur("topic")} {...aria("topic")}>
                    <option value="">{p.topicEmpty}</option>
                    {p.topics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field id="message" label="Message" required error={err("message")}>
                <textarea id="f-message" rows={6} maxLength={maxLen.message} value={form.message} onChange={set("message")} onBlur={blur("message")} placeholder={p.placeholder} {...aria("message")} />
              </Field>
              <div className="form__submit">
                <button className="btn btn--primary" type="submit" disabled={status.kind === "sending"} aria-busy={status.kind === "sending"}>
                  {status.kind === "sending" ? (
                    <>
                      <span className="spinner" aria-hidden="true" /> Sending…
                    </>
                  ) : (
                    <>
                      Send Message <Icon name="arrow" size={16} />
                    </>
                  )}
                </button>
              </div>
              <div className="hp" aria-hidden="true">
                <label>
                  Website <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} />
                </label>
              </div>
              <div id="form-note" aria-live="polite">
                {status.kind === "error" && (
                  <div className="form-alert form-alert--error" role="alert">
                    <p>
                      <Icon name="alert" size={16} />
                      <span>
                        <strong>Your message was not sent.</strong> {status.msg} Nothing was lost, so please try again in a moment.
                      </span>
                    </p>
                    {mailto && (
                      <div className="form-alert__actions">
                        <a className="btn btn--ghost btn--sm" href={mailto}>
                          <Icon name="mail" size={14} /> Send via email app instead
                        </a>
                      </div>
                    )}
                  </div>
                )}
                {status.kind === "unconfigured" && (
                  <div className="form-alert form-alert--warn" role="alert">
                    <p>
                      <Icon name="alert" size={16} />
                      <span>
                        <strong>Your message was not sent.</strong> Online delivery isn't switched on for this site yet.
                        {mailto ? " You can send it from your email app instead." : " You can copy your message so it isn't lost."}
                      </span>
                    </p>
                    <div className="form-alert__actions">
                      {mailto && (
                        <a className="btn btn--ghost btn--sm" href={mailto}>
                          <Icon name="mail" size={14} /> Send via email app
                        </a>
                      )}
                      <button type="button" className="btn btn--ghost btn--sm" onClick={copy}>
                        <Icon name="copy" size={14} /> {copied ? "Copied" : "Copy message"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
