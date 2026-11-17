import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { toolGroups } from "@/content/about";
import { toolUsage } from "@/content/stack";

export const metadata: Metadata = {
  title: "Stack",
  description:
    "As ferramentas com que trabalho e em quais projetos do portfólio cada uma foi usada.",
  alternates: { canonical: "/stack" },
};

export default function StackPage() {
  const usage = toolUsage();
  const repeated = usage.filter((u) => u.projects.length > 1);
  const single = usage.filter((u) => u.projects.length === 1);

  return (
    <>
      <section aria-labelledby="stack-titulo" className="pt-12 md:pt-20">
        <Container data-reveal>
          <p className="text-eyebrow text-ink-subtle">Stack</p>
          <h1
            id="stack-titulo"
            className="mt-3 max-w-[14ch] text-balance text-[clamp(40px,7vw,96px)] font-light leading-[0.98] tracking-[-0.045em]"
          >
            Com o que eu trabalho.
          </h1>
          <p className="text-subhead mt-6 max-w-2xl text-ink-muted">
            As ferramentas do dia a dia e, para cada uma, os projetos em que ela
            foi usada. A lista de projetos vem da stack de cada case.
          </p>
        </Container>
      </section>

      <Section id="ferramentas" eyebrow="Ferramentas" title="O que domino e o que já usei.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toolGroups.map((group) => (
            <section
              key={group.title}
              aria-labelledby={`ferr-${group.title}`}
              className="rounded-[20px] border border-line-soft p-6"
              data-reveal
            >
              <h3 id={`ferr-${group.title}`} className="text-card-title">
                {group.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="text-body-sm rounded-full border border-line-soft px-3 py-1.5 text-ink-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Section>

      <Section id="onde-usei" eyebrow="Onde usei" title="Cada ferramenta, em quais projetos.">
        <ul className="border-t border-line-soft">
          {repeated.map(({ tool, projects }) => (
            <li
              key={tool}
              className="grid gap-x-6 gap-y-2 border-b border-line-soft py-5 md:grid-cols-[220px_1fr]"
              data-reveal
            >
              <p className="flex items-baseline gap-3">
                <span className="text-[clamp(20px,2vw,26px)] font-normal tracking-[-0.02em]">{tool}</span>
                <span className="text-body-sm tabular-nums text-primary">{projects.length}</span>
              </p>
              <ul className="flex flex-wrap gap-x-5 gap-y-1">
                {projects.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/projetos/${p.slug}`}
                      className="link-retract text-body-sm touch-target text-ink-muted hover:text-ink"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <h3 className="text-card-title mt-12">Usadas em um projeto</h3>
        <ul className="mt-4 flex flex-wrap gap-2" data-reveal>
          {single.map(({ tool, projects }) => (
            <li key={tool}>
              <Link
                href={`/projetos/${projects[0].slug}`}
                title={projects[0].title}
                className="text-body-sm inline-flex min-h-9 items-center rounded-full border border-line-soft px-3 text-ink-muted transition-colors duration-200 hover:border-primary/45 hover:text-ink"
              >
                {tool}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
