import type { ComponentType, SVGProps } from "react";
import {
  BarChartIcon,
  DatabaseIcon,
  LayersIcon,
  WorkflowIcon,
} from "@/components/ui/icons";

// Áreas de atuação, usadas na Home ("O que construo") e em /sobre ("Em que posso ajudar").
export const areas: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  text: string;
}[] = [
  {
    icon: BarChartIcon,
    title: "Dashboards de BI",
    text: "Painéis em Power BI e Looker que respondem à pergunta do negócio.",
  },
  {
    icon: LayersIcon,
    title: "Sistemas web",
    text: "Sistemas sob medida para trocar planilha por um fluxo que funciona.",
  },
  {
    icon: WorkflowIcon,
    title: "Agentes e automações",
    text: "Fluxos em n8n e agentes de IA que assumem o trabalho repetitivo.",
  },
  {
    icon: DatabaseIcon,
    title: "Dados organizados",
    text: "Modelagem e SQL para ter uma fonte confiável por trás de cada número.",
  },
];

// Ferramentas citadas no PRD e nos cases publicados.
export const tools = [
  "Power BI",
  "Looker",
  "SQL",
  "Python",
  "n8n",
  "Supabase",
  "Claude API",
  "React",
];
