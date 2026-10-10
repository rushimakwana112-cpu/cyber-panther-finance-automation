import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "../components/Icon";
import { Section } from "../components/Section";
import { services } from "../content/services";
import { budgets, contactConfig } from "../content/site";
import { SELECT_SERVICE_EVENT } from "../lib/contact";

type Form = { name: string; email: string; company: string; service: string; message: string; budget: string; website: string };
type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; dryRun?: boolean } | { kind: "error"; msg: string } | { kind: "unconfigured" };

const empty: Form = { name: "", email: "", company: "", service: "", message: "", budget: "", website: "" };
const required = ["name", "email", "service", "message"] as const;
/** Mirrors the server limits in api/contact.ts. */
const maxLen = { name: 100, email: 254, company: 120, message: 5000 } as const;
type FieldErrors = Partial<Record<keyof Form, string>>;

function validate(f: Form) {
  const e: Partial<Record<keyof Form, string>> = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Please enter a valid email address.";
  if (!f.service) e.service = "Please choose the service you need.";
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

export function Contact() {
  const [form, setForm] = useState<Form>(empty);
  const [touched, setTouched] = useState<Partial<Record<keyof Form, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [copied, setCopied] = useState(false);
  const [serverErrors, setServerErrors] = useState<FieldErrors>({});
  const shownAt = useRef(Date.now());
  const errors = validate(form);

  // "Discuss This Service" buttons elsewhere on the page preselect the service.
  useEffect(() => {
    const onSelect = (e: Event) => setForm((f) => ({ ...f, service: (e as CustomEvent<string>).detail }));
    window.addEventListener(SELECT_SERVICE_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, onSelect);
  }, []);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setServerErrors((se) => (se[k] ? { ...se, [k]: undefined } : se));
    if (status.kind === "error" || status.kind === "unconfigured") setStatus({ kind: "idle" });
  };
  const blur = (k: keyof Form) => () => setTouched((t) => ({ ...t, [k]: true }));
  const err = (k: keyof Form) => serverErrors[k] ?? (touched[k] ? errors[k] : undefined);
  const aria = (k: keyof Form) => ({ "aria-invalid": !!err(k), "aria-describedby": err(k) ? `e-${k}` : undefined });

  const serviceTitle = services.find((s) => s.id === form.service)?.title ?? "";
  const plain = `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company || "—"}\nService: ${serviceTitle}\nBudget: ${form.budget || "—"}\n\n${form.message}`;
  const mailto = contactConfig.email
    ? `mailto:${contactConfig.email}?subject=${encodeURIComponent(`Enquiry — ${serviceTitle}`)}&body=${encodeURIComponent(plain)}`
    : "";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, service: true, message: true });
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
          service: serviceTitle,
          budget: form.budget,
          message: form.message.trim(),
          website: form.website, // honeypot — real visitors never see or fill this
          elapsedMs: Date.now() - shownAt.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; fields?: FieldErrors; dryRun?: boolean };
      if (res.status === 503) {
        setStatus({ kind: "unconfigured" });
        return;
      }
      if (!res.ok) {
        if (data.fields) setServerErrors(data.fields);
        throw new Error(data.error || `The server responded with ${res.status}.`);
      }
      setStatus({ kind: "sent", dryRun: data.dryRun });
      setForm(empty);
      setTouched({});
      setServerErrors({});
      shownAt.current = Date.now();
    } catch (error) {
      const offline = error instanceof TypeError; // fetch network failure
      setStatus({ kind: "error", msg: offline ? "The server couldn’t be reached." : error instanceof Error ? error.message : "Unknown error." });
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(plain);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the text is still in the form */
    }
  };

  return (
    <Section id="contact" index="07" eyebrow="Contact" title="Let’s fix the report you rebuild every month." className="contact">
      <div className="contact__grid">
        <div className="contact__aside">
          <p>Tell me what you’re working with — the data, the tools and the output you need. I’ll reply with how I’d approach it and an estimate.</p>
          <ol className="contact__steps">
            <li>
              <span className="num">1</span> You describe the problem
            </li>
            <li>
              <span className="num">2</span> I suggest an approach &amp; quote
            </li>
            <li>
              <span className="num">3</span> We agree scope, then I build it
            </li>
          </ol>
        </div>

        {status.kind === "sent" ? (
          <div className="form-result" role="status">
            <Icon name="check" size={22} />
            <h3>{status.dryRun ? "Test submission received." : "Message sent."}</h3>
            <p>
              {status.dryRun
                ? "Local test mode: the server accepted the message but did not email it."
                : "Thanks — your enquiry was delivered. I’ll get back to you by email."}
            </p>
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
              <Field id="company" label="Company" hint="optional">
                <input id="f-company" autoComplete="organization" maxLength={maxLen.company} value={form.company} onChange={set("company")} />
              </Field>
              <Field id="service" label="Service required" required error={err("service")}>
                <select id="f-service" value={form.service} onChange={set("service")} onBlur={blur("service")} {...aria("service")}>
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field id="message" label="Project description" required error={err("message")}>
              <textarea
                id="f-message"
                rows={5}
                maxLength={maxLen.message}
                value={form.message}
                onChange={set("message")}
                onBlur={blur("message")}
                placeholder="e.g. We export invoices from our accounting system every month and rebuild a customer summary in Excel…"
                {...aria("message")}
              />
            </Field>
            <div className="form__row form__row--end">
              <Field id="budget" label="Approximate budget" hint="optional">
                <select id="f-budget" value={form.budget} onChange={set("budget")}>
                  <option value="">Select a range</option>
                  {budgets.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
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
                      <strong>Your message was not sent.</strong> {status.msg} Nothing was lost — please try again in a moment.
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
                      <strong>Your message was not sent.</strong> Online delivery isn’t switched on for this site yet
                      {mailto ? " — you can send it from your email app instead." : " — copy your message and send it by email instead."}
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
    </Section>
  );
}
