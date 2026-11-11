// Dados do site em um só lugar. Links externos sem URL confirmada ficam de fora do Footer.
export const site = {
  name: "Gabriel Rangel",
  // Empresa que presta o serviço: aparece só em /servicos e no rodapé.
  // Preencha razão social e CNPJ para exibi-los (ficam ocultos enquanto estiverem vazios).
  company: {
    name: "Rangel Analytics",
    legalName: undefined as string | undefined,
    cnpj: undefined as string | undefined,
  },
  tagline:
    "Analista de dados e automação com IA. Dashboards, sistemas e agentes que tiram o trabalho manual do caminho.",
  nav: [
    { href: "/projetos", label: "Projetos" },
    { href: "/sobre", label: "Sobre" },
    { href: "/servicos", label: "Serviços" },
    { href: "/contato", label: "Contato" },
  ],
  // E-mail público, exibido em Contato e no rodapé.
  email: "gabrielrangel.analytics@gmail.com" as string | undefined,
  // PDF do currículo, só para a página privada /cv. Coloque o arquivo em /public e informe o caminho (ex.: "/cv-gabriel-rangel.pdf").
  cvPdf: undefined as string | undefined,
  // Cargo e ferramentas da primeira dobra.
  stack: ["Power BI", "Looker Studio", "SQL", "BigQuery", "Python", "n8n"],
  cta: { href: "/contato", label: "Falar comigo" },
  external: {
    github: "https://github.com/GabrielRangel101" as string | undefined,
    linkedin: "https://www.linkedin.com/in/gabriel-rangel-a954ba26a/" as
      | string
      | undefined,
  },
} as const;
