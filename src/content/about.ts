// Conteúdo da página Sobre, extraído do currículo de Gabriel (versão "Dados, automação e IA").
// Telefone e e-mail do currículo ficam de fora de propósito: são dados pessoais.
export type Experience = {
  company: string;
  role: string;
  period: string;
  // Linha curta em destaque (ex.: segmento atendido).
  scope?: string;
  // Parágrafo de apresentação da atuação.
  intro?: string;
  highlights: string[];
  // Ferramentas usadas nessa atuação.
  tools?: string[];
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

// Duas camadas: o que Gabriel usa hoje e o que já usou. Separação a confirmar por ele.
export const toolGroups: { title: string; hint?: string; items: string[] }[] = [
  {
    title: "Uso no dia a dia",
    items: [
      "Looker Studio",
      "Power BI (DAX, Power Query, RLS)",
      "SQL",
      "BigQuery (GCP)",
      "Python (Pandas, Playwright)",
      "GA4",
      "Power Automate",
      "n8n e agentes de IA",
      "Claude API",
      "Supabase",
    ],
  },
  {
    title: "Já utilizei",
    items: ["VBA", "MySQL", "SQL Server", "PostgreSQL", "Streamlit", "Excel avançado"],
  },
  {
    title: "Como trabalho com dados",
    items: [
      "Modelagem dimensional (Star Schema)",
      "ETL/ELT",
      "KPIs e data storytelling",
      "APIs REST",
    ],
  },
];

export const experience: Experience[] = [
  {
    company: "Grupo RBS",
    role: "Analista de Dados (Assistente de Dados IV)",
    period: "04/2025 – atual",
    intro:
      "Atuo no time de Business Analytics, apoiando Redação, Audiência, Streaming e produtos digitais B2C com dados e análises para decisões estratégicas, da performance do conteúdo à geração e retenção de assinantes.",
    highlights: [
      "Mantenho 4 dashboards completos no Looker Studio (de 5 a 60 páginas), incluindo o principal, de conversão (funis Android, iOS e site; conversões por dia e hora; página de CRO), e o de mídia paga (Google Ads e Meta Ads).",
      "Redesenhei a atribuição de UTMs (canais internos e externos) e participei da migração do GA4 para uma nova propriedade (30+ campos novos). O volume sem canal identificado (“não trackeado”) caiu cerca de 60%.",
      "Automatizei 3 relatórios com Power Automate, eliminando cerca de 6 horas por semana de trabalho manual.",
      "Integrei GA4 e BigQuery (ETL e modelagem dimensional) e estruturei o rastreio da jornada completa do usuário, do anúncio da Meta ao clique no CRO, para Audiência, Redação e Marketing.",
      "Automação de tarefas com Playwright (Python) e Chromium.",
    ],
    tools: [
      "BigQuery",
      "SQL",
      "Python",
      "Looker Studio",
      "GA4",
      "Power Automate",
      "Playwright",
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

// Uma linha só: os cursos apoiam a experiência, não competem com ela.
export const courses =
  "Cursos complementares em Power BI, SQL e BigQuery, Python, GA4, Power Automate, n8n e Supabase.";
