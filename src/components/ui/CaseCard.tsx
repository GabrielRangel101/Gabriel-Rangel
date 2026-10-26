import Image from "next/image";
import Link from "next/link";
import { cases } from "@/content/cases";
import type { Project } from "@/content/projects";
import { ArrowRightIcon } from "./icons";
import { SyntheticBadge, TypeTag } from "./Tag";

// O link cobre o card inteiro (after:absolute), então o clique e o foco valem para toda a área.
export function CaseCard({ project }: { project: Project }) {
  const stack = cases[project.slug]?.stack.slice(0, 4) ?? [];

  return (
    <article className="transition-ui group relative flex flex-col overflow-hidden rounded-xl border border-hairline bg-surface-1 hover:border-hairline-strong hover:bg-surface-2">
      {project.image && (
        <div className="relative aspect-[16/10] overflow-hidden border-b border-hairline bg-surface-2">
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

      <div className="flex flex-1 flex-col gap-3 p-6">
        {!project.image && <TypeTag type={project.type} />}
        <h3 className="text-card-title">
          <Link
            href={`/projetos/${project.slug}`}
            className="rounded-xs after:absolute after:inset-0"
          >
            {project.title}
          </Link>
        </h3>
        <p className="text-body-sm line-clamp-3 text-ink-muted">
          {project.summary}
        </p>
        <ul className="flex flex-wrap gap-2">
          {project.synthetic && (
            <li>
              <SyntheticBadge />
            </li>
          )}
          {stack.map((tool) => (
            <li
              key={tool}
              className="text-caption rounded-full border border-hairline px-2 py-0.5 text-ink-subtle"
            >
              {tool}
            </li>
          ))}
        </ul>
        <span className="text-button mt-auto inline-flex items-center gap-2 pt-3 text-primary">
          Ver case
          <ArrowRightIcon className="transition-ui group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
