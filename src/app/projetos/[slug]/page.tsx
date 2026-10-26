import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType, ReactNode, SVGProps } from "react";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Container } from "@/components/ui/Container";
import { DemoFrame } from "@/components/ui/DemoFrame";
import {
  ActivityIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ChipIcon,
  ExternalLinkIcon,
  UserIcon,
} from "@/components/ui/icons";
import { TypeTag } from "@/components/ui/Tag";
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

// Cartão de dado rápido do início do case: ícone, rótulo e valor. Com href, vira âncora.
function InfoCard({
  icon: Icon,
  label,
  href,
  children,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  href?: string;
  children: ReactNode;
}) {
  const body = (
    <>
      <span className="grid size-10 place-items-center rounded-md bg-surface-2 text-ink-muted">
        <Icon width={20} height={20} />
      </span>
      <span className="text-eyebrow mt-4 block uppercase text-ink-subtle">
        {label}
      </span>
      <span className="text-body-sm mt-1 block font-medium md:text-base">
        {children}
      </span>
    </>
  );
  const box =
    "block h-full rounded-lg border border-hairline bg-surface-1 p-4 transition-ui md:p-5";
  return (
    <li>
      {href ? (
        <a
          href={href}
          className={`${box} hover:border-hairline-strong hover:bg-surface-2`}
        >
          {body}
        </a>
      ) : (
        <div className={box}>{body}</div>
      )}
    </li>
  );
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const study = cases[slug];
  if (!project || !study) notFound();

  const extra = study.stack.length - 3;
  const stackSummary =
    study.stack.slice(0, 3).join(", ") + (extra > 0 ? ` +${extra}` : "");

  return (
    <article className="pt-8 md:pt-12">
      <Container>
        <Link
          href="/projetos"
          className="text-body-sm inline-flex min-h-10 items-center gap-2 rounded-md text-ink-subtle hover:text-ink"
        >
          <ArrowLeftIcon />
          Voltar para Projetos
        </Link>

        <header className="mt-6 grid items-start gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <TypeTag type={project.type} />
            <h1 className="text-display-md mt-4">{project.title}</h1>
            <div className="text-body-lg mt-6 flex max-w-2xl flex-col gap-4 text-ink-muted">
              {study.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <ul className="grid grid-cols-2 gap-3 md:gap-4">
            <InfoCard icon={ActivityIcon} label="Status">
              {study.status}
            </InfoCard>
            <InfoCard icon={UserIcon} label="Meu papel">
              {study.role}
            </InfoCard>
            <InfoCard icon={ChipIcon} label="Stack">
              {stackSummary}
            </InfoCard>
            <InfoCard icon={ExternalLinkIcon} label="Demo" href="#demo">
              Ao vivo
            </InfoCard>
          </ul>
        </header>

        <section id="demo" aria-label="Demo" className="mt-12 scroll-mt-20">
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
          className="mt-section-mobile grid gap-8 md:mt-section md:grid-cols-[1fr_2fr] md:gap-12"
        >
          <div>
            <h2 id="tecnica" className="text-headline">
              Camada técnica
            </h2>
            <p className="text-body mt-2 max-w-sm text-ink-muted">
              Para quem quer ver como foi feito.
            </p>
            {study.repoUrl && (
              <a href={study.repoUrl} rel="noopener" className={`${linkClass} mt-6`}>
                Ver o código no GitHub
                <ArrowRightIcon />
              </a>
            )}
          </div>
          <div>
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
        </section>
      </Container>
    </article>
  );
}
