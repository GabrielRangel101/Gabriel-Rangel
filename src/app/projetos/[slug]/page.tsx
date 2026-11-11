import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType, ReactNode, SVGProps } from "react";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Container } from "@/components/ui/Container";
import { DemoFrame } from "@/components/ui/DemoFrame";
import { EmbedFrame } from "@/components/ui/EmbedFrame";
import {
  ActivityIcon,
  ArrowLeftIcon,
  ChipIcon,
  CheckCircleIcon,
  CheckIcon,
  CodeIcon,
  DatabaseIcon,
  ExternalLinkIcon,
  PlayIcon,
  UserIcon,
  WrenchIcon,
} from "@/components/ui/icons";
import { Tabs } from "@/components/ui/Tabs";
import { TypeTag } from "@/components/ui/Tag";
import { cases } from "@/content/cases";
import { projects } from "@/content/projects";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.filter((p) => p.slug in cases).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project || !(slug in cases)) return {};

  // openGraph e twitter precisam ser escritos aqui. O Next so herda os do
  // layout quando a pagina nao declara os seus, e o do layout fala do site
  // inteiro: sem isto, todo case compartilhado aparece como "Analista de
  // Dados e IA". A imagem vem de opengraph-image.tsx, nesta mesma pasta.
  const url = `/projetos/${slug}`;
  const title = `${project.title} | ${site.name}`;

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "pt_BR",
      siteName: site.name,
      url,
      title,
      description: project.summary,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.summary,
    },
  };
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
    <li className="rounded-lg border border-hairline bg-surface-1 p-3">
      <span className="flex items-center gap-2 text-ink-subtle">
        <Icon width={16} height={16} />
        <span className="text-eyebrow uppercase">{label}</span>
      </span>
      <span className="text-body-sm mt-1.5 block font-medium">{children}</span>
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

  const external = { target: "_blank", rel: "noopener" } as const;
  const demo = study.demo;
  const isPowerBi = demo?.embedUrl.includes("app.powerbi.com") ?? false;

  const demoPanel = (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {demo && (
          <Button href={demo.embedUrl} {...external}>
            <ExternalLinkIcon />
            {demo.openLabel ?? "Abrir app ao vivo"}
          </Button>
        )}
        {study.repoUrl && (
          <Button
            href={study.repoUrl}
            variant={demo ? "secondary" : "primary"}
            {...external}
          >
            <CodeIcon />
            Ver código no GitHub
          </Button>
        )}
        {demo?.links?.map((link) => (
          <Button key={link.href} href={link.href} variant="secondary" {...external}>
            <ExternalLinkIcon />
            {link.label}
          </Button>
        ))}
        {demo?.autoUrl && (
          <Button href={demo.autoUrl} variant="tertiary" {...external}>
            <PlayIcon />
            Demo automático (cerca de 45 s)
          </Button>
        )}
      </div>

      <div className="mt-6">
        {demo ? (
          <DemoFrame
            fallbackHref={demo.embedUrl}
            fallbackLabel="Abrir o dashboard em nova aba"
            badgeLabel={demo.dataLabel}
          >
            <EmbedFrame
              src={demo.embedUrl}
              title={demo.title}
              ratio={demo.ratio}
              baseWidth={isPowerBi ? 1310 : undefined}
              baseHeight={isPowerBi ? 810 : undefined}
              settleMs={isPowerBi ? 2500 : 0}
            />
          </DemoFrame>
        ) : (
          study.diagram && (
            <figure className="rounded-xl border border-hairline bg-surface-1 p-4">
              <div className="overflow-hidden rounded-md bg-white">
                <Image
                  src={study.diagram.src}
                  alt={study.diagram.alt}
                  width={1220}
                  height={500}
                  unoptimized
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="text-body-sm mt-3 text-ink-subtle">
                Arquitetura do pipeline. O código, os testes e o CI estão no
                repositório público.
              </figcaption>
            </figure>
          )
        )}
      </div>

      <div className="text-body-lg mt-10 flex max-w-3xl flex-col gap-4 text-ink-muted">
        {study.description.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-8">
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
            {study.resultLabel}
          </h2>
          <ul className="text-body mt-3 flex flex-col gap-3 text-ink-muted">
            {study.result.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <aside
        aria-labelledby="impacto"
        className="mt-10 rounded-lg border border-dashed border-hairline-strong p-5"
      >
        <h2 id="impacto" className="text-eyebrow text-ink-subtle">
          Impacto real
        </h2>
        {study.impact && study.impact.length > 0 ? (
          <ul className="text-body mt-3 flex flex-col gap-3 text-ink">
            {study.impact.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-body-sm mt-2 text-ink-muted">
            {study.impactNote ??
              (study.resultLabel === "O que foi entregue"
              ? "Sem métrica de impacto medida em cliente. O que está acima descreve o que foi construído, não ganho de negócio."
              : "Sem métrica de impacto medida em cliente. Os números acima mostram o que o projeto faz com dados de exemplo e não são resultado de negócio.")}
          </p>
        )}
      </aside>

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

        <header className="mt-4">
          <TypeTag type={project.type} />
          <h1 className="text-display-md mt-3">{project.title}</h1>
          <p className="text-body mt-2 max-w-3xl text-ink-muted">
            {project.summary}
          </p>

          <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-[1fr_1fr_1.4fr_1.8fr]">
            <InfoCard icon={DatabaseIcon} label="Tipo de dado">
              {study.dataKind}
            </InfoCard>
            {study.period && (
              <InfoCard icon={ActivityIcon} label="Período">
                {study.period}
              </InfoCard>
            )}
            <InfoCard icon={UserIcon} label="Meu papel">
              {study.role}
            </InfoCard>
            <InfoCard icon={ChipIcon} label="Stack completa">
              {study.stack.join(", ")}
            </InfoCard>
          </ul>
        </header>

        <div className="mt-5 md:mt-6">
          <Tabs
            label="Seções do projeto"
            tabs={[
              {
                id: "demo",
                label: demo ? "Demonstração" : "Arquitetura",
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
