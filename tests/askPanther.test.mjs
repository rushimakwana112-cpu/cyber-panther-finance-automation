import assert from "node:assert/strict";
import { test } from "node:test";
import { answers, fallback, findAnswer } from "../src/content/askPanther.ts";

const expected = {
  "hello": "hello",
  "What has Rushi built?": "projects",
  "What is Document Matcher?": "mpr",
  "What is MPR Checker?": "mpr",
  "what is finance operations intelligence": "assistant",
  "what is the payroll ai assistant": "assistant",
  "what is the ai lab": "ai-lab",
  "how does attendance checking work": "mpr",
  "Is payroll data safe?": "safe",
  "What is OCR?": "term-ocr",
  "what is vba": "term-vba",
  "what does power query do": "term-pq",
  "what is ctc": "term-ctc",
  "tds kya hai": "term-tds",
  "How can I contact Rushi?": "contact",
  "We are hiring, is Rushi looking for a job?": "hire",
  "how much do you charge": "price",
  "How much time does it save?": "results",
  "Is this real data?": "fictional",
  "Tell me about the auto payroll dashboard": "auto-payroll",
  "tell me about the chatbot": "assistant",
  "are you ai": "bot",
  "what is synk": "personal",
  "what qualifications does Rushi have": "background",
  "did rushi study at learnbay": "background",
  "which company did rushi work for": "work-history",
  "can i see the cv": "work-history",
  "what is the capital of france": "fallback",
  "": "fallback",
};

for (const [q, id] of Object.entries(expected)) {
  test(`"${q}" gets the ${id} answer`, () => assert.equal(findAnswer(q).id, id));
}

test("keywords do not match inside other words", () => {
  assert.equal(findAnswer("the weather is said to be nice").id, "fallback");
});

test("answers stay within what the public site may say", () => {
  const banned = /POM|BOI|Bank of India|STPI|IGR|Blue Panther|Starlette|government|lockout|audit log|78|₹/;
  for (const a of [...answers, fallback]) assert.doesNotMatch(a.text, banned, a.id);
});

test("every link points to a page on this site", () => {
  for (const a of [...answers, fallback]) if (a.link) assert.match(a.link.href, /^#\/(about|projects|tools|ai-lab|technology|security|personal|contact)(\/[a-z-]+)?$/, a.id);
});
