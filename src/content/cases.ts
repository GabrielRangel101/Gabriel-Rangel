// Conteúdo dos cases em formato problema → decisão → resultado, mais a camada técnica.
// Só entra o que Gabriel afirmou e consegue sustentar; nada de número inventado.
export type TechnicalSection = {
  title: string;
  paragraphs?: string[];
  list?: string[];
  code?: string;
};

export type CaseStudy = {
  // Texto do início da página, em parágrafos.
  description: string[];
  status: string;
  role: string;
  problem: string;
  decision: string;
  result: string[];
  stack: string[];
  demo: {
    embedUrl: string;
    autoUrl?: string;
    title: string;
  };
  repoUrl?: string;
  technical: TechnicalSection[];
};

export const cases: Record<string, CaseStudy> = {
  "gazeta-meridiano": {
    description: [
      "Dashboard de inteligência de assinaturas B2C para um jornal fictício. A IA roteia as perguntas de negócio para um motor de métricas próprio, sem calcular números por conta própria.",
      "Inclui funil de compra de ponta a ponta, CAC, LTV e payback por canal, ponte de MRR, retenção por safra, risco de cancelamento por assinante, simulador “e se” e a explicação das fórmulas de cada métrica.",
    ],
    status: "Publicado",
    role: "Projeto autoral",
    problem:
      "Mostrar como um gestor de assinaturas B2C decide sem depender de planilhas, deixando explícito o que é dado e o que é premissa.",
    decision:
      "A IA não calcula números. Ela só escolhe a análise certa e redige a resposta a partir de um motor de métricas próprio e testado.",
    result: [
      "Dashboard publicado, com todas as abas e a Mesa de análise testadas no site publicado.",
      "Testes automatizados para o motor de métricas e para os roteadores de perguntas.",
    ],
    stack: ["TanStack Start", "React", "Recharts", "Tailwind", "shadcn/ui"],
    demo: {
      embedUrl: "https://gazetameridiano.app/",
      autoUrl: "https://gazetameridiano.app/?demo=1",
      title: "Dashboard Gazeta Meridiano, inteligência de assinaturas B2C",
    },
    technical: [
      {
        title: "Arquitetura da Mesa de análise",
        paragraphs: [
          "A pergunta de negócio passa por um roteador, que escolhe a análise. O motor de métricas calcula; a IA só redige a resposta com o resultado dele.",
        ],
        code: "pergunta → roteador de perguntas → motor de métricas → resposta redigida pela IA",
      },
      {
        title: "Análises do painel",
        list: [
          "Funil de compra de ponta a ponta",
          "CAC, LTV e payback por canal",
          "Ponte de MRR",
          "Retenção por safra",
          "Risco de cancelamento por assinante",
          "Simulador “e se”",
          "Explicação das fórmulas de cada métrica",
        ],
      },
      {
        title: "Dados",
        paragraphs: [
          "Jornal fictício, com dados 100% sintéticos gerados por simulação determinística: o mesmo ponto de partida gera sempre os mesmos números.",
        ],
      },
      {
        title: "Testes",
        paragraphs: [
          "O motor de métricas e os roteadores de perguntas têm testes automatizados. As abas e a Mesa de análise foram testadas no site publicado.",
        ],
      },
    ],
  },
};

export const hasCase = (slug: string) => slug in cases;
