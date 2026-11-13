import type { ComponentType, SVGProps } from "react";
import {
  ActivityIcon,
  BarChartIcon,
  DatabaseIcon,
  LayersIcon,
  PieChartIcon,
  SparkIcon,
  WorkflowIcon,
} from "./icons";

// Tipos de case se distinguem por rótulo e ícone, nunca por cor.
export const caseTypes = {
  "power-bi": { label: "Power BI", Icon: BarChartIcon },
  looker: { label: "Looker", Icon: PieChartIcon },
  "web-ia": { label: "Dashboard web", Icon: SparkIcon },
  agente: { label: "Agentes e MCP", Icon: WorkflowIcon },
  sistema: { label: "Sistema", Icon: LayersIcon },
  dados: { label: "Engenharia de dados", Icon: DatabaseIcon },
  experimento: { label: "Estatística aplicada", Icon: ActivityIcon },
} satisfies Record<
  string,
  { label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }
>;

export type CaseType = keyof typeof caseTypes;

const pill =
  "text-caption inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-ink-muted";

export function TypeTag({ type }: { type: CaseType }) {
  const { label, Icon } = caseTypes[type];
  return (
    <span className={pill}>
      <Icon width={12} height={12} />
      {label}
    </span>
  );
}

export function SyntheticBadge({
  label = "Dados sintéticos",
}: {
  label?: string;
}) {
  return (
    <span className={pill}>
      <DatabaseIcon width={12} height={12} />
      {label}
    </span>
  );
}
