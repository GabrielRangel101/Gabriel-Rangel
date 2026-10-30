import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import { CaseCard } from "@/components/ui/CaseCard";
import { Container } from "@/components/ui/Container";
import { SortMenu } from "@/components/ui/SortMenu";
import { caseTypes } from "@/components/ui/Tag";
import type { CaseType } from "@/components/ui/Tag";
import { publishedProjects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Cases de dashboards, sistemas e agentes com demo ao vivo e dados sintéticos.",
};

// Até 12 projetos aparecem juntos; a paginação só surge quando passar disso (3 linhas de 4).
const PAGE_SIZE = 12;

type Props = {
  searchParams: Promise<{ tipo?: string; pagina?: string; ordem?: string }>;
};

// Sem data nos cases, a ordem padrão é a curadoria (destaque); as outras são alfabéticas.
const sortOptions = [
  { value: "destaque", label: "Em destaque" },
  { value: "az", label: "A–Z" },
  { value: "za", label: "Z–A" },
];

const hrefFor = (tipo?: CaseType, ordem?: string, page = 1) => {
  const params = new URLSearchParams();
  if (tipo) params.set("tipo", tipo);
  if (ordem && ordem !== "destaque") params.set("ordem", ordem);
  if (page > 1) params.set("pagina", String(page));
  const query = params.toString();
  return query ? `/projetos?${query}` : "/projetos";
};

const pageButton =
  "transition-ui grid size-10 place-items-center rounded-md border border-hairline text-ink-muted hover:border-hairline-strong hover:text-ink";

const tabClass = (selected: boolean) =>
  `text-button touch-target transition-ui inline-flex shrink-0 items-center gap-2 rounded-lg border px-4 ${
    selected
      ? "border-primary bg-primary text-on-primary"
      : "border-hairline bg-surface-2 text-ink-muted hover:border-hairline-strong hover:text-ink"
  }`;

export default async function ProjectsPage({ searchParams }: Props) {
  const { tipo, pagina, ordem } = await searchParams;
  const active =
    tipo && tipo in caseTypes ? (tipo as CaseType) : undefined;
  const order = sortOptions.some((o) => o.value === ordem) ? ordem! : "destaque";
  const filtered = active
    ? publishedProjects.filter((p) => p.type === active)
    : publishedProjects;
  const visible =
    order === "destaque"
      ? filtered
      : [...filtered].sort(
          (a, b) =>
            a.title.localeCompare(b.title, "pt-BR") * (order === "za" ? -1 : 1),
        );
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number.parseInt(pagina ?? "1", 10) || 1), totalPages);
  const pageItems = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Container className="pt-12 md:pt-16">
      <p className="text-eyebrow text-ink-subtle">Projetos</p>
      <h1 className="text-display-md mt-3 max-w-3xl">
        Demos reais, para abrir e testar.
      </h1>

      {publishedProjects.length > 4 && (
        <div className="mt-8 flex flex-col gap-3 rounded-xl border border-hairline bg-surface-1 p-3 md:flex-row md:items-center md:justify-between">
          <nav
            aria-label="Filtrar por tipo"
            className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0"
          >
            <Link
              href={hrefFor(undefined, order)}
              aria-current={!active ? "page" : undefined}
              className={tabClass(!active)}
            >
              Todos
            </Link>
            {(Object.keys(caseTypes) as CaseType[])
              .filter((type) => publishedProjects.some((p) => p.type === type))
              .map((type) => {
                const { label, Icon } = caseTypes[type];
                return (
                  <Link
                    key={type}
                    href={hrefFor(type, order)}
                    aria-current={active === type ? "page" : undefined}
                    className={tabClass(active === type)}
                  >
                    <Icon />
                    {label}
                  </Link>
                );
              })}
          </nav>
          <SortMenu
            current={order}
            options={sortOptions.map((o) => ({
              ...o,
              href: hrefFor(active, o.value),
            }))}
          />
        </div>
      )}

      {visible.length > 0 ? (
        <>
          <p className="text-body-sm mt-6 text-ink-subtle">
            Mostrando {pageItems.length} de {visible.length}{" "}
            {visible.length === 1 ? "projeto" : "projetos"}
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pageItems.map((project) => (
              <CaseCard key={project.slug} project={project} compact />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label="Paginação"
              className="mt-10 flex items-center justify-center gap-2"
            >
              {page > 1 ? (
                <Link
                  href={hrefFor(active, order, page - 1)}
                  aria-label="Página anterior"
                  className={pageButton}
                >
                  <ArrowLeftIcon />
                </Link>
              ) : (
                <span aria-hidden className={`${pageButton} opacity-40`}>
                  <ArrowLeftIcon />
                </span>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={hrefFor(active, order, n)}
                  aria-label={`Página ${n}`}
                  aria-current={n === page ? "page" : undefined}
                  className={`${pageButton} ${
                    n === page
                      ? "border-primary bg-primary text-on-primary hover:border-primary hover:text-on-primary"
                      : ""
                  }`}
                >
                  {n}
                </Link>
              ))}
              {page < totalPages ? (
                <Link
                  href={hrefFor(active, order, page + 1)}
                  aria-label="Próxima página"
                  className={pageButton}
                >
                  <ArrowRightIcon />
                </Link>
              ) : (
                <span aria-hidden className={`${pageButton} opacity-40`}>
                  <ArrowRightIcon />
                </span>
              )}
            </nav>
          )}
        </>
      ) : (
        <div className="mt-8 max-w-xl rounded-xl border border-hairline bg-surface-1 p-6">
          <h2 className="text-card-title">
            Ainda não há cases de {active && caseTypes[active].label}.
          </h2>
          <p className="text-body-sm mt-2 text-ink-muted">
            Veja os que já estão no ar.
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
