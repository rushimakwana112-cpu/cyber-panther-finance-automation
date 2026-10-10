import { Fragment, type ReactNode } from "react";
import type { CodeLang } from "../content/tools";

const keywords: Record<CodeLang, string[]> = {
  sql: ["SELECT", "FROM", "WHERE", "GROUP", "BY", "ORDER", "AS", "SUM", "COUNT", "JOIN", "LEFT", "INNER", "ON", "AND", "DESC", "ASC", "IN", "BETWEEN", "HAVING"],
  python: ["import", "as", "for", "in", "def", "return", "from"],
  vba: ["For", "Each", "In", "Next", "Sub", "End", "Dim", "As", "If", "Then"],
  m: ["let", "in", "each", "type"],
  excel: ["SUMIFS", "XLOOKUP", "IF"],
  text: [],
};

const TOKEN = /("[^"]*"|'[^']*'|«[^»]*»|--.*$|\/\/.*$|#.*$|\b\d[\d,.]*\b|\b[A-Za-z_]+\b|[=<>+\-*/]+)/gm;

/** Tiny, dependency-free syntax highlighter for the short snippets on the site. */
export function Code({ code, lang, label }: { code: string; lang: CodeLang; label: string }) {
  const kw = keywords[lang];
  const lines = code.split("\n");
  return (
    <pre className="code" aria-label={label} tabIndex={0}>
      <code>
        {lines.map((line, li) => {
          const out: ReactNode[] = [];
          let last = 0;
          for (const m of line.matchAll(TOKEN)) {
            const tok = m[0];
            const at = m.index ?? 0;
            if (at > last) out.push(line.slice(last, at));
            let cls = "";
            if (/^["'«]/.test(tok)) cls = "c-str";
            else if (/^(--|\/\/)/.test(tok) || (tok.startsWith("#") && lang === "python")) cls = "c-cm";
            else if (/^\d/.test(tok)) cls = "c-num";
            else if (kw.includes(tok)) cls = "c-kw";
            else if (/^[=<>+\-*/]+$/.test(tok)) cls = "c-op";
            else if (lang !== "text" && /^[A-Z][a-z]+\.[A-Za-z]/.test(line.slice(at))) cls = "c-fn";
            out.push(
              cls ? (
                <span key={at} className={cls}>
                  {tok}
                </span>
              ) : (
                tok
              ),
            );
            last = at + tok.length;
          }
          if (last < line.length) out.push(line.slice(last));
          return (
            <Fragment key={li}>
              {out}
              {li < lines.length - 1 ? "\n" : ""}
            </Fragment>
          );
        })}
      </code>
    </pre>
  );
}
