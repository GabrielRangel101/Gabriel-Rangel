import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Container } from "@/components/ui/Container";
import { DemoFrame } from "@/components/ui/DemoFrame";
import { ArrowRightIcon, ExternalLinkIcon } from "@/components/ui/icons";
import { SyntheticBadge, TypeTag } from "@/components/ui/Tag";
import { cases } from "@/content/cases";
import { projects } from "@/content/projects";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.filter((p) => p.slug in cases).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project || !(slug in cases)) return {};
  return { title: project.title, description: project.summary };
}

const linkClass =
  "text-button inline-flex min-h-10 items-center gap-2 rounded-md text-primary";

export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const study = cases[slug];
  if (!project || !study) notFound();

  return (
    <article className="pt-8 md:pt-12">
      <Container>
        <Link
          href="/#projetos"
          className="text-body-sm inline-flex min-h-10 items-center rounded-md text-ink-subtle hover:text-ink"
        >
          ← Projetos
        </Link>

        <header className="mt-6 max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <TypeTag type={project.type} />
            {project.synthetic && <SyntheticBadge />}
          </div>
          <h1 className="text-display-md mt-4">{project.title}</h1>
          <p className="text-subhead mt-4 text-ink-muted">{project.summary}</p>
        </header>

        <section aria-label="Demo" className="mt-12">
          <DemoFrame
            fallbackHref={study.demo.embedUrl}
            fallbackLabel="Abrir o dashboard em nova aba"
          >
            <iframe
              src={study.demo.embedUrl}
              title={study.demo.title}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              className="h-[70dvh] min-h-[520px] w-full bg-surface-2 md:h-auto md:aspect-[16/10]"
            />
          </DemoFrame>
          {study.demo.autoUrl && (
            <a href={study.demo.autoUrl} className={`${linkClass} mt-4`}>
              Ver o modo demo automático (cerca de 45 s)
              <ExternalLinkIcon />
            </a>
          )}
        </section>

        <div className="mt-section-mobile grid gap-12 md:mt-section md:grid-cols-3 md:gap-8">
          <section aria-labelledby="problema">
            <h2 id="problema" className="text-eyebrow text-ink-subtle">
              Problema
            </h2>
            <p className="text-body mt-3 text-ink-muted">{study.problem}</p>
          </section>
          <section aria-labelledby="decisao">
            <h2 id="decisao" className="text-eyebrow text-ink-subtle">
              Decisão
            </h2>
            <p className="text-body mt-3 text-ink-muted">{study.decision}</p>
          </section>
          <section aria-labelledby="resultado">
            <h2 id="resultado" className="text-eyebrow text-ink-subtle">
              Resultado
            </h2>
            <ul className="text-body mt-3 flex flex-col gap-3 text-ink-muted">
              {study.result.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <section aria-labelledby="stack" className="mt-12">
          <h2 id="stack" className="text-eyebrow text-ink-subtle">
            Stack
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {study.stack.map((tool) => (
              <li
                key={tool}
                className="text-body-sm rounded-md border border-hairline bg-surface-1 px-3 py-2 text-ink-muted"
              >
                {tool}
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="tecnica"
          className="mt-section-mobile md:mt-section"
        >
          <h2 id="tecnica" className="text-headline">
            Camada técnica
          </h2>
          <p className="text-body mt-2 max-w-2xl text-ink-muted">
            Para quem quer ver como foi feito.
          </p>
          <div className="mt-8 max-w-3xl">
            <Accordion>
              {study.technical.map((section) => (
                <AccordionItem key={section.title} title={section.title}>
                  <div className="flex flex-col gap-4">
                    {section.paragraphs?.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                    {section.code && <CodeBlock>{section.code}</CodeBlock>}
                    {section.list && (
                      <ul className="list-disc pl-5">
                        {section.list.map((item) => (
                          <li key={item} className="py-0.5">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          {study.repoUrl && (
            <a href={study.repoUrl} rel="noopener" className={`${linkClass} mt-6`}>
              Ver o código no GitHub
              <ArrowRightIcon />
            </a>
          )}
        </section>
      </Container>
    </article>
  );
}
