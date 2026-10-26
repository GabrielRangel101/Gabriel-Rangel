// Dados do site em um só lugar. Links externos sem URL confirmada ficam de fora do Footer.
export const site = {
  name: "Gabriel Rangel",
  tagline:
    "Analista de dados e automação com IA. Dashboards, sistemas e agentes que tiram o trabalho manual do caminho.",
  nav: [
    { href: "/projetos", label: "Projetos" },
    { href: "/vagas", label: "Vagas" },
    { href: "/servicos", label: "Serviços" },
    { href: "/sobre", label: "Sobre" },
  ],
  cta: { href: "/contato", label: "Falar comigo" },
  external: {
    github: undefined as string | undefined,
    linkedin: undefined as string | undefined,
  },
} as const;
