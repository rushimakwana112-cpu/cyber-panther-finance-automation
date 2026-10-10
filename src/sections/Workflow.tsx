import { useEffect, useRef, useState } from "react";
import { Code } from "../components/Code";
import { Icon, type IconName } from "../components/Icon";
import { Section } from "../components/Section";
import { useReducedMotion } from "../lib/hooks";
import { stages, toolByKey, tools, type ToolKey } from "../content/tools";

const stageIcon: Record<string, IconName> = {
  source: "database",
  extract: "filter",
  clean: "refresh",
  calculate: "calc",
  report: "report",
};

const stageOfTool = (k: ToolKey) => stages.findIndex((s) => s.tools.includes(k));

/**
 * Automation map — the seven tools placed in the reporting workflow where they do their work.
 * Pick a stage or a tool to see what happens there; "Walk through" steps from source to report.
 */
export function Workflow() {
  const [stageIdx, setStageIdx] = useState(1);
  const [toolKey, setToolKey] = useState<ToolKey | null>("sql");
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const panel = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const stage = stages[stageIdx];
  const tool = toolKey ? toolByKey[toolKey] : null;

  const selectStage = (i: number) => {
    setStageIdx(i);
    setToolKey(stages[i].tools[0] ?? null);
  };
  const selectTool = (k: ToolKey) => {
    setStageIdx(stageOfTool(k));
    setToolKey(k);
  };

  // On narrow screens the detail panel sits below the map — bring it into view after a tap.
  const reveal = () => {
    if (!window.matchMedia("(max-width: 860px)").matches) return;
    requestAnimationFrame(() => panel.current?.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" }));
  };

  const stop = () => {
    window.clearTimeout(timer.current);
    setPlaying(false);
  };

  useEffect(() => {
    if (!playing) return;
    if (stageIdx >= stages.length - 1) {
      timer.current = window.setTimeout(() => setPlaying(false), 1800);
      return;
    }
    timer.current = window.setTimeout(() => selectStage(stageIdx + 1), 2200);
    return () => window.clearTimeout(timer.current);
  }, [playing, stageIdx]);

  return (
    <Section
      id="workflow"
      index="02"
      eyebrow="Tools I know"
      title="Seven tools, one reporting workflow."
      intro="Each tool earns its place somewhere between your raw data and the finished report. Select a stage or a tool to see what it does — or walk through the whole flow."
      className="workflow"
    >
      <div className="wf">
        <div className="wf__top">
          <p className="wf__caption">
            <span className="wf__live" aria-hidden="true" />
            How data moves through a typical automated report
          </p>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => {
              if (playing) return stop();
              selectStage(0);
              setPlaying(true);
            }}
            aria-pressed={playing}
          >
            <Icon name={playing ? "pause" : "play"} size={12} /> {playing ? "Pause" : "Walk through"}
          </button>
        </div>

        <ol className="wf__map" aria-label="Workflow stages">
          {stages.map((s, i) => (
            <li
              key={s.key}
              className={`wf__stage ${i === stageIdx ? "is-current" : ""} ${i < stageIdx ? "is-passed" : ""}`}
            >
              <button
                type="button"
                className="wf__node"
                aria-pressed={i === stageIdx}
                onClick={() => {
                  stop();
                  selectStage(i);
                  reveal();
                }}
              >
                <span className="wf__icon">
                  <Icon name={stageIcon[s.key]} size={18} />
                </span>
                <span className="wf__n num">{s.n}</span>
                <span className="wf__label">{s.label}</span>
              </button>
              {s.tools.length > 0 ? (
                <div className="wf__tools">
                  {s.tools.map((k) => (
                    <button
                      key={k}
                      type="button"
                      className={`chip ${toolKey === k ? "is-active" : ""}`}
                      aria-pressed={toolKey === k}
                      onClick={() => {
                        stop();
                        selectTool(k);
                        reveal();
                      }}
                    >
                      {toolByKey[k].name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="wf__note">Your existing systems, read-only</p>
              )}
              {i < stages.length - 1 && (
                <span className={`wf__link ${i < stageIdx ? "is-lit" : ""} ${i === stageIdx - 1 ? "is-flowing" : ""}`} aria-hidden="true">
                  <i />
                </span>
              )}
            </li>
          ))}
        </ol>

        <div className="wf__panel" aria-live="polite" ref={panel}>
          <div className="wf__stageinfo" key={`stage-${stage.key}`}>
            <p className="wf__kicker num">
              Stage {stage.n} / 0{stages.length}
            </p>
            <h3>{stage.label}</h3>
            <p className="wf__what">{stage.what}</p>
            <div className="wf__io">
              <span>{stage.input}</span>
              <Icon name="arrow" size={14} />
              <span className="wf__out">{stage.output}</span>
            </div>
          </div>

          <div className="wf__tooldetail" key={`tool-${toolKey ?? stage.key}`}>
            {tool ? (
              <>
                <div className="wf__toolhead">
                  <h4>{tool.name}</h4>
                  <span className="muted small">{tool.short}</span>
                </div>
                <p className="wf__finance">{tool.finance}</p>
                <Code code={tool.snippet} lang={tool.lang} label={`${tool.name} example`} />
              </>
            ) : (
              <>
                <div className="wf__toolhead">
                  <h4>Typical sources</h4>
                  <span className="muted small">Read-only — nothing in your system changes.</span>
                </div>
                <ul className="wf__sources">
                  {stage.sources?.map((src) => (
                    <li key={src}>
                      <Icon name="file" size={15} />
                      {src}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <p className="sr-only">
          Tools covered: {tools.map((t) => t.name).join(", ")}.
        </p>
      </div>
    </Section>
  );
}
