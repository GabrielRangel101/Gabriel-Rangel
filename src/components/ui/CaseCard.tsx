import Image from "next/image";
import Link from "next/link";
import { cases } from "@/content/cases";
import type { Project } from "@/content/projects";
import { ArrowRightIcon } from "./icons";
import { TypeTag } from "./Tag";

// O link cobre o card inteiro (after:absolute), então o clique e o foco valem para toda a área.
export function CaseCard({ project }: { project: Project }) {
  const study = cases[project.slug];
  const stack = study?.stack.slice(0, 4) ?? [];

  return (
    <article className="transition-ui group relative flex flex-col overflow-hidden rounded-xl border border-hairline bg-surface-1 hover:border-hairline-strong hover:bg-surface-2">
      {project.image && (
        <div className="relative aspect-[16/9] overflow-hidden border-b border-hairline bg-surface-2">
          <Image
            src={project.image}
            alt={`Prévia do dashboard ${project.title}`}
            fill
            sizes="(min-width: 1024px) 420px, (min-width: 768px) 50vw, 100vw"
            placeholder="blur"
            className="transition-ui object-cover object-top group-hover:scale-[1.02]"
          />
          <div className="absolute right-3 top-3">
            <TypeTag type={project.type} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-6">
        {!project.image && <TypeTag type={project.type} />}
        <h3 className="text-card-title">
          <Link
            href={`/projetos/${project.slug}`}
            className="rounded-xs after:absolute after:inset-0"
          >
            {project.title}
          </Link>
        </h3>
        {study && (
          <dl className="flex flex-col gap-3">
            <div>
              <dt className="text-eyebrow text-ink">Desafio</dt>
              <dd className="text-body-sm mt-1 text-ink-muted">{study.problem}</dd>
            </div>
            <div>
              <dt className="text-eyebrow text-ink">O que fiz</dt>
              <dd className="text-body-sm mt-1 text-ink-muted">{study.decision}</dd>
            </div>
            <div className="rounded-lg bg-surface-3 p-4">
              <dt className="text-eyebrow text-primary">Resultado</dt>
              <dd className="text-body-sm mt-1 font-medium text-ink">
                {study.result[0]}
              </dd>
            </div>
          </dl>
        )}
        <ul className="flex flex-wrap gap-2">
          {stack.map((tool) => (
            <li
              key={tool}
              className="text-caption rounded-full border border-hairline px-2 py-0.5 text-ink-subtle"
            >
              {tool}
            </li>
          ))}
        </ul>
        <span className="text-button mt-auto inline-flex items-center gap-2 pt-2 text-primary">
          Ver projeto
          <ArrowRightIcon className="transition-ui group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
