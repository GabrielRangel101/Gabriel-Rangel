import type { CaseType } from "@/components/ui/Tag";

// Só entram fatos que o PRD sustenta. Textos de Desafio, O que fiz e Resultado vêm na etapa 4.
export type Project = {
  slug: string;
  title: string;
  type: CaseType;
  summary: string;
  synthetic: boolean;
};

export const projects: Project[] = [
  {
    slug: "gazeta-meridiano",
    title: "Gazeta Meridiano",
    type: "web-ia",
    summary:
      "Dashboard de inteligência de assinaturas B2C para um jornal fictício. A IA roteia as perguntas para um motor de métricas próprio, sem calcular números por conta própria.",
    synthetic: true,
  },
  {
    slug: "fluxo-media-compass",
    title: "Fluxo Media Compass",
    type: "web-ia",
    summary:
      "Painel de mídia paga, tracking e aquisição de app, também com Modo IA.",
    synthetic: true,
  },
];
