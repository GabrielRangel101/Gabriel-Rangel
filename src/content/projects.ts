import type { StaticImageData } from "next/image";
import gazetaImage from "@/assets/cases/gazeta-meridiano.png";
import type { CaseType } from "@/components/ui/Tag";
import { hasCase } from "./cases";

// Só entram fatos que o PRD sustenta. Textos de Desafio, Decisão e Resultado ficam em cases.ts.
export type Project = {
  slug: string;
  title: string;
  type: CaseType;
  summary: string;
  synthetic: boolean;
  image?: StaticImageData;
};

export const projects: Project[] = [
  {
    slug: "gazeta-meridiano",
    title: "Gazeta Meridiano",
    type: "web-ia",
    summary:
      "Dashboard de inteligência de assinaturas B2C para um jornal fictício. A IA roteia as perguntas para um motor de métricas próprio, sem calcular números por conta própria.",
    synthetic: true,
    image: gazetaImage,
  },
  // Sem página de case e sem imagem ainda: não aparece nas listas até ser publicado.
  {
    slug: "fluxo-media-compass",
    title: "Fluxo Media Compass",
    type: "web-ia",
    summary:
      "Painel de mídia paga, tracking e aquisição de app, também com Modo IA.",
    synthetic: true,
  },
];

// O que aparece na Home e em /projetos: apenas cases com página publicada.
export const publishedProjects = projects.filter((p) => hasCase(p.slug));
