import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";
import { ArrowRightIcon } from "./icons";
import { TypeTag } from "./Tag";

// O link cobre o card inteiro (after:absolute), então o clique e o foco valem para toda a área.
// Hover (só mouse): sobe 5 px, borda no acento e spotlight que segue o cursor.
export function CaseCard({
  project,
  stack: fullStack,
  lean = false,
  index = 0,
  animate = false,
}: {
  project: Project;
  // Ferramentas do case (o card mostra as três primeiras). Vem por prop para o card servir no cliente sem carregar os textos dos cases.
  stack: string[];
  // Versão enxuta da Home: título, uma linha de resultado e três tags.
  lean?: boolean;
  // Posição na grade, para a entrada escalonada.
  index?: number;
  // Entrada escalonada (usada ao filtrar em /projetos).
  animate?: boolean;
}) {
  const stack = fullStack.slice(0, 3);

  return (
    <article
      className={`spotlight group relative flex flex-col overflow-hidden rounded-[20px] border border-line-soft bg-[linear-gradient(180deg,rgb(15_40_51/0.7),rgb(11_29_39/0.6))] transition-[transform,border-color,box-shadow] duration-[400ms] ease-[var(--ease-expressive)] focus-within:border-primary/45 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary has-[:focus-visible]:[outline-style:solid] hover:-translate-y-[5px] hover:border-primary/45 hover:shadow-[0_24px_50px_-24px_rgb(43_196_207/0.35)] ${animate ? "card-in" : ""}`}
      style={animate ? ({ "--d": index } as React.CSSProperties) : undefined}
      data-reveal={animate ? undefined : ""}
    >
      {project.image && (
        <div className="relative aspect-[16/9] overflow-hidden border-b border-line-soft bg-surface-2">
          <Image
            src={project.image}
            alt={`Prévia do projeto ${project.title}`}
            fill
            sizes="(min-width: 1024px) 440px, (min-width: 640px) 50vw, 100vw"
            placeholder="blur"
            quality={90}
            className="object-cover object-top transition-transform duration-700 ease-[var(--ease-expressive)] group-hover:scale-[1.05]"
          />
          <div className="absolute bottom-3 left-3">
            <TypeTag type={project.type} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        {!project.image && <TypeTag type={project.type} />}
        <h3 className="text-[22px] font-medium leading-[1.15] tracking-[-0.02em]">
          <Link
            href={`/projetos/${project.slug}`}
            className="rounded-xs after:absolute after:inset-0 after:z-[3] focus-visible:outline-none"
          >
            {project.title}
          </Link>
        </h3>
        {lean ? (
          <p className="text-body-sm line-clamp-2 font-medium text-primary">
            {project.headline}
          </p>
        ) : (
          <p className="text-body-sm line-clamp-3 text-ink-muted">
            {project.summary}
          </p>
        )}
        <ul className="flex flex-wrap gap-1.5" aria-label="Ferramentas">
          {stack.map((tool) => (
            <li
              key={tool}
              className="text-caption rounded-full border border-line-soft px-2.5 py-0.5 text-ink-subtle"
            >
              {tool}
            </li>
          ))}
        </ul>
        <span className="text-button mt-auto inline-flex items-center gap-2 pt-2 text-ink">
          Ver projeto
          <ArrowRightIcon className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
