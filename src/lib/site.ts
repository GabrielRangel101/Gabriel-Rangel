import type { CaseType } from "@/components/ui/Tag";

// Dados do site em um só lugar. Links externos sem URL confirmada ficam de fora do Footer.
export const site = {
  name: "Gabriel Rangel",
  tagline:
    "Analista de dados e automação com IA. Dashboards, sistemas e agentes que tiram o trabalho manual do caminho.",
  nav: [
    { href: "/", label: "Início" },
    { href: "/projetos", label: "Projetos" },
    { href: "/sobre", label: "Sobre" },
    { href: "/contato", label: "Contato" },
  ],
  // Atalhos por tipo de projeto no cabeçalho; os demais tipos ficam nas abas de /projetos.
  navTypes: ["power-bi", "web-ia", "sistema", "agente"] satisfies CaseType[],
  // Preencha para exibir no site: e-mail público e caminho do CV em /public (ex.: "/cv-gabriel-rangel.pdf").
  email: undefined as string | undefined,
  cv: undefined as string | undefined,
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
