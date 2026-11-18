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
  "Meu jeito de trabalhar é direto e prático: resultado antes de tecnologia, e cada passo explicado sem jargão. Cada projeto deste portfólio tem uma demo para abrir, e os textos dizem o que ela mostra e o que não prova.",
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
      "Atuo no time de Business Analytics, apoiando a área de Aquisição de assinantes B2C com dados e análises de canais, mídia paga, atribuição e conversão. Antes, apoiei também Redação, Audiência e Streaming.",
    highlights: [
      "**Vendas sem canal identificado (“não trackeado”) de ~40% para ~7% (−83%):** participei, como analista de dados, da migração do GA4 para uma nova propriedade (30+ campos novos) e, com o time, do redesenho da atribuição de UTMs. Validei os dados contra a propriedade anterior, criei novas métricas, atualizei os dashboards e expliquei o funcionamento ao time.",
      "**40 horas por mês a menos de trabalho manual com automação em Python (Playwright e Chromium):** a primeira reúne dados do Looker Studio e do Google Play e envia o resultado em um card no Teams. Outros 3 relatórios automatizados com Power Automate somam cerca de 26 horas por mês.",
      "**4 dashboards completos** que mantenho no Looker Studio (de 5 a 60 páginas): conversão (funis Android, iOS e site, por dia e hora) e mídia paga (Google Ads e Meta Ads).",
      "**Dados de navegação e conversão organizados para análise:** integrei GA4 e BigQuery (ETL e modelagem dimensional) e estruturei o rastreio de navegação e conversão para as áreas de negócio B2C.",
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
      "**Entreguei dashboards corporativos em Power BI** para TI, Financeiro e RH, com governança e qualidade das informações.",
      "**10 horas por semana a menos de trabalho manual:** automatizei rotinas com SQL, VBA e Power Automate.",
      "**Construí pipelines ETL** integrando múltiplas fontes, com qualidade e consistência dos dados.",
      "**Defini KPIs de desempenho da operação** e mapeei processos, identificando melhorias a partir de análises de dados.",
    ],
  },
  {
    company: "Autônomo",
    role: "Analista de Dados e Automação",
    period: "06/2023 – atual",
    scope: "Varejo · 5 empresas atendidas",
    highlights: [
      "**−30% nos custos e 1,7x no faturamento mensal** de um cliente do varejo: desenvolvi o relatório em Power BI que contribuiu para esse resultado.",
      "**Alerta por e-mail do ponto crítico de estoque:** criei a automação, evitando a falta de itens essenciais e otimizando a reposição.",
      "**Fluxos em n8n** integrando WhatsApp, e-mail e APIs, com IA (Claude API) aplicada à automação e à análise de dados.",
      "**RLS por perfil e Direct Query:** modelei dados para relatórios rápidos em tempo real e documentei cada projeto do tratamento à entrega.",
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
