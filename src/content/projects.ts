import type { StaticImageData } from "next/image";
import peoplelabImage from "@/assets/cases/powerbi-peoplelab.png";
import saleslabImage from "@/assets/cases/powerbi-saleslab.png";
import gestaoBarbeariaImage from "@/assets/cases/barbearia-gestao.png";
import erpPipelineImage from "@/assets/cases/erp-pipeline.png";
import abTestImage from "@/assets/cases/teste-ab-assinaturas.png";
import trechoImage from "@/assets/cases/trecho-logistica.png";
import lookerPedidosImage from "@/assets/cases/looker-pedidos.png";
import saborImage from "@/assets/cases/sabor-da-casa.png";
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
  // Uma linha de resultado, para os cards enxutos da Home.
  headline: string;
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
    headline:
      "MCP próprio com 8 ferramentas somente leitura",
    synthetic: true,
    image: radarImage,
  },
  {
    slug: "gazeta-meridiano",
    title: "Gazeta Meridiano",
    type: "web-ia",
    summary:
      "Dashboard de inteligência de assinaturas B2C para um jornal fictício. A IA roteia as perguntas para um motor de métricas próprio, sem calcular números por conta própria.",
    headline:
      "CAC, LTV e payback por canal, com IA",
    synthetic: true,
    image: gazetaImage,
  },
  {
    slug: "fluxo-media-compass",
    title: "Fluxo Media Compass",
    type: "web-ia",
    summary:
      "Dashboard de mídia paga, aquisição de app e saúde da coleta para uma fintech fictícia. Mostra como a perda de atribuição no iOS distorce o CPI e a decisão de verba.",
    headline:
      "CPI iOS: R$ 10,54 contra R$ 9,03 corrigido",
    synthetic: true,
    image: fluxoImage,
  },
  {
    slug: "mercado-aurora",
    title: "Mercado Aurora",
    type: "web-ia",
    summary:
      "Dashboard de uma rede fictícia de supermercados: onde a margem é ganha e perdida, ruptura, perdas e alertas por dinheiro em risco.",
    headline:
      "Margem de 24,8% contra meta de 25,0%",
    synthetic: true,
    image: auroraImage,
  },
  {
    slug: "sabor-da-casa",
    title: "Sabor da Casa",
    type: "sistema",
    summary:
      "Sistema web de gestão para restaurante de bairro: pedidos, mesas, entregas, financeiro e clientes, com pedido pelo link público que cai direto no painel.",
    headline:
      "15 telas e 71 políticas de segurança",
    synthetic: true,
    image: saborImage,
  },
  {
    slug: "gestao-barbearia",
    title: "Sistema de Gestão para Barbearia",
    type: "sistema",
    summary:
      "Agenda por barbeiro, agendamento online, comandas, comissões, clube de assinatura e cobrança pelo Asaas, com três perfis de acesso e app instalável no celular.",
    headline:
      "53 tabelas com RLS e cobrança no Asaas",
    synthetic: true,
    image: gestaoBarbeariaImage,
  },
  {
    slug: "peoplelab",
    title: "PeopleLab: RH e Turnover",
    type: "power-bi",
    summary:
      "Headcount, turnover, perfil do time e desempenho em quatro páginas, com modelo em estrela, 63 medidas DAX e tooltips em SVG.",
    headline:
      "468 ativos e turnover de 12M de 11,6%",
    synthetic: true,
    image: peoplelabImage,
  },
  {
    slug: "saleslab",
    title: "SalesLab: Vendas B2B",
    type: "power-bi",
    summary:
      "Receita contra meta, funil e desempenho por vendedor, região e produto, com modelo em estrela de 9 tabelas, 64 medidas DAX e tooltips em SVG.",
    headline:
      "R$ 28,79 mi de receita, 99% da meta",
    synthetic: true,
    image: saleslabImage,
  },
  {
    slug: "erp-pipeline-varejo",
    title: "Pipeline de Integração com ERP de Varejo",
    type: "dados",
    summary:
      "Integra o ERP de um supermercado a um data warehouse em estrela, com quarentena e uma conferência que derruba a carga quando a conta não fecha. Código público no GitHub.",
    headline: "1 milhão de itens carregados em 83,48 s",
    synthetic: true,
    image: erpPipelineImage,
  },
  {
    slug: "trecho-logistica",
    title: "Trecho Logística",
    type: "web-ia",
    summary:
      "Inteligência de entregas e frete: dashboard de e-commerce do ponto de vista de uma transportadora, com mapa do Brasil, prazo contra a promessa, margem por rota e um simulador “vale a pena?”. Dados simulados, código público e layout responsivo.",
    headline: "91,8% no prazo contra meta de 95%",
    synthetic: true,
    image: trechoImage,
  },
  {
    slug: "teste-ab-assinaturas",
    title: "Teste A/B e Impacto: Assinaturas",
    type: "experimento",
    summary:
      "Teste A/B de um novo checkout e mensuração de impacto de uma política de retenção por diferenças-em-diferenças, com SRM, CUPED, bootstrap, correção de Holm e 26 testes. Dados sintéticos, código aberto.",
    headline: "+0,82 p.p. de conversão, p = 0,0009",
    synthetic: true,
    image: abTestImage,
  },
  {
    slug: "relatorio-pedidos",
    title: "Relatório de Pedidos: E-commerce",
    type: "looker",
    summary:
      "Receita fechada contra carteira em aberto, produtos, clientes e preço pago contra a tabela, em 6 páginas no Looker Studio sobre views no BigQuery.",
    headline:
      "Receita fechada separada da carteira aberta",
    synthetic: true,
    image: lookerPedidosImage,
  },
];

// Destaques da Home, em ordem: um de cada frente, com PeopleLab entre eles.
export const featuredSlugs = [
  "radar-agenda",
  "gazeta-meridiano",
  "peoplelab",
  "saleslab",
  "sabor-da-casa",
  "gestao-barbearia",
];

// O que aparece na Home e em /projetos: apenas cases com página publicada.
export const publishedProjects = projects.filter((p) => hasCase(p.slug));
