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
      "Painel de assinaturas B2C com uma Mesa de análise em Modo IA que responde sobre os dados do painel.",
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
