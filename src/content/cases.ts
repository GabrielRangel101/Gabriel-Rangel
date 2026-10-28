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
  // Lista curta da aba Detalhes Técnicos.
  highlights: string[];
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
    repoUrl: "https://github.com/GabrielRangel101/meridiano-subscriber-compass",
    highlights: [
      "A IA roteia as perguntas de negócio para um motor de métricas próprio, sem calcular números por conta própria",
      "Funil de compra de ponta a ponta, com CAC, LTV e payback por canal",
      "Ponte de MRR e retenção por safra",
      "Risco de cancelamento por assinante",
      "Simulador “e se” e explicação das fórmulas de cada métrica",
    ],
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
  "fluxo-media-compass": {
    description: [
      "Dashboard de mídia paga, aquisição de app e saúde da coleta, feito para a Fluxo, uma fintech fictícia de conta digital e cartão. Serve a quem decide verba de marketing e acompanha tracking.",
      "Mostra como a perda de atribuição de instalações iOS no MMP (AppsFlyer) faz o CPI parecer mais alto do que é, e qual o impacto disso na decisão de verba. Todos os dados são sintéticos, gerados por simulação com seed fixa.",
    ],
    status: "Publicado",
    role: "Projeto autoral",
    repoUrl: "https://github.com/GabrielRangel101/fluxo-media-compass",
    highlights: [
      "Mesa de análise (Modo IA), com o ícone ✦ em cada card",
      "Correção de atribuição no CPI e no CAC, com marcadores de defeito no gráfico",
      "ROAS D90 com intervalo de confiança",
      "Simulador de realocação de verba, com faixa de incerteza",
      "Plano de teste A/B: amostra mínima, SRM e significância",
      "Saúde da coleta e tagbook de eventos",
      "Aba SQL que mostra a consulta de cada número",
    ],
    problem:
      "O MMP perde a atribuição de instalações iOS e o CPI parece mais alto do que é. O dashboard mostra isso e o impacto na decisão de verba.",
    decision:
      "O motor de métricas é puro e testado, e a IA só escolhe a análise e redige o texto. Nenhum número vem de modelo de linguagem, para que cada valor possa ser verificado.",
    result: [
      "Publicado e abrindo ao vivo, com demo automática de cerca de 45 s.",
      "33 testes do motor de métricas passam.",
      "Cada consulta SQL do pacote /sql é comparada por teste com o resultado do motor em TypeScript.",
      "Detecta o defeito de atribuição do Meta iOS a partir de 24/08 e mostra o CPI corrigido ao lado do medido.",
    ],
    stack: [
      "TanStack Start",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "Recharts",
      "shadcn/ui",
      "framer-motion",
      "SQL (SQLite)",
      "Node",
    ],
    demo: {
      embedUrl: "https://fluxo-media-compass.lovable.app/",
      autoUrl: "https://fluxo-media-compass.lovable.app/?demo=1",
      title: "Dashboard Fluxo Media Compass, mídia paga e aquisição de app",
    },
    technical: [
      {
        title: "Arquitetura da Mesa de análise",
        paragraphs: [
          "A pergunta passa por um roteador, que escolhe a análise. O motor de métricas calcula; a IA só redige a resposta com o resultado dele.",
        ],
        code: "pergunta → roteador → motor de métricas → resposta",
      },
      {
        title: "Dados",
        paragraphs: [
          "Uma simulação determinística gera campanhas, gasto, usuários e eventos, com defeitos injetados de propósito: dobro de conversão no Google, evento duplicado, queda no Android e perda de atribuição no iOS.",
        ],
      },
      {
        title: "Correção de atribuição",
        paragraphs: [
          "O início do defeito é o primeiro dia em que ele e os dois dias seguintes passam do limite. As instalações perdidas ajustam o CPI e o CAC.",
        ],
      },
      {
        title: "Simulador de realocação",
        paragraphs: [
          "Usa uma curva de resposta por canal, com intervalo e R². A faixa de cenário é β ± 1,96 vezes o erro-padrão.",
        ],
      },
      {
        title: "Publicação",
        paragraphs: [
          "Publicado pela Lovable, com o código enviado pelo GitHub. Não tem banco de dados nem backend. A demo automática precisa de uma janela de pelo menos 1024 px; Esc interrompe.",
        ],
      },
    ],
  },
  "mercado-aurora": {
    description: [
      "Dashboard de uma rede fictícia de 4 supermercados: onde a margem é ganha e perdida, o que falta na gôndola, quanto se joga fora e o que um alerta avisaria ao gerente.",
      "Mostra onde a margem real escapa da margem bruta (vencimento, avaria, quebra e furto) e quanto de venda se perde por ruptura, com uma fila de alertas ordenada por dinheiro em risco. Os dados são 100% sintéticos, gerados em Python com seed fixa.",
    ],
    status: "Publicado",
    role: "Projeto autoral",
    repoUrl: "https://github.com/GabrielRangel101/mercado-aurora",
    highlights: [
      "Modo IA (Ctrl+K) sobre todos os dados do painel",
      "Ponte da margem em cascata: bruta, vencimento, avaria, quebra, furto e margem real",
      "Sinais ordenados por dinheiro em risco, com responsável",
      "Simulador com ganho líquido e premissas editáveis",
      "Curva ABC e itens de tráfego",
      "Análise de cesta: suporte, confiança e lift",
      "Dimensionamento de caixas por hora",
      "Alertas com precedência de regras e mensagem de WhatsApp de exemplo",
    ],
    problem:
      "Mostrar onde a margem real escapa da margem bruta e quanto de venda se perde por ruptura, e transformar isso em uma fila de alertas por dinheiro em risco.",
    decision:
      "Os dados vêm de uma simulação do estoque de cada SKU em cada loja, dia a dia, em vez de números sorteados. Ruptura e perda nascem da simulação, então os números fecham entre si.",
    result: [
      "Publicado e abrindo ao vivo.",
      "36 casos de teste em 3 arquivos (ask, geral e insights).",
      "Os números fecham entre si: a margem real é a bruta menos a perda, e as lojas somam a rede.",
      "A aba de alertas é a especificação das regras e de uma mensagem de WhatsApp. A automação com n8n ainda não está conectada, e o app avisa isso.",
    ],
    stack: [
      "TanStack Start",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "Recharts",
      "framer-motion",
      "Vitest",
      "Python",
    ],
    demo: {
      embedUrl: "https://mercado-aurora.lovable.app/",
      title: "Dashboard Mercado Aurora, margem, ruptura e perdas",
    },
    technical: [
      {
        title: "Arquitetura do Modo IA",
        paragraphs: [
          "O interpretador transforma a pergunta em uma consulta estruturada (JSON), o cálculo roda sobre as tabelas e a resposta é redigida com o resultado.",
        ],
        code: "pergunta → interpretador → consulta estruturada (JSON) → cálculo sobre as tabelas → resposta",
      },
      {
        title: "Dados",
        paragraphs: [
          "O script scripts/gerar_dados.py simula o estoque, a sazonalidade (Black Friday, Natal, Páscoa e Copa), um fornecedor irregular e uma loja que compra demais. A ruptura nasce de demanda, venda limitada pelo estoque, quebra e reposição.",
        ],
      },
      {
        title: "Textos e testes",
        paragraphs: [
          "Os números das leituras são calculados a partir dos dados, e os testes conferem a coerência: margem real igual à bruta menos a perda, e lojas somando a rede.",
        ],
      },
      {
        title: "Limites declarados",
        paragraphs: [
          "A ruptura fica em cerca de 3% por causa da política de reposição simulada, e os motivos de perda são atribuídos por regra. Os dois pontos estão declarados no README do repositório.",
        ],
      },
      {
        title: "Publicação",
        paragraphs: [
          "Publicado pela Lovable, com o código enviado pelo GitHub. Não tem banco de dados: o front lê um JSON estático de cerca de 950 KB.",
        ],
      },
    ],
  },
};

export const hasCase = (slug: string) => slug in cases;
