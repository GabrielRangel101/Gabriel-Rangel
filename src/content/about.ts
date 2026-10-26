// Conteúdo da página Sobre, extraído do currículo de Gabriel (versão "Dados, automação e IA").
// Telefone e e-mail do currículo ficam de fora de propósito: são dados pessoais.
export type Experience = {
  company: string;
  role: string;
  period: string;
  scope?: string;
  highlights: string[];
};

export const aboutFacts = [
  "Rio de Janeiro, RJ (remoto)",
  "Mais de 3 anos em Business Analytics",
  "Inglês intermediário, leitura técnica avançada",
];

export const aboutBio = [
  "Sou analista de dados com mais de 3 anos em Business Analytics. Trabalho com Looker Studio, Power BI, BigQuery, SQL e Python para transformar dados em painéis que respondem à pergunta do negócio.",
  "Também automatizo o trabalho repetitivo, com Power Automate, n8n e a API do Claude, e atendo clientes do varejo por conta própria desde 06/2023.",
  "Meu jeito de trabalhar é direto e prático: resultado antes de tecnologia, e cada passo explicado sem jargão. Cada projeto deste portfólio tem uma demo que você pode abrir e testar.",
];

export const toolGroups: { title: string; items: string[] }[] = [
  {
    title: "BI e análise",
    items: ["Power BI (DAX, Power Query, RLS)", "Looker Studio", "GA4", "KPIs e data storytelling"],
  },
  { title: "Linguagens", items: ["SQL", "Python (Pandas, NumPy, Streamlit)", "VBA"] },
  {
    title: "Dados e cloud",
    items: ["BigQuery (GCP)", "PostgreSQL", "MySQL", "SQL Server", "ETL/ELT", "Modelagem dimensional (Star Schema)"],
  },
  {
    title: "Automação e IA",
    items: ["n8n e agentes de IA", "Claude API", "Power Automate", "Supabase", "APIs REST"],
  },
];

export const experience: Experience[] = [
  {
    company: "Grupo RBS",
    role: "Analista de Dados (Assistente de Dados IV)",
    period: "04/2025 – atual",
    scope: "Business Analytics: audiência, redação e produtos digitais B2C",
    highlights: [
      "Mantenho 4 dashboards completos no Looker Studio (de 5 a 60 páginas), incluindo o principal, de conversão (funis Android, iOS e site; conversões por dia e hora; página de CRO), e o de mídia paga (Google Ads e Meta Ads).",
      "Migrei o GA4 para uma nova propriedade (30+ campos novos) e redesenhei a atribuição de UTMs, reduzindo em cerca de 60% o volume sem canal identificado.",
      "Automatizei 3 relatórios com Power Automate, eliminando 6 horas por semana de trabalho manual.",
      "Integrei GA4 e BigQuery (ETL e modelagem dimensional) e estruturei o rastreio da jornada completa do usuário, do anúncio da Meta ao clique no CRO.",
      "Otimizei consultas no BigQuery e migrei a lógica de um CASE do Looker Studio para o SQL, reduzindo o tempo da consulta de 3 minutos para 28 segundos.",
    ],
  },
  {
    company: "MRO",
    role: "Assistente de Dados",
    period: "08/2024 – 04/2025",
    highlights: [
      "Entreguei dashboards corporativos em Power BI para TI, Financeiro e RH, com governança e qualidade das informações.",
      "Automatizei rotinas com SQL, VBA e Power Automate, eliminando 10 horas por semana de trabalho manual.",
      "Construí pipelines ETL integrando múltiplas fontes, com qualidade e consistência dos dados.",
      "Defini KPIs de desempenho da operação e mapeei processos, identificando melhorias a partir de análises de dados.",
    ],
  },
  {
    company: "Autônomo",
    role: "Analista de Dados e Automação",
    period: "06/2023 – atual",
    scope: "Varejo · 5 empresas atendidas",
    highlights: [
      "Desenvolvi um relatório em Power BI que sustentou a redução de 30% nos custos e o crescimento de 1,7x no faturamento mensal de um cliente.",
      "Criei uma automação de alerta por e-mail para o ponto crítico de estoque, evitando a falta de itens essenciais e otimizando a reposição.",
      "Construí fluxos em n8n integrando WhatsApp, e-mail e APIs, e apliquei IA (Claude API) à automação e à análise de dados.",
      "Modelei dados com RLS por perfil e Direct Query para relatórios rápidos em tempo real, e documentei cada projeto do tratamento à entrega.",
    ],
  },
];

export const education = {
  degree: "Análise e Desenvolvimento de Sistemas",
  school: "Centro Universitário IBMR",
  status: "conclusão prevista em 12/2026",
};

export const courses: { area: string; items: string }[] = [
  { area: "Power BI", items: "Formação Microsoft Power BI Profissional (Udemy) · Power BI Service (EmpowerData)" },
  { area: "SQL e BigQuery", items: "Banco de Dados e SQL para Data Analytics (Udemy) · Google BigQuery para Data Analytics (Udemy)" },
  { area: "Python", items: "Python para Data Analytics e Streamlit (Assimov Academy)" },
  { area: "Analytics e automação", items: "Google Analytics 4 para Análise de Dados (Udemy) · Dominando Power Automate (EmpowerData)" },
  { area: "IA e automação", items: "Claude Code Impressionador · Dominando n8n e Agentes de IA · Supabase Impressionador (HashtagTreinamentos)" },
];
