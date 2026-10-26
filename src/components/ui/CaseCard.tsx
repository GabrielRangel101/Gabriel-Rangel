import Link from "next/link";
import type { Project } from "@/content/projects";
import { ArrowRightIcon } from "./icons";
import { SyntheticBadge, TypeTag } from "./Tag";

// O link cobre o card inteiro (after:absolute), então o clique e o foco valem para toda a área.
export function CaseCard({ project }: { project: Project }) {
  return (
    <article className="transition-ui group relative flex flex-col gap-4 rounded-xl border border-hairline bg-surface-1 p-6 hover:border-hairline-strong hover:bg-surface-2">
      <div className="flex flex-wrap gap-2">
        <TypeTag type={project.type} />
        {project.synthetic && <SyntheticBadge />}
      </div>
      <h3 className="text-card-title">
        <Link
          href={`/projetos/${project.slug}`}
          className="rounded-xs after:absolute after:inset-0 after:rounded-xl"
        >
          {project.title}
        </Link>
      </h3>
      <p className="text-body-sm text-ink-muted">{project.summary}</p>
      <span className="text-button mt-auto inline-flex items-center gap-2 pt-2 text-primary">
        Ver case
        <ArrowRightIcon className="transition-ui group-hover:translate-x-0.5" />
      </span>
    </article>
  );
}
