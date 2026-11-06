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
    // Opcionais, para demos que não são apps (ex.: relatório do Power BI).
    openLabel?: string;
    ratio?: string;
    dataLabel?: string;
  };
  repoUrl?: string;
  // Depoimento opcional (só com autorização de quem falou).
  testimonial?: { quote: string; author: string };
  technical: TechnicalSection[];
};

const PB = "https://app.powerbi.com/view?r=";

export const cases: Record<string, CaseStudy> = {
  "radar-agenda": {
    description: [
      "Sistema de gestão de uma clínica odontológica fictícia (agenda, pacientes, orçamentos e financeiro), com uma camada semântica em SQL e um servidor MCP próprio. Em vez de escrever SQL, o Claude responde perguntas sobre agenda, no-show, receita e orçamentos chamando 8 ferramentas fixas e somente leitura.",
      "O dashboard e o MCP leem as mesmas views, então mostram os mesmos números. A demonstração abre o sistema completo em modo visitante, somente leitura. As perguntas ao Claude funcionam pelo MCP, conectado ao Claude; ainda não existe chat dentro do site. Os dados são 100% sintéticos, com padrões plantados para a análise revelar (um dentista com no-show fora da curva, margem em recuperação, dinheiro parado em orçamentos).",
      "Parti de um sistema-base de clínica. O que construí foi a camada de dados, o MCP, a segurança e a demo pública.",
    ],
    status: "Publicado",
    role: "Dados, SQL, MCP e segurança · Rangel Analytics",
    highlights: [
      "Servidor MCP próprio (Cloudflare Worker) com 8 ferramentas fixas, somente leitura e sem SQL livre",
      "Camada semântica no schema bi: views e funções com RLS, sem dados pessoais",
      "Dashboard e MCP leem as mesmas views, com os mesmos números para o mesmo período",
      "Demo pública no sistema completo, em modo visitante: entra sozinha com uma conta somente leitura, sem cadastro",
      "Endpoint do MCP com token, limite de requisições e log sem dados pessoais",
      "Agendamento público que na demo devolve um protocolo simulado e não grava nada",
      "Menu completo para o visitante (Pacientes, Tratamentos, Orçamentos, Financeiro, Relatórios, Equipe), com dados do dono mascarados",
    ],
    problem:
      "Deixar um modelo de IA responder perguntas sobre os dados de uma clínica sem dar a ele acesso livre ao banco e sem recalcular regra de negócio no navegador.",
    decision:
      "A regra de negócio mora no SQL (schema bi) e o MCP expõe só 8 ferramentas fixas, cada uma ligada a uma view ou função. O Worker valida a entrada, a clínica é fixa no servidor e o acesso ao banco usa um usuário somente leitura, sem service role.",
    result: [
      "Nos 12 meses da demo, o Dr. Rafael Menezes tem 18,3% de no-show (200 faltas em 1.092 consultas realizáveis), contra 8,0% a 11,5% dos outros cinco dentistas.",
      "A margem sobe de 9,3% (nov/25) para 21,2% (out/26), com receita de caixa de R$ 113 mil para R$ 164 mil por mês.",
      "70 orçamentos parados há mais de 7 dias somam R$ 234 mil, e 399 pacientes estão na lista de reativação (147 de prioridade alta).",
      "O limitador do MCP foi provado no Worker publicado: em 300 chamadas paralelas, 127 receberam 429.",
      "A revisão de segurança achou e corrigiu uma escalada de privilégio herdada da base, em que qualquer usuário autenticado podia se tornar dono de qualquer clínica.",
      "O Modo IA dentro do próprio dashboard ainda não está implementado; hoje as perguntas ao Claude são feitas pelo MCP.",
    ],
    stack: [
      "Supabase (Postgres)",
      "SQL",
      "TanStack Start",
      "React",
      "TypeScript",
      "Cloudflare Workers",
      "Model Context Protocol",
      "Claude",
      "Tailwind",
    ],
    demo: {
      embedUrl: "https://radar-agenda.lovable.app/",
      title: "Dashboard Radar de Agenda, clínica odontológica",
    },
    technical: [
      {
        title: "Arquitetura",
        paragraphs: [
          "O visitante entra no sistema com uma conta somente leitura, e as telas leem as mesmas views. O MCP roda em um Worker separado, autentica por token e chama views do schema bi com um usuário somente leitura.",
        ],
        code: "Claude → MCP (Worker) → public.bi_* → bi.* (views security_invoker) → Postgres com RLS",
      },
      {
        title: "Segurança",
        paragraphs: [
          "O anônimo só tem 3 políticas de leitura e nenhuma coluna sensível. A conta de visitante da demo é pública de propósito, tem papel somente leitura (inserção, alteração e exclusão são barradas por políticas restritivas) e enxerga só a clínica fictícia, com dono, CNPJ e e-mails mascarados. As funções com privilégio elevado têm search_path vazio, e o usuário do MCP tem papel somente leitura reforçado por políticas restritivas.",
        ],
      },
      {
        title: "Dados",
        paragraphs: [
          "Clínica fictícia com 6 dentistas, 1.600 pacientes e 8.786 consultas em 24 meses, geradas em SQL com semente fixa. A data de hoje da demo é congelada em 31/10/2026, então os números não mudam.",
        ],
      },
      {
        title: "Limites declarados",
        paragraphs: [
          "Orçamentos aprovados não geram recebimento no financeiro, para evitar dupla contagem. A ocupação da agenda parece baixa porque a grade é de 1 hora e vários procedimentos duram 30 minutos. O limitador da Cloudflare é aproximado e por localização.",
        ],
      },
    ],
  },
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
      "Um gestor de assinaturas decide verba por canal com CAC, LTV e payback, vê o risco de cancelamento de cada assinante e testa cenários no simulador “e se”.",
      "Cada métrica tem a fórmula explicada no próprio painel, e o que é dado e o que é premissa fica separado.",
      "O motor de métricas e os roteadores de perguntas têm testes automatizados; as abas e a Mesa de análise foram testadas no site publicado.",
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
      "O painel mostra que o CPI do Meta iOS aparece como R$ 10,54, mas seria cerca de R$ 9,03 com a atribuição corrigida, e o que isso muda na decisão de verba.",
      "90 dias de dados simulados, com 4 defeitos de coleta injetados e detectados e 5 checagens de saúde da coleta em alerta.",
      "33 testes do motor de métricas passam, e cada consulta SQL do pacote /sql é comparada por teste com o resultado do motor em TypeScript.",
      "Publicado, com demo automática de cerca de 45 s.",
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
      "A ponte da margem mostra por que a margem real é 24,8% contra a meta de 25,0%: R$ 1,3 mi perdidos entre vencimento, avaria, quebra e furto.",
      "Rede de 4 lojas com 12 meses de dados simulados: receita de R$ 70,6 mi, ruptura de 3,24% e R$ 924 mil de venda perdida.",
      "Os sinais vêm ordenados por dinheiro em risco, com responsável por cada um (o maior, de R$ 1,5 mi por ano, são itens de tráfego com margem abaixo da média).",
      "36 casos de teste em 3 arquivos conferem que a margem real é a bruta menos a perda e que as lojas somam a rede.",
      "A aba de alertas é a especificação das regras e de uma mensagem de WhatsApp; a automação com n8n ainda não está conectada, e o app avisa isso.",
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
  "sabor-da-casa": {
    description: [
      "Sistema web de gestão para restaurante de bairro: pedidos, mesas, entregas, financeiro, despesas e clientes. Substitui as comandas de papel e os controles soltos.",
      "O cliente pede por um link público e o pedido cai direto no painel, com alerta sonoro. A demonstração abaixo é uma cópia separada, com dados fictícios e outro nome; o sistema em produção atende um restaurante local. Para testar o pedido do cliente, abra /cliente em outra aba e acompanhe o pedido em /demo/pedidos.",
    ],
    status: "Em produção, com demo pública",
    role: "Projeto autoral, entregue a cliente real",
    highlights: [
      "Pedidos em quadro, de novo a entregue, com alerta para pedidos parados",
      "Mesas e comandas: abertura, itens e fechamento da conta",
      "Cardápio com categorias, adicionais e custo por produto",
      "Entregas com atribuição de pedidos e tela do motoboy no celular",
      "Financeiro e despesas, com contas fixas e variáveis",
      "Resumo da semana em linguagem simples, com PDF e envio por link do WhatsApp",
      "Pedido pelo link público, ligado ao painel do restaurante",
    ],
    problem:
      "Antes do sistema, as vendas eram anotadas à mão em comandas de papel, com controles soltos de despesas e clientes.",
    decision:
      "Usei o Supabase com regras de segurança por empresa e por perfil. O cliente do link público só consegue criar e consultar o próprio pedido, sem ler as tabelas do restaurante, e gatilhos no banco impedem alterar uma comanda fechada.",
    result: [
      "Um painel de 15 telas no lugar da comanda de papel: pedidos, mesas, cardápio, entregas, clientes, financeiro, despesas e relatórios, mais o pedido público, o status do pedido e o QR de mesa.",
      "20 tabelas e 16 migrações de banco, com 71 políticas de segurança e 7 perfis de acesso: super_admin, admin, garçom, cozinha, entregador, caixa e demo.",
      "A demo pública tem 12 telas, e o fluxo do cliente até o painel funciona em tempo real entre duas abas do navegador.",
    ],
    stack: [
      "React 19",
      "TanStack Start",
      "TypeScript",
      "Tailwind",
      "shadcn/ui",
      "Recharts",
      "Supabase",
      "Cloudflare Workers",
    ],
    demo: {
      embedUrl: "https://sabor-da-casa-demo.srrangel447.workers.dev/demo/dashboard",
      title: "Demo do sistema Sabor da Casa, gestão de restaurante",
      openLabel: "Abrir demo ao vivo",
      dataLabel: "Dados fictícios",
    },
    technical: [
      {
        title: "Modelagem dos dados",
        paragraphs: [
          "O sistema é multiempresa: todas as tabelas se ligam a uma empresa. Pedido, item, comanda e entrada financeira são registros separados, e o telefone do cliente é único por empresa.",
        ],
      },
      {
        title: "Fluxo de um pedido",
        paragraphs: [
          "O pedido nasce no link público ou no salão e passa pelas etapas até o caixa. Quando vem do link, ele vira um registro do sistema com origem “site”, sem depender do WhatsApp.",
        ],
        code: "cliente (link) → pedido no painel → preparo → pronto → saiu → entregue → caixa",
      },
      {
        title: "Regras de negócio",
        paragraphs: [
          "Comanda fechada não pode ser editada nem apagada, então o histórico financeiro não muda depois. Pedido cancelado fica fora do dashboard e do financeiro.",
        ],
      },
      {
        title: "Segurança e permissões",
        paragraphs: [
          "As tabelas têm regras por empresa e por perfil (RLS). O visitante anônimo não acessa as tabelas diretamente: ele usa só funções específicas para criar e consultar o próprio pedido.",
        ],
      },
      {
        title: "Como a demo funciona",
        paragraphs: [
          "A demo não usa banco nem login. Os dados ficam em arquivo e no armazenamento local do navegador, e o painel se sincroniza com a tela do cliente por um evento do navegador. O código do sistema fica em repositório privado.",
        ],
      },
      {
        title: "Limites",
        paragraphs: [
          "Ainda não há aviso automático por WhatsApp, integração com impressora ou meios de pagamento, nem testes automatizados. O custo por produto guarda só o valor atual, sem histórico. O item AI Growth do menu da demo é apenas visual.",
        ],
      },
    ],
  },
  "painel-barbearia": {
    description: [
      "Painel de performance para uma barbearia local: metas, faturamento, ranking e clube de assinaturas por barbeiro, com o fechamento diário, semanal e mensal gerado automaticamente em PowerPoint.",
      "O relatório sai pronto da tela, com resultado e meta, cadeiras, ranking, vendas, clube, cultura, destaques e alertas. A demonstração abaixo é uma cópia separada, com dados fictícios e outro nome; o sistema em uso atende uma barbearia local. Para ver o relatório, entre como dono e abra Relatórios.",
    ],
    status: "Em uso, com demo pública",
    role: "Projeto autoral, em uso por uma barbearia local",
    highlights: [
      "Fechamento em PowerPoint em um clique, diário, semanal ou mensal, com gráficos nativos e editáveis",
      "Meta do dia e do mês, com projeção de fechamento e faixa provável",
      "Meta de cada barbeiro pelo histórico dos mesmos dias da semana, mais 5%",
      "Ranking por faturamento, vendas, produtos e clube",
      "Clube de assinaturas com divisão do pote por participação",
      "Visão do barbeiro no celular, só com a própria cadeira",
      "Módulo de cultura, com pontos por ocorrência e campanhas",
    ],
    problem:
      "A barbearia só tinha um dashboard com faturamento e total de cortes. Os fechamentos diário, semanal e mensal eram feitos à mão, e o dono não via o desempenho de cada barbeiro.",
    decision:
      "Montei um painel com acesso por perfil: o dono vê o resultado da barbearia e cada barbeiro vê a própria cadeira. O fechamento em PowerPoint é gerado no navegador a partir dos mesmos números da tela, então a reunião usa o mesmo dado que o painel mostra.",
    result: [
      "O fechamento diário, semanal e mensal sai pronto em PowerPoint, direto do painel, no lugar da montagem manual.",
      "11 telas (10 do dono e 3 do barbeiro, com Ranking e Cultura em comum), sobre 13 tabelas, 10 scripts SQL numerados, 15 políticas de segurança nos scripts e 2 perfis de acesso: admin e pro.",
      "Os dados se atualizam de hora em hora, de segunda a sábado, a partir do sistema de gestão que a barbearia já usa.",
    ],
    stack: [
      "HTML, CSS e JavaScript",
      "Supabase (Postgres, Auth, RLS)",
      "PptxGenJS",
      "Chart.js",
      "Python",
      "GitHub Actions",
      "Vercel",
    ],
    demo: {
      embedUrl: "/demos/barbearia/index.html",
      autoUrl: "/videos/barbearia-painel-demo.mp4",
      title: "Demo do painel de performance de uma barbearia",
      openLabel: "Abrir demo ao vivo",
      dataLabel: "Dados fictícios",
    },
    technical: [
      {
        title: "Relatório em PowerPoint",
        paragraphs: [
          "O arquivo é gerado no navegador com PptxGenJS, a partir dos mesmos dados que o painel já carregou. Os gráficos são objetos nativos do PowerPoint, editáveis, e não imagens. Há três modos, diário, semanal e mensal, e a cadeira do dono fica fora da apresentação dos barbeiros.",
        ],
      },
      {
        title: "Regras de negócio",
        paragraphs: [
          "O pote do clube é 45% das assinaturas, dividido por fichas: corte e barba valem 1, raspar na máquina 0,75 e pezinho 0,25, editáveis em tabela. A meta do dia é o que falta para a meta do mês dividido pelos dias de funcionamento restantes, e a projeção considera a folga de cada barbeiro e os dias fechados.",
        ],
      },
      {
        title: "Segurança e permissões",
        paragraphs: [
          "Todas as tabelas têm RLS. Quem não tem perfil ativo não lê dados; só o administrador escreve em metas, equipe e cultura, e o barbeiro lê apenas as próprias ocorrências de cultura. O site usa só a chave publicável do Supabase.",
        ],
      },
      {
        title: "Como a demo funciona",
        paragraphs: [
          "A demo não usa banco nem servidor. Os dados fictícios ficam em arquivos, o relógio é fixado em 09/10/2026 e as alterações valem só na memória do navegador. O código do sistema fica em repositório privado.",
        ],
      },
      {
        title: "Limites",
        paragraphs: [
          "Não há agenda, aviso por WhatsApp, pagamento online, app mobile nem testes automatizados com verificações. A exportação para Google Slides depende de um Client ID do Google e ainda não foi validada em produção. A carga dos dados depende do sistema de gestão da barbearia e pode precisar de ajuste se ele mudar.",
        ],
      },
    ],
  },
  peoplelab: {
    description: [
      "Dashboard de pessoas e turnover feito do zero no Power BI Desktop. Mostra headcount, turnover, perfil do time e desempenho em quatro páginas, com menu lateral, filtro de ano sincronizado e tooltips personalizados que abrem ao passar o mouse.",
      "Todos os dados são sintéticos, gerados em Python para a demonstração: 640 funcionários, dos quais 468 estavam ativos em 31/10/2026, em 8 departamentos.",
    ],
    status: "Publicado",
    role: "Relatório em Power BI, do modelo de dados ao layout",
    highlights: [
      "Headcount, turnover dos últimos 12 meses, salário médio e admissões, cada um com a variação contra o mês e o ano anteriores",
      "Evolução do headcount mês a mês desde 2019",
      "Desligamentos por motivo, separados em voluntários e não voluntários",
      "Departamentos lado a lado, com headcount, salário médio, nota e turnover",
      "Texto de insight que muda conforme o período filtrado",
      "Quatro páginas: Visão Geral, Turnover, Pessoas e Desempenho",
    ],
    problem:
      "Responder, para uma área de RH, quantas pessoas estão ativas, como o time cresceu desde 2019, qual departamento perde mais gente e por quê.",
    decision:
      "Montei um modelo em estrela e calculei as medidas “em um ponto no tempo”, para que headcount e turnover mudem conforme o período filtrado. O layout é próprio, com menu lateral, cartões e tooltips com gráficos.",
    result: [
      "A Visão Geral mostra 468 pessoas ativas (25,1% acima do ano anterior), turnover de 11,6% nos últimos 12 meses e 143 admissões no período.",
      "Atendimento lidera o turnover dos últimos 12 meses, com 20,0%. Entre os motivos de desligamento, proposta externa (38) e remuneração (37) pesam mais.",
      "O relatório responde também como o time se distribui por departamento, contrato, faixa etária, gênero e unidade, e como notas de desempenho e engajamento variam por departamento e nível.",
    ],
    stack: ["Power BI", "DAX", "Modelagem de dados", "Python"],
    demo: {
      embedUrl:
        PB +
        "eyJrIjoiM2VhOWMzNjMtNGIxOC00NGM1LWI0YjYtYTUwYzYwNjQ1N2ZlIiwidCI6IjY1OWNlMmI4LTA3MTQtNDE5OC04YzM4LWRjOWI2MGFhYmI1NyJ9",
      title: "Relatório Power BI de RH e turnover, PeopleLab",
      openLabel: "Abrir relatório ao vivo",
      ratio: "16 / 9",
      dataLabel: "Dados sintéticos",
    },
    technical: [
      {
        title: "Modelo de dados",
        paragraphs: [
          "Modelo em estrela com 5 tabelas: Funcionários, Departamentos, Movimentações, Avaliações e Calendário.",
        ],
      },
      {
        title: "Medidas DAX",
        paragraphs: [
          "São 63 medidas, calculadas em um ponto no tempo: o headcount e o turnover mudam conforme o período filtrado, em vez de depender de uma coluna fixa.",
        ],
      },
      {
        title: "Tooltips e layout",
        paragraphs: [
          "Os tooltips têm gráficos desenhados em SVG, gerados por medidas DAX. O layout é próprio, com fundo, menu lateral, cartões e insights dinâmicos.",
        ],
      },
      {
        title: "Dados sintéticos",
        paragraphs: [
          "Os dados foram gerados em Python: 640 funcionários e 8 departamentos, com movimentações e avaliações desde 2019. Não há dado real de pessoa ou empresa.",
        ],
      },
      {
        title: "Publicação",
        paragraphs: [
          "O relatório está publicado na web pelo Power BI e embutido nesta página. O código e o dicionário de medidas ainda não estão em repositório público.",
        ],
      },
    ],
  },
  "acompanhamento-de-compras": {
    description: [
      "Painel de acompanhamento de compras: valor total, volume de pedidos e o OTIF (On-Time In-Full), o indicador de eficiência da cadeia de suprimentos.",
      "Mostra as compras dentro e fora do prazo, as canceladas, a evolução mensal e o peso de cada comprador, solicitante e fornecedor. Os dados do relatório são de exemplo.",
    ],
    status: "Publicado",
    role: "Relatório em Power BI",
    highlights: [
      "Valor total de compras e total de pedidos",
      "OTIF para acompanhar a eficiência da cadeia de suprimentos",
      "Compras dentro do prazo, fora do prazo e canceladas",
      "Compras por comprador, por solicitante e por fornecedor",
      "Evolução mensal de valor e de quantidade",
    ],
    problem:
      "Dar à área de compras uma visão única do que foi comprado, do que chegou no prazo e do que foi cancelado.",
    decision:
      "Reuni valor, volume e OTIF em uma única página, com recortes por comprador, solicitante e fornecedor e botões para ver só as compras concluídas ou só as canceladas.",
    result: [
      "No conjunto de dados de exemplo, o painel mostra 559 compras e R$ 10,1 mi em valor total, com OTIF de 60%: 336 compras dentro do prazo, 138 fora e 85 canceladas.",
      "A evolução mensal do OTIF separa o que chegou dentro e fora do prazo.",
      "Mostra quanto cada solicitante e cada fornecedor representa em volume e em valor.",
    ],
    stack: ["Power BI"],
    demo: {
      embedUrl: PB + "eyJrIjoiOWEzZjc3ZWYtN2ZhZC00MjhiLTllNjUtYzJjOTE1NmUzOGYwIiwidCI6ImZiMjNhNmMwLTY1ZTItNGQxYi1hZDY2LWE4ZWQ1MzMzZjlkZCJ9",
      title: "Relatório Power BI de acompanhamento de compras",
      openLabel: "Abrir relatório ao vivo",
      ratio: "16 / 9",
      dataLabel: "Dados de exemplo",
    },
    technical: [
      {
        title: "Como o relatório está organizado",
        paragraphs: [
          "Uma página com seis indicadores no topo, gráficos por comprador, solicitante, mês e fornecedor, e a linha do OTIF ao longo do ano.",
        ],
      },
      {
        title: "Publicação",
        paragraphs: [
          "O relatório está publicado na web pelo Power BI e aparece aqui incorporado. Os dados são de exemplo.",
        ],
      },
    ],
  },
  "gestao-de-lojas": {
    description: [
      "Painel de gestão de uma rede de lojas: faturamento e lucro total e mensal, com comparativos contra o ano anterior e a semana, e metas de ticket médio e de tempo de entrega.",
      "Mostra os produtos mais vendidos, a margem de lucro, o faturamento e o lucro por categoria e o desempenho de cada filial. Os dados do relatório são de exemplo.",
    ],
    status: "Publicado",
    role: "Relatório em Power BI",
    highlights: [
      "Faturamento e lucro total e mensal, com comparativo anual e semanal",
      "Ticket médio e tempo médio de entrega contra a meta",
      "Produtos mais vendidos e margem de lucro",
      "Faturamento, margem e tempo de entrega por filial",
      "Filtros por ano e por mês",
    ],
    problem:
      "Acompanhar faturamento, lucro e entrega de uma rede de lojas, comparando com o ano anterior e com as metas.",
    decision:
      "Montei cartões com a variação contra o ano anterior e a meta, gráficos de faturamento e lucro por mês e por dia da semana, e comparativos por filial, com filtros de ano e de mês.",
    result: [
      "O painel compara faturamento e lucro com o ano anterior e mostra o ticket médio (meta de R$ 2.000) e o tempo médio de entrega (meta de até 2 dias).",
      "Mostra os 5 produtos mais vendidos com a margem de lucro e a margem de cada filial.",
      "Permite filtrar por ano e por mês e ver faturamento e lucro por categoria e por produto.",
    ],
    stack: ["Power BI"],
    demo: {
      embedUrl: PB + "eyJrIjoiYjM4YjlkNWMtNGQ3NC00ZjhjLWJlZGQtNzMyOTUzZDYxZTcyIiwidCI6ImZiMjNhNmMwLTY1ZTItNGQxYi1hZDY2LWE4ZWQ1MzMzZjlkZCJ9",
      title: "Relatório Power BI de gestão de lojas",
      openLabel: "Abrir relatório ao vivo",
      ratio: "16 / 9",
      dataLabel: "Dados de exemplo",
    },
    technical: [
      {
        title: "Como o relatório está organizado",
        paragraphs: [
          "Cartões de indicadores à esquerda, gráficos de evolução e de produtos no centro e comparativos por filial à direita, com os filtros de ano e mês no topo.",
        ],
      },
      {
        title: "Publicação",
        paragraphs: [
          "O relatório está publicado na web pelo Power BI e aparece aqui incorporado. Os dados são de exemplo.",
        ],
      },
    ],
  },
  "acompanhamento-de-projetos": {
    description: [
      "Painel de acompanhamento de projetos: orçamento, custo real e um indicador de consumo que mostra o percentual do orçamento já usado.",
      "Mostra o acumulado dos custos ao longo do tempo e os valores gastos com cada fornecedor. Os dados do relatório são de exemplo.",
    ],
    status: "Publicado",
    role: "Relatório em Power BI",
    highlights: [
      "Orçamento, custo real e horas trabalhadas por projeto",
      "Indicador de consumo do orçamento",
      "Real contra orçado por mês",
      "Curva S com custo e orçamento acumulados",
      "Gasto por fornecedor e por classificação",
    ],
    problem:
      "Saber se cada projeto está dentro do orçamento e quanto do orçamento já foi consumido.",
    decision:
      "Criei um indicador de consumo do orçamento, o comparativo mensal entre real e orçado, a curva S acumulada e a divisão dos gastos por fornecedor e por tipo (serviço e material), com seleção por projeto.",
    result: [
      "No projeto de exemplo, o painel sinaliza “Acima do Orçamento”: R$ 744 mil gastos contra R$ 620 mil orçados, com 120% de consumo.",
      "A curva S compara o custo acumulado com o orçamento acumulado mês a mês.",
      "Mostra quanto do gasto foi com cada fornecedor e quanto foi serviço ou material.",
    ],
    stack: ["Power BI"],
    demo: {
      embedUrl: PB + "eyJrIjoiMzAwNGUxNmItY2NjMS00M2Q1LTg2M2YtM2Q4MjJkMTIwNGQyIiwidCI6ImZiMjNhNmMwLTY1ZTItNGQxYi1hZDY2LWE4ZWQ1MzMzZjlkZCJ9",
      title: "Relatório Power BI de acompanhamento de projetos",
      openLabel: "Abrir relatório ao vivo",
      ratio: "16 / 9",
      dataLabel: "Dados de exemplo",
    },
    technical: [
      {
        title: "Como o relatório está organizado",
        paragraphs: [
          "Cartões de orçamento, valor real e horas à esquerda, a tabela com os dados do projeto no topo e gráficos de real contra orçado, curva S e fornecedores.",
        ],
      },
      {
        title: "Publicação",
        paragraphs: [
          "O relatório está publicado na web pelo Power BI e aparece aqui incorporado. Os dados são de exemplo.",
        ],
      },
    ],
  },
  "acompanhamento-de-atendimentos": {
    description: [
      "Painel de acompanhamento de atendimentos de emergência: o tempo médio de operação, da saída da ambulância até a chegada ao hospital.",
      "Mostra os protocolos de atendimento mais usados e o desempenho geral da equipe, por estação, por faixa de idade e por período. Os dados do relatório são de exemplo.",
    ],
    status: "Publicado",
    role: "Relatório em Power BI",
    highlights: [
      "Tempo médio de operação e total de atendimentos",
      "Tempo por etapa: ambulância, residência do paciente e hospital",
      "Tabela por estação com destaque para as respostas mais lentas",
      "Atendimentos por faixa de idade e por período com média móvel",
      "Filtros por mês e por protocolo",
    ],
    problem:
      "Acompanhar o tempo de uma operação de emergência, da saída da ambulância à chegada ao hospital.",
    decision:
      "Dividi o tempo em três etapas (saída da ambulância, estação até a residência e residência até o hospital) e criei uma tabela por estação que destaca as que respondem mais devagar.",
    result: [
      "O painel mostra o tempo de cada etapa e destaca em rosa as estações com resposta mais lenta.",
      "Mostra os atendimentos por faixa de idade e por período, com média móvel de 7 dias.",
      "Permite filtrar por mês e por protocolo de atendimento.",
    ],
    stack: ["Power BI"],
    demo: {
      embedUrl: PB + "eyJrIjoiMDRlYjhmYmQtOWRmYi00ZmI4LWI4NzQtZjI3ZWI0YzEyZGI1IiwidCI6ImZiMjNhNmMwLTY1ZTItNGQxYi1hZDY2LWE4ZWQ1MzMzZjlkZCJ9",
      title: "Relatório Power BI de acompanhamento de atendimentos",
      openLabel: "Abrir relatório ao vivo",
      ratio: "16 / 9",
      dataLabel: "Dados de exemplo",
    },
    technical: [
      {
        title: "Como o relatório está organizado",
        paragraphs: [
          "O relatório tem 2 páginas. A primeira reúne o total de atendimentos, a tabela por estação, o tempo por etapa e os gráficos por idade e por período.",
        ],
      },
      {
        title: "Publicação",
        paragraphs: [
          "O relatório está publicado na web pelo Power BI e aparece aqui incorporado. Os dados são de exemplo.",
        ],
      },
    ],
  },
};

export const hasCase = (slug: string) => slug in cases;
