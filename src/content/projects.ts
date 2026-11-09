import type { StaticImageData } from "next/image";
import peoplelabImage from "@/assets/cases/powerbi-peoplelab.png";
import saleslabImage from "@/assets/cases/powerbi-saleslab.png";
import gestaoBarbeariaImage from "@/assets/cases/barbearia-gestao.png";
import saborImage from "@/assets/cases/sabor-da-casa.png";
import barbeariaImage from "@/assets/cases/barbearia-painel.png";
import auroraImage from "@/assets/cases/mercado-aurora.png";
import fluxoImage from "@/assets/cases/fluxo-media-compass.png";
import gazetaImage from "@/assets/cases/gazeta-meridiano.png";
import radarImage from "@/assets/cases/radar-agenda.png";
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
    slug: "radar-agenda",
    title: "Radar de Agenda",
    type: "agente",
    summary:
      "Dashboard de uma clínica odontológica fictícia com camada semântica em SQL e um servidor MCP próprio, que deixa o Claude responder perguntas sobre os números com 8 ferramentas fixas e somente leitura.",
    synthetic: true,
    image: radarImage,
  },
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
    slug: "gestao-barbearia",
    title: "Sistema de Gestão para Barbearia",
    type: "sistema",
    summary:
      "Agenda por barbeiro, agendamento online, comandas, comissões, clube de assinatura e cobrança pelo Asaas, com três perfis de acesso e app instalável no celular.",
    synthetic: true,
    image: gestaoBarbeariaImage,
  },
  {
    slug: "painel-barbearia",
    title: "Painel de Performance para Barbearia",
    type: "sistema",
    summary:
      "Painel de metas, ranking e clube de assinaturas por barbeiro, com o fechamento diário, semanal e mensal gerado automaticamente em PowerPoint.",
    synthetic: true,
    image: barbeariaImage,
  },
  {
    slug: "peoplelab",
    title: "PeopleLab: RH e Turnover",
    type: "power-bi",
    summary:
      "Headcount, turnover, perfil do time e desempenho em quatro páginas, com modelo em estrela, 63 medidas DAX e tooltips em SVG.",
    synthetic: true,
    image: peoplelabImage,
  },
  {
    slug: "saleslab",
    title: "SalesLab: Vendas B2B",
    type: "power-bi",
    summary:
      "Receita contra meta, funil e desempenho por vendedor, região e produto, com modelo em estrela de 9 tabelas, 64 medidas DAX e tooltips em SVG.",
    synthetic: true,
    image: saleslabImage,
  },
];

// O que aparece na Home e em /projetos: apenas cases com página publicada.
export const publishedProjects = projects.filter((p) => hasCase(p.slug));
