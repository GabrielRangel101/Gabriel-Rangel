import type { ComponentType, SVGProps } from "react";
import {
  BarChartIcon,
  DatabaseIcon,
  LayersIcon,
  WorkflowIcon,
} from "@/components/ui/icons";

// Áreas de atuação da Home ("O que construo"). Cada área leva aos projetos do mesmo tipo.
export const areas: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  text: string;
  // Preenchido enquanto a área ainda não tem case publicado neste portfólio.
  note?: string;
  href: string;
}[] = [
  {
    icon: BarChartIcon,
    title: "Dashboards de BI",
    text: "Painéis em Power BI e Looker Studio que respondem a uma pergunta de negócio.",
    href: "/projetos?tipo=power-bi",
  },
  {
    icon: LayersIcon,
    title: "Sistemas web",
    text: "Sistemas web que trocam a planilha por um fluxo que funciona.",
    href: "/projetos?tipo=sistema",
  },
  {
    icon: WorkflowIcon,
    title: "Agentes e automações",
    text: "Fluxos em n8n e agentes de IA que assumem o trabalho repetitivo.",
    href: "/projetos?tipo=sistema",
  },
  {
    icon: DatabaseIcon,
    title: "Dados organizados",
    text: "Modelagem e SQL para ter uma fonte confiável por trás de cada número.",
    href: "/projetos?tipo=dados",
  },
];
