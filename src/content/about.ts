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
    items: [
      "n8n e agentes de IA",
      "Claude API",
      "Power Automate",
      "Playwright (Python) e Chromium",
      "Supabase",
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
      "Manutenção e evolução de dashboards no Looker Studio (audiência, streaming, conversão e mídia paga), com atenção à performance e ao custo. Em uma das otimizações, passei a lógica do dashboard para o SQL e reduzi o custo dele.",
      "Automação de relatórios com Power Automate: 3 relatórios automatizados, com cerca de 6 horas semanais de trabalho manual a menos.",
      "Análise de grandes volumes de dados no BigQuery (GCP) com SQL e Python, integrados ao GA4 (eventos, usuários, sessões e conversões), para entender a jornada do usuário, do anúncio à conversão, e a performance digital.",
      "Participação na migração do GA4 para uma nova propriedade (30+ campos novos) e no redesenho da atribuição de UTMs, ampliando a visibilidade da origem do tráfego e das conversões.",
      "Apoio às equipes de Audiência, Redação e Marketing na tradução de necessidades de negócio em análises e visualizações claras, e colaboração na criação de novas bases, relatórios e painéis estratégicos.",
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

export const courses: { area: string; items: string }[] = [
  { area: "Power BI", items: "Formação Microsoft Power BI Profissional (Udemy) · Power BI Service (EmpowerData)" },
  { area: "SQL e BigQuery", items: "Banco de Dados e SQL para Data Analytics (Udemy) · Google BigQuery para Data Analytics (Udemy)" },
  { area: "Python", items: "Python para Data Analytics e Streamlit (Assimov Academy)" },
  { area: "Analytics e automação", items: "Google Analytics 4 para Análise de Dados (Udemy) · Dominando Power Automate (EmpowerData)" },
  { area: "IA e automação", items: "Claude Code Impressionador · Dominando n8n e Agentes de IA · Supabase Impressionador (HashtagTreinamentos)" },
];
