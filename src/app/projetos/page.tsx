import type { Metadata } from "next";
import Link from "next/link";
import { CaseCard } from "@/components/ui/CaseCard";
import { Container } from "@/components/ui/Container";
import { caseTypes } from "@/components/ui/Tag";
import type { CaseType } from "@/components/ui/Tag";
import { publishedProjects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Cases de dashboards, sistemas e agentes com demo ao vivo e dados sintéticos.",
};

type Props = { searchParams: Promise<{ tipo?: string }> };

const tabClass = (selected: boolean) =>
  `text-button touch-target transition-ui inline-flex shrink-0 items-center gap-2 rounded-full px-4 ${
    selected
      ? "bg-surface-2 text-ink"
      : "text-ink-subtle hover:bg-surface-1 hover:text-ink"
  }`;

export default async function ProjectsPage({ searchParams }: Props) {
  const { tipo } = await searchParams;
  const active =
    tipo && tipo in caseTypes ? (tipo as CaseType) : undefined;
  const visible = active
    ? publishedProjects.filter((p) => p.type === active)
    : publishedProjects;

  return (
    <Container className="pt-12 md:pt-16">
      <p className="text-eyebrow text-ink-subtle">Projetos</p>
      <h1 className="text-display-md mt-3 max-w-3xl">
        Demos reais, para abrir e testar.
      </h1>

      {publishedProjects.length > 4 && (
      <nav
        aria-label="Filtrar por tipo"
        className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
      >
        <Link
          href="/projetos"
          aria-current={!active ? "page" : undefined}
          className={tabClass(!active)}
        >
          Todos
        </Link>
        {(Object.keys(caseTypes) as CaseType[]).map((type) => {
          const { label, Icon } = caseTypes[type];
          return (
            <Link
              key={type}
              href={`/projetos?tipo=${type}`}
              aria-current={active === type ? "page" : undefined}
              className={tabClass(active === type)}
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>
      )}

      {visible.length > 0 ? (
        <>
          <p className="text-body-sm mt-6 text-ink-subtle">
            Mostrando {visible.length}{" "}
            {visible.length === 1 ? "projeto" : "projetos"}
          </p>
          <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((project) => (
              <CaseCard key={project.slug} project={project} />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-8 max-w-xl rounded-xl border border-hairline bg-surface-1 p-6">
          <h2 className="text-card-title">
            Ainda não há cases de {active && caseTypes[active].label}.
          </h2>
          <p className="text-body-sm mt-2 text-ink-muted">
            Um case novo entra por semana. Veja os que já estão no ar.
          </p>
          <Link
            href="/projetos"
            className="text-button touch-target mt-4 inline-flex items-center rounded-md text-primary"
          >
            Ver todos os projetos
          </Link>
        </div>
      )}
    </Container>
  );
}
