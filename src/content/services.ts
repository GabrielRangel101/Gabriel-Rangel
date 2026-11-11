import type { ComponentType, SVGProps } from "react";
import {
  BarChartIcon,
  DatabaseIcon,
  LayersIcon,
  WorkflowIcon,
} from "@/components/ui/icons";

// O que a Rangel Analytics entrega. Cada frente aponta para os projetos do mesmo tipo.
export const services: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  text: string;
  items: string[];
  href: string;
}[] = [
  {
    icon: BarChartIcon,
    title: "Dashboards de BI",
    text: "Painéis que respondem à pergunta do negócio, com os números conferidos contra a fonte.",
    items: [
      "Power BI e Looker Studio",
      "Modelo de dados e medidas (DAX e SQL)",
      "O que cada número significa, explicado no próprio painel",
    ],
    href: "/projetos?tipo=power-bi",
  },
  {
    icon: LayersIcon,
    title: "Sistemas web",
    text: "Sistemas sob medida para trocar planilha por um fluxo que funciona.",
    items: [
      "Agenda, pedidos, comandas, financeiro e o que a sua operação pedir",
      "Perfis de acesso e regras de segurança no banco",
      "Cobrança e integrações por API",
    ],
    href: "/projetos?tipo=sistema",
  },
  {
    icon: WorkflowIcon,
    title: "Automações com n8n e IA",
    text: "Fluxos e agentes de IA que assumem o trabalho repetitivo.",
    items: [
      "Fluxos em n8n e Power Automate",
      "Agentes de IA com acesso controlado aos dados",
      "Alertas e relatórios automáticos",
    ],
    href: "/projetos?tipo=agente",
  },
  {
    icon: DatabaseIcon,
    title: "Dados organizados",
    text: "Uma fonte confiável por trás de cada número.",
    items: [
      "Modelagem estrela e SQL",
      "BigQuery e PostgreSQL",
      "Rotinas para que os números batam entre as áreas",
    ],
    href: "/projetos",
  },
];
