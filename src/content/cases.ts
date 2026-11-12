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
  // Tipo de dado do exemplo (sintético, fictício...) e período que ele cobre; o período só entra quando se sabe.
  dataKind: string;
  period?: string;
  // Título do bloco de resultados e, quando houver, o impacto medido de verdade em um cliente.
  resultLabel: string;
  impact?: string[];
  // Nota do bloco de impacto quando o texto padrão não cabe (ex.: medições de engenharia).
  impactNote?: string;
  role: string;
  // Lista curta da aba Detalhes Técnicos.
  highlights: string[];
  problem: string;
  decision: string;
  result: string[];
  stack: string[];
  // Projetos sem tela (ex.: pipeline de dados) não têm demo embutida; mostram um diagrama no lugar.
  demo?: {
    embedUrl: string;
    autoUrl?: string;
    // Botões extras ao lado do principal (ex.: versão para celular).
    links?: { label: string; href: string }[];
    title: string;
    // Opcionais, para demos que não são apps (ex.: relatório do Power BI).
    openLabel?: string;
    ratio?: string;
    dataLabel?: string;
  };
  diagram?: { src: string; alt: string };
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
    dataKind: "Sintético",
    period: "nov/2025 a out/2026",
    resultLabel: "Insight do dado de exemplo",
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
        title: "Exemplo de uso do MCP",
        paragraphs: [
          "O endpoint do MCP exige token, então o visitante não consegue chamá-lo daqui. Estas são respostas reais do servidor, obtidas por chamadas feitas pelo Claude com o MCP conectado, no período da demo (01/11/2025 a 31/10/2026). Os nomes são fictícios.",
        ],
        code: `Pergunta: qual dentista tem o no-show fora da curva?
Ferramenta: no_show_por_profissional(data_inicio: 2025-11-01, data_fim: 2026-10-31)
Resposta: Dr. Rafael Menezes, 18,3% (200 faltas em 1.092 consultas realizáveis,
          R$ 41.550 de receita perdida). Os outros cinco ficam entre 8,0% e 11,5%.

Pergunta: como a margem evoluiu?
Ferramenta: resultado_mensal(meses: 12)
Resposta: de 9,3% em nov/2025 para 21,2% em out/2026.

Pergunta: quanto dinheiro está parado em orçamentos?
Ferramenta: orcamentos_parados()
Resposta: 70 orçamentos há mais de 7 dias sem resposta, somando R$ 234.255.`,
      },
      {
        title: "Da tela da demo à ferramenta do MCP",
        paragraphs: [
          "O MCP não tem tela: quem o usa é o Claude. O que o visitante vê na demo são os mesmos números, porque o painel e o servidor leem as mesmas views. A tela AI Growth da demo não usa modelo de linguagem: é uma lista calculada por regras no SQL (90 dias sem retorno, orçamento pendente há mais de 7 dias, tratamento sem atividade há mais de 90 dias). Cada card tem uma ferramenta correspondente, e os valores são os mesmos nos dois lados:",
        ],
        list: [
          "Card “Pacientes para reativar” (399, sendo 147 de prioridade alta) e a ferramenta pacientes_para_reativar",
          "Card “Orçamentos sem resposta” (70, valor parado de R$ 234.255) e a ferramenta orcamentos_parados",
          "Card “Tratamentos paralisados” (13, receita em risco de R$ 46.957,50) e a ferramenta tratamentos_paralisados",
        ],
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
          "Clínica fictícia com 6 dentistas, 1.600 pacientes e 8.786 consultas em 24 meses, geradas em SQL com semente fixa. O dashboard e o MCP só enxergam os últimos 12 meses (01/11/2025 a 31/10/2026): períodos anteriores são cortados e a resposta informa o período efetivamente usado. A data de hoje da demo é congelada em 31/10/2026, então os números não mudam.",
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
    dataKind: "Sintético",
    resultLabel: "Insight do dado de exemplo",
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
    dataKind: "Sintético",
    period: "90 dias",
    resultLabel: "Insight do dado de exemplo",
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
    dataKind: "Sintético",
    period: "12 meses",
    resultLabel: "Insight do dado de exemplo",
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
    dataKind: "Fictício",
    resultLabel: "O que foi entregue",
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
  "gestao-barbearia": {
    description: [
      "Sistema web de gestão para uma barbearia local: agenda por barbeiro, agendamento online pelo cliente, comandas e caixa, comissões, clube de assinatura e financeiro, com três perfis de acesso (dono, barbeiro e cliente) e app instalável no celular.",
      "A demonstração abaixo é uma cópia separada, com banco próprio e dados fictícios, refeitos a cada 3 horas. Ela entra direto como dono; a tela de login tem os botões para entrar como barbeiro e como cliente, e o botão ao lado abre a versão para celular. O pagamento é simulado e nada é cobrado.",
      "Parti de um template de terceiros e o desenvolvimento seguiu com apoio de IA, então o código não é 100% autoral.",
    ],
    status: "Demo pública",
    dataKind: "Fictício",
    period: "45 dias atrás a 6 dias à frente",
    resultLabel: "O que foi entregue",
    role: "Adaptação de template com IA: clube, regras de negócio, segurança no banco e demo",
    highlights: [
      "Agenda por barbeiro, com bloqueio de horário e lista de espera",
      "Agendamento online pelo cliente, com janela de 7 dias e confirmação por link",
      "Comandas, produtos e caixa, com a comissão gerada ao concluir o atendimento",
      "Clube de assinatura com pote de 45% da receita das mensalidades, dividido por fichas",
      "Cobrança pelo Asaas, com checkout por link, webhook e Pix manual por QR",
      "App web instalável (PWA) no celular, com barra inferior e botão de novo agendamento",
      "Três perfis: o barbeiro vê só a própria agenda e os atendimentos",
    ],
    problem:
      "Reunir em um só sistema a agenda, a comanda, as comissões, o clube de assinatura e o financeiro de uma barbearia, com cada pessoa vendo só o que precisa.",
    decision:
      "Impedi o conflito de horários com triggers no banco, ativei RLS em todas as tabelas e verifiquei as permissões no servidor. Para pagamentos, o sistema não tem campo de número de cartão ou CVV: a cobrança passa pelo Asaas, que guarda os dados do cartão.",
    result: [
      "O banco tem 53 tabelas, todas com RLS, 70 políticas de segurança, 82 funções SQL e 48 triggers (contagem de 09/11/2026).",
      "O Pix manual foi testado em produção com um pagamento real de R$ 5.",
      "10 checagens SQL de invariantes, somente leitura, passam no banco de produção.",
      "Assinante do clube tem um horário em aberto por vez, e a venda coberta pelo clube lança um desconto igual ao valor coberto, com o total da comanda líquido.",
    ],
    stack: [
      "TanStack Start",
      "React 19",
      "Supabase (Postgres, Auth, RLS)",
      "Asaas",
      "PWA",
    ],
    demo: {
      embedUrl: "https://barbearia-demo-portfolio.lovable.app/demo",
      title: "Demo do sistema de gestão para barbearia",
      openLabel: "Abrir demo ao vivo",
      dataLabel: "Dados fictícios",
      links: [
        {
          label: "Abrir versão celular",
          href: "https://barbearia-demo-portfolio.lovable.app/mobile",
        },
      ],
    },
    technical: [
      {
        title: "Origem do projeto",
        paragraphs: [
          "O sistema parte de um template de terceiros para barbearias, com outro sistema de gestão como referência. A primeira rodada foi feita com o agente de IA da Lovable e as seguintes com Claude: botão de cancelar assinatura, aviso de agendamento duplicado, as checagens SQL e a demo. O código completo fica em repositório privado.",
        ],
      },
      {
        title: "Fluxo do atendimento",
        paragraphs: [
          "O cliente agenda sozinho em uma área própria, e o barbeiro ou o dono atende, abre a comanda e recebe. A comissão é gerada quando o atendimento é concluído.",
        ],
        code: "cliente (agendamento online) → agenda do barbeiro → atendimento → comanda → pagamento → comissão",
      },
      {
        title: "Pagamentos",
        paragraphs: [
          "Dinheiro, cartão e Pix são recebidos na comanda, de forma presencial. O clube usa cartão recorrente e Pix manual por QR avulso mensal, cobrados pelo Asaas com checkout por link e webhook. O Pix Automático não está disponível no Asaas para essa conta, então ficou escondido.",
          "O barbeiro cancela a assinatura no sistema, e o cancelamento também acontece no Asaas. O cliente não cancela sozinho: um botão o leva ao WhatsApp do barbeiro.",
        ],
      },
      {
        title: "Regras de negócio",
        paragraphs: [
          "O pote do clube destina 45% da receita das mensalidades, dividido por fichas, e uma ficha vale um minuto de serviço do clube. Quem assina tem um horário em aberto por vez. A venda coberta pelo clube lança um desconto igual ao valor coberto, e o total da comanda fica líquido.",
        ],
      },
      {
        title: "Segurança e banco",
        paragraphs: [
          "Dois agendamentos no mesmo horário são barrados por triggers de conflito de horário e de trava por agenda. O login usa o Supabase Auth, as permissões são verificadas no servidor e as chaves ficam só no servidor. As 10 checagens SQL de invariantes ficam em um arquivo de testes somente leitura.",
        ],
      },
      {
        title: "Como a demo funciona",
        paragraphs: [
          "A demo é um deploy separado, com banco próprio e populado com dados fictícios. As datas são relativas a hoje, de 45 dias atrás a 6 dias à frente, e os dados são refeitos a cada 3 horas. As alterações feitas na demo valem só até o próximo reset.",
          "O pagamento é simulado: a tela avisa e nada é cobrado. A versão celular mostra o app dentro de uma moldura de celular.",
        ],
      },
      {
        title: "Limites",
        paragraphs: [
          "Não há testes automatizados nem migrações versionadas no repositório. O Pix recorrente está indisponível, e o bot de WhatsApp com IA ainda não está em produção, porque depende de aprovação da Meta. Não há app nativo de loja: o app é web e instalável.",
        ],
      },
    ],
  },
  "erp-pipeline-varejo": {
    description: [
      "Reconstrução aberta de uma integração de ERP que entreguei em produção. O pipeline integra o ERP de um supermercado a um data warehouse em estrela: extração incremental, camada de qualidade com quarentena e uma conferência que derruba a carga quando a conta não fecha. Usa Postgres, Python e SQL puro, sem dbt, sem orquestrador e sem serviço pago.",
      "Os dados são 100% sintéticos: o “ERP A” é um banco gerado pelo próprio repositório, desenhado para imitar um ERP legado, inclusive nos defeitos. Nenhum dado de empresa real e nenhum dado pessoal entram no repositório. O código é público no GitHub e foi construído com apoio do Claude Code (os commits registram a coautoria).",
    ],
    status: "Código público no GitHub",
    dataKind: "Sintético",
    period: "30 e 120 dias (duas escalas)",
    resultLabel: "Medições do pipeline",
    impact: [
      "O desenho deste pipeline não nasceu no repositório. Ele veio de uma integração de ERP que entreguei em produção: o ERP passou a alimentar as visões de Power BI da empresa direto da base, em vez de depender de extração manual.",
      "O ganho foi tirar trabalho repetitivo da frente dos analistas de dados. Eles deixaram de remontar a base a cada atualização e passaram a trabalhar em cima de dado já integrado e conferido.",
      "O que está publicado aqui é uma reconstrução sobre um ERP sintético, para que o código pudesse ser aberto: as mesmas armadilhas e as mesmas decisões, com dados gerados pelo próprio repositório. Os tempos e volumes do bloco ao lado são medições de engenharia sobre esses dados sintéticos, registradas em docs/resultados.md — não são métricas de negócio da empresa.",
    ],
    role:
      "Autor da integração em produção e desta reconstrução aberta, feita com apoio de IA",
    highlights: [
      "Publicação atômica: estrela, conferência e marca-d’água num COMMIT só, "
        + "então a carga que reprova não deixa nada publicado",
      "Extração incremental com janela de reprocessamento sobre a data de alteração",
      "Toda linha da origem vira fato ou vira quarentena, com o código da regra que a reprovou",
      "Conferência por dia e loja, em contagem e valor, que derruba a carga se a conta não fecha",
      "Origem lida num retrato fixo (REPEATABLE READ), para que uma venda gravada "
        + "durante a carga não vire falso positivo na conferência",
      "Quatro consultas de negócio em SQL sobre a estrela, com a saída medida no repositório",
      "Mapeamento origem → staging em um arquivo YAML",
      "Origem lida por usuário somente leitura, com teste que tenta escrever e exige a recusa",
      "CI no GitHub Actions que roda os testes e exige que a carga com atraso fora da janela reprove",
    ],
    problem:
      "Em integração de ERP, os erros que machucam são silenciosos: uma venda gravada com data de alteração retroativa nunca é lida pela carga incremental, cancelar a venda atualiza só o cabeçalho e a receita fica inflada, e um item que aponta para produto ainda não cadastrado some num JOIN sem deixar rastro.",
    decision:
      "Organizei o desenho em torno de uma pergunta com resposta sim ou não: origem = destino + quarentena, por dia e por loja. O staging é persistente para reavaliar a quarentena, o fato mantém os cancelados e a marca-d’água só avança se a conferência passa.",
    result: [
      "Na escala de 1 milhão de itens de venda, a carga completa levou 83,48 s, um dia de operação (72 mil itens novos) entrou em 14,42 s e a conferência da história inteira levou 2,52 s. O mesmo comando varia conforme o estado da máquina, e o repositório registra a faixa inteira em vez do melhor número.",
      "Quando o gerador injeta uma venda com 15 dias de atraso e a janela é de 7, a carga reprova com código de saída 1, aponta o dia e quantas linhas faltam, e a marca-d’água não avança. O DW fica exatamente como estava: o CI tira um retrato do banco antes e depois da carga reprovada e exige que sejam idênticos.",
      "O repositório reporta 111 testes, e o CI no GitHub Actions está verde.",
      "As quatro consultas de negócio sobre a estrela respondem em menos de 1,2 s sobre 1.000.016 linhas de venda e 720.000 de estoque, sem índice extra e sem materialização.",
      "Três achados mudaram o código, como a dimensão recarregada sem ANALYZE, que custava 57 s por carga, e o PGHOST=localhost, que custava 10 s por conexão.",
    ],
    stack: [
      "Python 3.13",
      "PostgreSQL 16",
      "SQL",
      "Docker",
      "GitHub Actions",
      "psycopg 3",
      "YAML",
    ],
    diagram: {
      src: "/cases/erp-pipeline.svg",
      alt: "Fluxo do pipeline: ERP de origem, staging, camada tratada, estrela e conferência",
    },
    repoUrl: "https://github.com/GabrielRangel101/erp-pipeline-varejo",
    technical: [
      {
        title: "Camadas",
        paragraphs: [
          "Cada camada tem um trabalho só. O staging (stg) copia e não julga, é persistente e guarda nomes canônicos. A camada tratada (trt) valida e tipa, e manda a linha recusada para a quarentena com o motivo. A estrela (dw) tem 2 fatos e 3 dimensões, com calendário e feriados nacionais. O controle (ctl) registra execuções, marca-d’água e conferência.",
        ],
        code: "erp_origem → stg → trt → dw (estrela)\n                  ↘ quarentena (relida a cada carga)\nconferência: origem = destino + quarentena, por dia e loja",
      },
      {
        title: "Conferência",
        paragraphs: [
          "A carga compara origem e destino por dia e por loja, em contagem e em valor. Se não fecha, sai com código 1 e a marca-d’água fica parada. Como tudo é upsert por chave natural, reler uma carga que morreu no meio não duplica nada.",
        ],
      },
      {
        title: "Publicação atômica",
        paragraphs: [
          "Conferir depois de publicar não serve de muita coisa: o relatório já estaria errado quando o alerta chegasse. Por isso a limpeza da estrela, a carga dos fatos, a conferência e a marca-d’água acontecem dentro de uma transação só. Quem consulta o DW durante a carga continua vendo o estado anterior inteiro, e o estado novo aparece de uma vez, no COMMIT.",
          "A limpeza da carga completa usa DELETE e não TRUNCATE, porque TRUNCATE pega ACCESS EXCLUSIVE e prenderia os leitores durante toda a carga. O VACUUM (ANALYZE) vem depois do commit, já fora da transação. O registro da execução (ctl.execucao, ctl.etapa, ctl.conferencia) sai por uma segunda conexão em autocommit, senão o ROLLBACK que protege o DW apagaria junto o diagnóstico de por que a carga falhou.",
        ],
        code: "extração → staging → tratada        (commit por entidade)\n────────── transação de publicação ──────────\nlimpeza → estrela → conferência → marca-d’água\n                                   └─ COMMIT  ou  ROLLBACK inteiro",
      },
      {
        title: "O que a estrela responde",
        paragraphs: [
          "Um pipeline que ninguém consulta não provou nada. São quatro consultas em SQL puro, com a saída real medida sobre 1 milhão de itens e registrada no repositório. Cada uma existe para defender uma decisão do modelo:",
        ],
        list: [
          "Receita, margem e ticket por loja e mês — por que o fato guarda o item cancelado em vez de apagá-lo: em um mês, na loja maior, são R$ 37 mil que um pipeline ingênuo somaria a mais",
          "Onde a rede perde venda por ruptura — por que o fato de estoque é denso: ruptura é ausência de venda, e ausência não tem linha num fato esparso",
          "Curva de venda na semana e no mês — que a sazonalidade da origem chega intacta na estrela, depois de staging, quarentena, upsert e incremental",
          "O que a quarentena segurou, e quanto vale — que linha recusada tem endereço, motivo e valor, e nenhum JOIN descarta nada em silêncio",
        ],
      },
      {
        title: "Segurança",
        paragraphs: [
          "O pipeline lê a origem com um usuário que só tem SELECT, garantido por GRANT e por um teste que tenta escrever e exige que o banco recuse. As credenciais entram só por variável de ambiente, e o CI não usa nenhum secret.",
        ],
      },
      {
        title: "Como integrar um ERP novo",
        list: [
          "Levantar tabelas, chaves e a coluna que o ERP carimba quando a linha muda",
          "Escrever o mapeamento em um arquivo de conector YAML",
          "Rodar a carga completa, que já termina com a conferência",
          "Conferir os totais e a quarentena com quem conhece o negócio",
          "Ligar o incremental",
          "Liberar o agendamento só depois de ver a conferência fechar em cargas seguidas",
        ],
      },
      {
        title: "Limites",
        paragraphs: [
          "O fato de estoque é denso e não escala para milhões de pares por anos. A conferência de estoque vai até a camada tratada, não até a estrela. Origem e DW ficam no mesmo servidor Postgres, embora em bancos separados. A invalidação não cascateia: se um cadastro válido passa a inválido, os fatos antigos continuam na estrela. O arquivo de conector é código, porque aceita expressões SQL.",
          "A publicação em uma transação só tem preço: nada é liberado antes do COMMIT, então o tamanho de uma carga passa a ser limitado por WAL e espaço em disco. Em volume muito maior, o caminho é publicar por partição, uma transação por mês ou por loja. O retrato fixo da origem também cobra: ele segura o xmin do ERP durante a carga inteira, e resolve para origem Postgres — para outro motor, o caminho portável seria um corte em data de alteração aplicado dos dois lados.",
          "Ainda falta provar o conector com um segundo ERP de layout diferente: o vocabulário do ERP está no código de tratamento e não no YAML, e a marca-d’água assume timestamp. Os dados são sintéticos, as medições vêm de uma única máquina, e o próprio gerador tem um defeito registrado: ele compra menos do que vende, então o nível de ruptura que as consultas mostram é artefato do dado sintético, não retrato de supermercado.",
        ],
      },
    ],
  },
  "trecho-logistica": {
    description: [
      "Dashboard de entregas, frete e custo do ponto de vista de uma transportadora que atende e-commerce, em um único arquivo HTML de cerca de 1 MB, sem back-end e sem banco. Tem um mapa 3D do Brasil com um caminhão por pedido a caminho, uma Mesa de análise (Ctrl K) em que perguntas em texto viram consultas, e um simulador “vale a pena?” que mostra quando acelerar a entrega compensa e quando não.",
      "Os dados são simulados: 99.090 pedidos de jan/2017 a ago/2018, gerados por um script e calibrados em estatísticas públicas do Olist (valores de referência escritos à mão, não extraídos do dataset). O custo por pedido e a margem nacional de 22% são premissas do modelo, não medições. O mapa animado é uma simulação sobre esses dados, não rastreamento ao vivo. Projeto pessoal, com código público no GitHub e escrito com apoio do Claude, sob minha direção.",
      "O layout é responsivo: testei de 360 a 1440 px em Chrome com viewport emulado, sem rolagem horizontal da página e sem erro de console nas cinco telas. Não testei em aparelho físico, e as tabelas largas (vendedores e corredores) rolam na horizontal por escolha de projeto.",
    ],
    status: "Código público no GitHub",
    dataKind: "Sintético",
    period: "jan/2017 a ago/2018 (simulado)",
    resultLabel: "O que o painel mostra",
    impactNote:
      "O que muda na decisão: as três perguntas, que em planilha ficam em arquivos separados, são respondidas na mesma tela, e o simulador mostra o ponto em que acelerar deixa de compensar. Não há impacto medido em operação real: os números vêm de dados simulados e de um modelo com premissas declaradas, e não existe cliente nem usuário real por trás.",
    role: "Projeto pessoal de dashboard e análise, com apoio de IA",
    highlights: [
      "Cinco telas: visão geral, prazo e SLA, receita e custo, rotas e simulador",
      "Atraso, prazo, folga e margem calculados no navegador a partir de um cubo de agregados",
      "Intervalo de Wilson de 95% e mínimo de 100 pedidos para ranquear corredores",
      "Mesa de análise com 20 ferramentas tipadas, sem LLM em execução",
      "Simulador com piso físico: ninguém ganha dias abaixo do mínimo possível",
      "Arquivo único em HTML, CSS e JavaScript, sem framework, sem back-end e sem chave de API",
      "Layout responsivo, testado de 360 a 1440 px com viewport emulado",
    ],
    problem:
      "Uma transportadora que atende e-commerce precisa saber onde a promessa de prazo falha, por região e por corredor, se o frete cobrado paga o custo e quanto vale reduzir dias de postagem ou de transporte. Em planilha, essas três perguntas ficam em arquivos separados.",
    decision:
      "Juntei as três perguntas em um só painel que lê um cubo de agregados (mês × UF), com as fórmulas à vista: atraso é atrasados sobre entregues, folga é prometido menos real, e a margem nacional de 22% entra como premissa e calibra o custo, em vez de aparecer como resultado. Para o ranking de corredores, uso o intervalo de Wilson e o mínimo de 100 pedidos, para que um corredor com poucos pedidos não ganhe posição por sorte.",
    result: [
      "Onde a promessa falha: 91,8% das entregas chegam no prazo, contra a meta de 95%, com 7.860 atrasos. O prazo médio é de 12,2 dias contra 22,5 prometidos, e o painel abre isso por região, UF e corredor, com frete de R$ 2,37 mi, GMV de R$ 13,51 mi e nota média de 4,09.",
      "Se o frete paga o custo: o painel calcula custo e margem por corredor, mas o custo é um modelo e a margem nacional de 22% é premissa. Ele serve para comparar corredores entre si, não para dizer a margem real de uma operação.",
      "Se vale acelerar: no cenário padrão do simulador o ganho é pequeno, +R$ 257,99. O custo mínimo fica perto de R$ 19 por atraso evitado, contra os R$ 20 que a premissa dá a um atraso, e a própria tela diz que o equilíbrio está perto: acelerar só compensa se um atraso custar mais que isso.",
    ],
    stack: [
      "Python",
      "JavaScript",
      "SVG",
      "HTML",
      "CSS",
      "Vercel",
    ],
    demo: {
      embedUrl: "https://trecho-logistica.vercel.app/",
      title: "Dashboard Trecho Logística, inteligência de entregas e frete",
      openLabel: "Abrir demo ao vivo",
      dataLabel: "Dados simulados",
    },
    repoUrl: "https://github.com/GabrielRangel101/trecho-logistica",
    technical: [
      {
        title: "Dados e arquitetura",
        paragraphs: [
          "Um script em Python (semente 42) gera os pedidos em memória e grava só os agregados em um data.json de 701 KB: cubo de 20 meses × 27 UFs, 3.507 linhas de corredor, 5.343 de categoria e 80 vendedores por mês. Um build concatena tudo em um único index.html, que calcula os indicadores no navegador. O mapa é um SVG desenhado à mão, sem biblioteca de mapa e sem fonte de tiles.",
          "Existe também um script de ETL para o conjunto real do Olist, que gera o mesmo data.json. Ele foi testado só com um CSV falso de 6.000 pedidos; nunca foi rodado com o Olist real. O dataset público do Olist tem licença própria, que não verifiquei, e o projeto não o redistribui.",
        ],
      },
      {
        title: "Piso físico no simulador",
        paragraphs: [
          "O ganho de dias é limitado pelo mínimo físico de cada etapa, então o simulador não promete reduzir o que já está no piso.",
        ],
        code: "const gt = on ? Math.min(tv, Math.max(0, c.trans - c.floorT)) : 0,\n      gh = on ? Math.min(hv, Math.max(0, c.hand - FLOOR.hand)) : 0;",
      },
      {
        title: "Calibração do custo",
        paragraphs: [
          "A margem nacional de 22% é uma premissa de entrada. O coeficiente do custo é calibrado para chegar nela, então a margem por região mostra a diferença entre rotas, não a margem real de uma operação.",
        ],
        code: "COST.b = Math.max(0, ((1 - MARGEM_REF) * fr - COST.a * del) / (CIRCK() * (kw || 1)));",
      },
      {
        title: "Mesa de análise",
        paragraphs: [
          "É um interpretador de perguntas por regras, com 20 ferramentas tipadas, e todo número é calculado no navegador. Nada aqui chama um modelo de linguagem. O botão “Copiar contexto” só monta um texto para colar em um chat de IA fora do projeto.",
        ],
      },
      {
        title: "Limites",
        paragraphs: [
          "Não há login, upload de dados, tempo real, previsão nem testes automatizados; as verificações que rodei (carregar as cinco telas, interações, 26 perguntas na Mesa e largura de 390 px sem rolagem horizontal) não ficam no projeto.",
          "Custo e margem são modelo, não medição. Os achados de vendedor (r ≈ 0,80) e de capacidade (r ≈ 0,02) são construídos pelo gerador de dados. A triagem com 100% de acerto no simulador é um teto otimista, e as distâncias são em linha reta × 1,3. Não existem OTIF nem atraso por transportadora, porque o Olist não traz esses dados.",
          "Os dados têm período fixo. A fonte Archivo e a JetBrains Mono vêm do Google Fonts.",
        ],
      },
    ],
  },
  "relatorio-pedidos": {
    description: [
      "Relatório no Looker Studio para uma loja online fictícia (Verdi Shop), em 6 páginas, alimentado por views no BigQuery. Compara a receita do mês com a do mês anterior e mostra quem e o que a sustenta, quanto está preso em pedidos abertos e onde o preço pago foge da tabela.",
      "Os dados são de exemplo: um CSV de um curso de Looker Studio, com 47 pedidos, 10 clientes e 12 produtos, carregado no BigQuery. As datas foram deslocadas para ago/2026 a out/2026 (no arquivo original são de 2020 e 2021). Projeto de portfólio, sem usuário real.",
    ],
    status: "Publicado",
    dataKind: "Exemplo (CSV de curso)",
    period: "ago a out/2026, datas deslocadas",
    resultLabel: "Insight do dado de exemplo",
    role: "Relatório em Looker Studio e camada de views em BigQuery",
    highlights: [
      "Receita fechada separada da carteira em aberto, com comparação contra o mês anterior",
      "Receita por dia, últimos 3 meses, status do mês e ranking de produtos e de clientes",
      "Carteira em aberto por idade do pedido e por cliente",
      "Página de preço e desconto, com receita cedida e exceções contra a tabela",
      "Cards de insight que apontam concentração de receita, pedidos parados e qualidade da base",
      "Filtros de período, sexo, faixa etária, cliente e status em todas as páginas",
    ],
    problem:
      "Responder como a receita de outubro/2026 se compara à de setembro, quem e o que a sustenta, quanto está preso em pedidos abertos e onde o preço pago foge da tabela.",
    decision:
      "Deixei as regras no BigQuery, em views, e o relatório só lê essas views: a tabela base nunca é consultada direto. O card principal mostra só pedidos fechados e a carteira em aberto fica em um card à parte, para que pedidos abertos não inflem o número principal. Os cards de insight vêm de uma tabela já calculada, porque a view original levava em média 5,2 s por consulta.",
    result: [
      "Em outubro/2026, a receita fechada foi de R$ 47.725,90, 183,2% acima de setembro, com 18 pedidos, ticket de R$ 4.338,72 nos fechados e 61,11% de fechamento (11 fechados e 7 abertos).",
      "A carteira em aberto soma 16 pedidos e R$ 37.488,40, e a página de preço mostra 9,95% de desconto médio, com R$ 6.758,20 de receita cedida.",
      "O Chromecast concentra R$ 6.160 dos R$ 6.758,20 cedidos, o que o card de insight da página aponta como ponto de revisão da política de preço.",
    ],
    stack: ["Looker Studio", "BigQuery", "SQL"],
    demo: {
      embedUrl:
        "https://datastudio.google.com/embed/reporting/329d0351-8d24-4e2a-aaee-d3b102d414b8/page/xEIDG",
      title: "Relatório Looker Studio de pedidos de uma loja online",
      openLabel: "Abrir relatório ao vivo",
      ratio: "16 / 10",
      dataLabel: "Dados de exemplo",
    },
    technical: [
      {
        title: "Fonte e modelagem",
        paragraphs: [
          "Os dados ficam no BigQuery, em um projeto pessoal. Há uma tabela base com 103 linhas, todas em texto, e uma tabela com os pontos de atenção dos cards (36 linhas), além de 16 views. O relatório usa 12 fontes de dados, todas views, sem consulta personalizada e sem mesclagem de dados.",
        ],
      },
      {
        title: "Campos calculados",
        paragraphs: [
          "As regras de negócio ficam no SQL das views. As principais:",
        ],
        code: `receita_liquida = total * 0.95  (alíquota fixa de 5%)
cedido = GREATEST(preco_atual * qtde_comprada - total, 0)
desconto_pct = SUM(cedido) / SUM(valor_tabela)
faixa_horario = hora < 6 Madrugada, < 12 Manhã, < 18 Tarde, senão Noite
segmento = <=30 dias sem comprar e >=5 pedidos: Campeão
           <=30 dias: Ativo | <=60 dias: Em risco | acima: Inativo
classe ABC = acumulado - própria fatia < 0,80: A | < 0,95: B | senão C`,
      },
      {
        title: "Páginas do relatório",
        list: [
          "Visão geral: receita fechada, líquida, pedidos, ticket, fechamento e valor em aberto",
          "Receita e pedidos no tempo: média diária, melhor dia, pedidos por semana",
          "Produtos e mix: unidades, receita por item e preço de tabela",
          "Clientes: clientes ativos, receita por cliente e recorrentes",
          "Status e carteira em aberto: pedidos abertos, idade e maior pedido",
          "Preço, desconto e qualidade dos dados: receita cedida, exceções de preço e linhas repetidas",
        ],
      },
      {
        title: "Desempenho",
        paragraphs: [
          "Os cards de insight vinham de uma view pesada, com média de 5,2 s e máximo de 11 s por consulta. Gravei o resultado em uma tabela e os cards passaram a ler dela. O tempo novo não foi medido.",
        ],
      },
      {
        title: "Limites",
        paragraphs: [
          "A base é pequena e de exemplo, e a carga foi feita uma vez, sem atualização automática, segurança por linha ou testes. Os textos dos cards são uma foto de 11/11/2026. Como as views usam a data de hoje, indicadores como dias em aberto e segmento de cliente mudam todo dia. Na página de preço, o indicador “Acima da tabela” soma 3 meses e destoa do gráfico ao lado, que é do mês: é um defeito conhecido e ainda não corrigido.",
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
    dataKind: "Sintético",
    period: "2019 a out/2026",
    resultLabel: "Insight do dado de exemplo",
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
  saleslab: {
    description: [
      "Projeto de portfólio: um dashboard comercial completo para uma empresa B2B fictícia de tecnologia. Reúne receita, meta, funil e desempenho de vendedores, regiões e produtos em um modelo só, com números consistentes entre as páginas.",
      "Os dados são 100% sintéticos, gerados em Python (seed 42) com volume e comportamento realistas: 2.017 clientes, 13.876 oportunidades e 9.649 vendas, de jan/2023 a out/2026. Nenhum dado é de empresa real.",
    ],
    status: "Publicado",
    dataKind: "Sintético",
    period: "jan/2023 a out/2026",
    resultLabel: "Insight do dado de exemplo",
    role: "Relatório em Power BI, do modelo de dados ao layout",
    highlights: [
      "Receita líquida, meta, win rate, pipeline aberto e vendedores na meta, com filtro de período sincronizado entre as páginas",
      "Funil de vendas com win rate por origem da oportunidade",
      "Desempenho por vendedor, região e produto contra a meta",
      "Quatro páginas visíveis e quatro de tooltip, com navegação por botões",
      "KPIs e tooltips em SVG, gerados por medidas DAX",
      "Projeto em formato PBIP (versionável), com dicionário de métricas no README",
    ],
    problem:
      "Times comerciais costumam olhar receita, meta e funil em relatórios separados, o que dificulta saber se a meta está no caminho, onde o funil perde oportunidades e quem puxa o resultado. Vendas, metas e oportunidades têm datas diferentes, e o pipeline aberto é um valor em um ponto no tempo, que não se soma como uma venda.",
    decision:
      "Montei um modelo em estrela único, com um relacionamento inativo ativado por USERELATIONSHIP para contar oportunidades pela data de fechamento. O pipeline aberto é calculado em um ponto no tempo, com base no fim do período selecionado.",
    result: [
      "No painel (01/01 a 31/10/2026, dados sintéticos), a receita líquida é de R$ 28,79 mi, 12,4% acima do ano anterior e 99% da meta de R$ 28,98 mi.",
      "O win rate é de 38,1%: Indicação converte 57,7% e Outbound, 25,1%. O funil vai de 3.692 oportunidades criadas a 1.236 ganhas (33,5%).",
      "11 dos 23 vendedores bateram a meta. Por região, o Centro-Oeste está em 118,0% da meta e o Norte em 72,4%.",
    ],
    stack: ["Power BI", "DAX", "Modelagem de dados", "Python"],
    demo: {
      embedUrl:
        PB +
        "eyJrIjoiODI4YzIzZTYtOTc3Yi00ZGM1LTg4NzYtMjIzZGU0MjlhY2VlIiwidCI6IjY1OWNlMmI4LTA3MTQtNDE5OC04YzM4LWRjOWI2MGFhYmI1NyJ9",
      title: "Relatório Power BI de vendas B2B, SalesLab",
      openLabel: "Abrir relatório ao vivo",
      ratio: "16 / 9",
      dataLabel: "Dados sintéticos",
    },
    technical: [
      {
        title: "Modelo de dados",
        paragraphs: [
          "Esquema estrela com 9 tabelas e 11 relacionamentos. Um deles é inativo e é ativado por USERELATIONSHIP para contar oportunidades pela data de fechamento, já que a oportunidade nasce numa data e fecha em outra.",
        ],
      },
      {
        title: "Medidas DAX",
        paragraphs: [
          "São 64 medidas em 6 pastas: Vendas, Metas, Funil, Clientes e Produtos, Insights e SVG. O Pipeline Aberto é calculado em um ponto no tempo, com base no fim do período selecionado. Duas medidas mostram o tratamento das datas:",
        ],
        code: `Oportunidades Ganhas =
CALCULATE(
    COUNTROWS(Oportunidades),
    USERELATIONSHIP(Oportunidades[Data de Fechamento], 'Calendário'[Data]),
    Oportunidades[Status] = "Ganha"
)

Pipeline Aberto =
VAR _fim = MAX('Calendário'[Data])
RETURN
CALCULATE(
    SUM(Oportunidades[Valor Estimado]),
    REMOVEFILTERS('Calendário'),
    Oportunidades[Data de Criação] <= _fim,
    OR(ISBLANK(Oportunidades[Data de Fechamento]), Oportunidades[Data de Fechamento] > _fim)
)`,
      },
      {
        title: "Visual",
        paragraphs: [
          "KPIs e tooltips em SVG (medidas DAX), 4 páginas visíveis e 4 de tooltip, navegação por botões e filtro de período sincronizado entre as páginas.",
        ],
      },
      {
        title: "Dados sintéticos",
        paragraphs: [
          "Gerados em Python com seed 42. Os nomes de pessoas e empresas são aleatórios. O dashboard não tem vínculo com nenhuma empresa real, nem com o Grupo RBS.",
        ],
      },
      {
        title: "Entrega",
        paragraphs: [
          "O projeto está em formato PBIP (versionável), com dicionário de métricas no README. O repositório ainda não é público.",
        ],
      },
    ],
  },
};

export const hasCase = (slug: string) => slug in cases;
