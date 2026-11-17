"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { MouseEvent } from "react";
import { CaseCard } from "@/components/ui/CaseCard";
import { SortMenu } from "@/components/ui/SortMenu";
import { caseTypes } from "@/components/ui/Tag";
import type { CaseType } from "@/components/ui/Tag";
import type { Project } from "@/content/projects";

export type BrowserItem = { project: Project; stack: string[] };

const sortOptions = [
  { value: "destaque", label: "Em destaque" },
  { value: "az", label: "A–Z" },
  { value: "za", label: "Z–A" },
];

const hrefFor = (tipo?: CaseType, ordem?: string) => {
  const params = new URLSearchParams();
  if (tipo) params.set("tipo", tipo);
  if (ordem && ordem !== "destaque") params.set("ordem", ordem);
  const query = params.toString();
  return query ? `/projetos?${query}` : "/projetos";
};

// Busca sem acento e sem caixa, no título, no resumo e nas ferramentas.
const normalize = (text: string) =>
  text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const chipClass = (selected: boolean) =>
  `text-button touch-target inline-flex shrink-0 items-center gap-2 rounded-full border px-4 transition-colors duration-200 ${
    selected
      ? "border-primary bg-primary text-on-primary"
      : "border-line-soft text-ink-subtle hover:border-ink-subtle hover:text-ink"
  }`;

// Filtros (chips com contagem), busca e ordenação no cliente. Os chips são links de verdade:
// sem JS, ?tipo= e ?ordem= continuam funcionando pela renderização do servidor.
export function ProjectsBrowser({
  items,
  initialType,
  initialOrder,
}: {
  items: BrowserItem[];
  initialType?: CaseType;
  initialOrder: string;
}) {
  const [type, setType] = useState<CaseType | undefined>(initialType);
  const [order, setOrder] = useState(initialOrder);
  const [query, setQuery] = useState("");
  // Só anima a entrada dos cards depois da primeira interação: na carga inicial eles pintam direto.
  const [touched, setTouched] = useState(false);

  const searched = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return items;
    return items.filter(({ project, stack }) =>
      normalize([project.title, project.summary, project.headline, caseTypes[project.type].label, ...stack].join(" ")).includes(q),
    );
  }, [items, query]);

  const types = (Object.keys(caseTypes) as CaseType[]).filter((t) =>
    items.some((i) => i.project.type === t),
  );

  const visible = useMemo(() => {
    const filtered = type ? searched.filter((i) => i.project.type === type) : searched;
    if (order === "destaque") return filtered;
    return [...filtered].sort(
      (a, b) => a.project.title.localeCompare(b.project.title, "pt-BR") * (order === "za" ? -1 : 1),
    );
  }, [searched, type, order]);

  const sync = (nextType: CaseType | undefined, nextOrder: string) => {
    window.history.replaceState(null, "", hrefFor(nextType, nextOrder));
  };

  const pickType = (event: MouseEvent, next: CaseType | undefined) => {
    event.preventDefault();
    setTouched(true);
    setType(next);
    sync(next, order);
  };

  // A chave muda a cada filtro: os cards remontam e entram de novo, escalonados.
  const gridKey = `${type ?? "todos"}-${order}-${query}`;

  return (
    <>
      <div className="mt-10 flex flex-col gap-4 border-y border-line-soft py-3 lg:flex-row lg:items-center lg:justify-between">
        <nav
          aria-label="Filtrar por tipo"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0"
        >
          <Link
            href={hrefFor(undefined, order)}
            aria-current={!type ? "page" : undefined}
            onClick={(e) => pickType(e, undefined)}
            className={chipClass(!type)}
          >
            Todos
            <small className="text-[11px] tabular-nums opacity-70">{searched.length}</small>
          </Link>
          {types.map((t) => {
            const { label, Icon } = caseTypes[t];
            const count = searched.filter((i) => i.project.type === t).length;
            return (
              <Link
                key={t}
                href={hrefFor(t, order)}
                aria-current={type === t ? "page" : undefined}
                onClick={(e) => pickType(e, t)}
                className={chipClass(type === t)}
              >
                <Icon />
                {label}
                <small className="text-[11px] tabular-nums opacity-70">{count}</small>
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="text-body-sm flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-full border border-line-soft px-4 text-ink-subtle transition-[border-color,box-shadow] duration-200 focus-within:border-primary focus-within:text-ink focus-within:shadow-[0_0_0_3px_rgb(43_196_207/0.15)] sm:min-w-[260px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <span className="sr-only">Buscar projeto ou ferramenta</span>
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setTouched(true);
                setQuery(e.target.value);
              }}
              placeholder="Buscar projeto ou ferramenta"
              className="min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-ink-subtle"
            />
          </label>
          <SortMenu
            current={order}
            onSelect={(value) => {
              setTouched(true);
              setOrder(value);
              sync(type, value);
            }}
            options={sortOptions.map((o) => ({ ...o, href: hrefFor(type, o.value) }))}
          />
        </div>
      </div>

      <p className="text-body-sm mt-6 text-ink-subtle" aria-live="polite">
        Mostrando {visible.length} de {items.length} {items.length === 1 ? "projeto" : "projetos"}
      </p>

      <h2 className="sr-only">Lista de projetos</h2>
      {visible.length > 0 ? (
        <div key={gridKey} className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map(({ project, stack }, i) => (
            <CaseCard key={project.slug} project={project} stack={stack} index={i} animate={touched} priority={i < 3} />
          ))}
        </div>
      ) : (
        <div className="mt-6 max-w-xl rounded-[20px] border border-line-soft bg-surface-1 p-6">
          <h2 className="text-card-title">Nenhum projeto com esse filtro.</h2>
          <p className="text-body-sm mt-2 text-ink-muted">
            Limpe a busca ou escolha outro tipo para ver os cases publicados.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setType(undefined);
              sync(undefined, order);
            }}
            className="link-retract text-button touch-target mt-4 text-primary"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </>
  );
}
