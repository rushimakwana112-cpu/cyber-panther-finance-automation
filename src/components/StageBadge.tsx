import { stageInfo, type ProjectStage } from "../content/projects";

/** Says plainly whether something is finished, an early version or a learning project. */
export function StageBadge({ stage }: { stage: ProjectStage }) {
  return (
    <span className={`pstage pstage--${stage}`}>
      <i aria-hidden="true" />
      {stageInfo[stage].label}
    </span>
  );
}

export function StageLegend() {
  const stages: ProjectStage[] = ["in-use", "experiment"];
  return (
    <dl className="pstage-legend" aria-label="What the project labels mean">
      {stages.map((s) => (
        <div key={s}>
          <dt>
            <StageBadge stage={s} />
          </dt>
          <dd>{stageInfo[s].d}</dd>
        </div>
      ))}
    </dl>
  );
}
