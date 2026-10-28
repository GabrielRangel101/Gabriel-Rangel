import type { StaticImageData } from "next/image";
import atendimentosImage from "@/assets/cases/powerbi-atendimentos.png";
import comprasImage from "@/assets/cases/powerbi-compras.png";
import lojasImage from "@/assets/cases/powerbi-lojas.png";
import projetosImage from "@/assets/cases/powerbi-projetos.png";
import saborImage from "@/assets/cases/sabor-da-casa.png";
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
  {
    slug: "sabor-da-casa",
    title: "Sabor da Casa",
    type: "sistema",
    summary:
      "Sistema web de gestão para restaurante de bairro: pedidos, mesas, entregas, financeiro e clientes, com pedido pelo link público que cai direto no painel.",
    synthetic: true,
    image: saborImage,
  },
  {
    slug: "acompanhamento-de-compras",
    title: "Acompanhamento de Compras",
    type: "power-bi",
    summary:
      "Valor, volume e OTIF das compras, com recortes por comprador, solicitante e fornecedor.",
    synthetic: true,
    image: comprasImage,
  },
  {
    slug: "gestao-de-lojas",
    title: "Gestão de Lojas",
    type: "power-bi",
    summary:
      "Faturamento, lucro, ticket médio e entrega de uma rede de lojas, contra o ano anterior e as metas.",
    synthetic: true,
    image: lojasImage,
  },
  {
    slug: "acompanhamento-de-projetos",
    title: "Acompanhamento de Projetos",
    type: "power-bi",
    summary:
      "Orçamento contra custo real, curva S e gasto por fornecedor, com indicador de consumo.",
    synthetic: true,
    image: projetosImage,
  },
  {
    slug: "acompanhamento-de-atendimentos",
    title: "Acompanhamento de Atendimentos",
    type: "power-bi",
    summary:
      "Tempo de cada etapa de um atendimento de emergência, com destaque para as estações mais lentas.",
    synthetic: true,
    image: atendimentosImage,
  },
];

// O que aparece na Home e em /projetos: apenas cases com página publicada.
export const publishedProjects = projects.filter((p) => hasCase(p.slug));
