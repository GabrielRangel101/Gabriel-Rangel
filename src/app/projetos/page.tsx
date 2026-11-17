import type { Metadata } from "next";
import { ProjectsBrowser } from "@/components/projects/ProjectsBrowser";
import { Container } from "@/components/ui/Container";
import { caseTypes } from "@/components/ui/Tag";
import type { CaseType } from "@/components/ui/Tag";
import { cases } from "@/content/cases";
import { publishedProjects } from "@/content/projects";
import { site } from "@/lib/site";

// O openGraph tem que ser declarado aqui: o do layout fala do site inteiro e
// e o que o Next herda quando a pagina nao declara o seu.
export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Cases de dashboards, sistemas e agentes com demo ao vivo e dados sintéticos.",
  alternates: { canonical: "/projetos" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    url: "/projetos",
    title: `Projetos | ${site.name}`,
    description:
      "Cases de dashboards, sistemas e agentes com demo ao vivo e dados sintéticos.",
    // A imagem precisa ser repetida: declarar openGraph aqui substitui o do
    // layout inteiro, e o opengraph-image.png da raiz deixa de ser herdado.
    images: ["/opengraph-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: `Projetos | ${site.name}`,
    description:
      "Cases de dashboards, sistemas e agentes com demo ao vivo e dados sintéticos.",
    images: ["/twitter-image.png"],
  },
};

type Props = {
  searchParams: Promise<{ tipo?: string; ordem?: string }>;
};

const orders = ["destaque", "az", "za"];

// Todos os projetos publicados aparecem juntos (sem paginação). Filtro, busca e ordem
// rodam no cliente; ?tipo= e ?ordem= definem o estado inicial e funcionam sem JS.
export default async function ProjectsPage({ searchParams }: Props) {
  const { tipo, ordem } = await searchParams;
  const active = tipo && tipo in caseTypes ? (tipo as CaseType) : undefined;
  const order = ordem && orders.includes(ordem) ? ordem : "destaque";
  const items = publishedProjects.map((project) => ({
    project,
    stack: cases[project.slug]?.stack ?? [],
  }));

  return (
    <Container className="pt-12 md:pt-20">
      <div data-reveal>
        <p className="text-eyebrow text-ink-subtle">Projetos</p>
        <h1 className="mt-3 max-w-[16ch] text-balance text-[clamp(40px,7vw,96px)] font-light leading-[0.98] tracking-[-0.045em]">
          Cases com demo aberta e números conferíveis.
        </h1>
      </div>

      <ProjectsBrowser items={items} initialType={active} initialOrder={order} />
    </Container>
  );
}
