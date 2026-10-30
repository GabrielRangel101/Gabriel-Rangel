import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType, ReactNode, SVGProps } from "react";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Container } from "@/components/ui/Container";
import { DemoFrame } from "@/components/ui/DemoFrame";
import {
  ActivityIcon,
  ArrowLeftIcon,
  ChipIcon,
  CheckCircleIcon,
  CheckIcon,
  CodeIcon,
  ExternalLinkIcon,
  PlayIcon,
  UserIcon,
  WrenchIcon,
} from "@/components/ui/icons";
import { Tabs } from "@/components/ui/Tabs";
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

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

// Cartão de dado rápido do início do case: ícone, rótulo e valor.
function InfoCard({
  icon: Icon,
  label,
  children,
}: {
  icon: IconType;
  label: string;
  children: ReactNode;
}) {
  return (
    <li className="rounded-lg border border-hairline bg-surface-1 p-4 md:p-5">
      <span className="grid size-10 place-items-center rounded-md bg-surface-2 text-ink-muted">
        <Icon width={20} height={20} />
      </span>
      <span className="text-eyebrow mt-4 block uppercase text-ink-subtle">
        {label}
      </span>
      <span className="text-body-sm mt-1 block font-medium md:text-base">
        {children}
      </span>
    </li>
  );
}

// Painel da aba Detalhes Técnicos: ícone no título, conteúdo livre.
function PanelCard({
  icon: Icon,
  title,
  children,
}: {
  icon: IconType;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-hairline bg-surface-1 p-6">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-md bg-surface-2 text-ink-muted">
          <Icon width={20} height={20} />
        </span>
        <h2 className="text-card-title">{title}</h2>
      </div>
      <div className="mt-6">{children}</div>
    </section>
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
  const external = { target: "_blank", rel: "noopener" } as const;

  const demoPanel = (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Button href={study.demo.embedUrl} {...external}>
          <ExternalLinkIcon />
          {study.demo.openLabel ?? "Abrir app ao vivo"}
        </Button>
        {study.repoUrl && (
          <Button href={study.repoUrl} variant="secondary" {...external}>
            <CodeIcon />
            Ver código
          </Button>
        )}
        {study.demo.autoUrl && (
          <Button href={study.demo.autoUrl} variant="tertiary" {...external}>
            <PlayIcon />
            Demo automático (cerca de 45 s)
          </Button>
        )}
      </div>

      <div className="mt-6">
        <DemoFrame
          fallbackHref={study.demo.embedUrl}
          fallbackLabel="Abrir o dashboard em nova aba"
          badgeLabel={study.demo.dataLabel}
        >
          <iframe
            src={study.demo.embedUrl}
            title={study.demo.title}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            style={study.demo.ratio ? { aspectRatio: study.demo.ratio } : undefined}
            className={`w-full bg-surface-2 ${
              study.demo.ratio
                ? "h-[70dvh] min-h-[420px] md:h-auto md:min-h-0"
                : "h-[70dvh] min-h-[520px] md:h-auto md:aspect-[16/10]"
            }`}
          />
        </DemoFrame>
      </div>

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

      {study.testimonial && (
        <figure className="mt-section-mobile rounded-xl border border-hairline bg-surface-1 p-6 md:mt-section">
          <blockquote className="text-body text-ink">
            “{study.testimonial.quote}”
          </blockquote>
          <figcaption className="text-body-sm mt-4 text-ink-subtle">
            {study.testimonial.author}
          </figcaption>
        </figure>
      )}
    </>
  );

  const techPanel = (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <PanelCard icon={CheckCircleIcon} title="Destaques">
          <ul className="text-body-sm flex flex-col gap-4 text-ink-muted">
            {study.highlights.map((item) => (
              <li key={item} className="flex gap-3">
                <CheckIcon className="mt-0.5 shrink-0 text-success" />
                {item}
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard icon={ChipIcon} title="Tecnologias utilizadas">
          <ul className="flex flex-wrap gap-2">
            {study.stack.map((tool) => (
              <li
                key={tool}
                className="text-body-sm rounded-md border border-hairline bg-surface-2 px-3 py-2 text-ink-muted"
              >
                {tool}
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-hairline pt-6">
            <h3 className="text-body-sm font-semibold">Meu papel</h3>
            <p className="text-body-sm mt-1 text-ink-muted">{study.role}</p>
          </div>
        </PanelCard>
      </div>

      <div className="mt-12 max-w-3xl">
        <h2 className="text-headline">Como foi feito</h2>
        <div className="mt-6">
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
      </div>
    </>
  );

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
            <InfoCard icon={ExternalLinkIcon} label="Demo">
              Ao vivo
            </InfoCard>
          </ul>
        </header>

        <div className="mt-12 md:mt-16">
          <Tabs
            label="Seções do projeto"
            tabs={[
              {
                id: "demo",
                label: "Demonstração",
                icon: <PlayIcon />,
                panel: demoPanel,
              },
              {
                id: "tecnico",
                label: "Detalhes Técnicos",
                icon: <WrenchIcon />,
                panel: techPanel,
              },
            ]}
          />
        </div>
      </Container>
    </article>
  );
}
