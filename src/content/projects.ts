import type { StaticImageData } from "next/image";
import auroraImage from "@/assets/cases/mercado-aurora.png";
import fluxoImage from "@/assets/cases/fluxo-media-compass.png";
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
  {
    slug: "fluxo-media-compass",
    title: "Fluxo Media Compass",
    type: "web-ia",
    summary:
      "Dashboard de mídia paga, aquisição de app e saúde da coleta para uma fintech fictícia. Mostra como a perda de atribuição no iOS distorce o CPI e a decisão de verba.",
    synthetic: true,
    image: fluxoImage,
  },
  {
    slug: "mercado-aurora",
    title: "Mercado Aurora",
    type: "web-ia",
    summary:
      "Dashboard de uma rede fictícia de supermercados: onde a margem é ganha e perdida, ruptura, perdas e alertas por dinheiro em risco.",
    synthetic: true,
    image: auroraImage,
  },
];

// O que aparece na Home e em /projetos: apenas cases com página publicada.
export const publishedProjects = projects.filter((p) => hasCase(p.slug));
