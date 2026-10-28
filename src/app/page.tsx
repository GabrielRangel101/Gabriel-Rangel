import Image from "next/image";
import Link from "next/link";
import portrait from "@/assets/gabriel-rangel.jpg";
import { Button } from "@/components/ui/Button";
import { CaseCard } from "@/components/ui/CaseCard";
import { Container } from "@/components/ui/Container";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { DemoFrame } from "@/components/ui/DemoFrame";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { ScaledFrame } from "@/components/ui/ScaledFrame";
import { Section } from "@/components/ui/Section";
import { ArrowRightIcon, SparkIcon } from "@/components/ui/icons";
import { areas, tools } from "@/content/areas";
import { cases } from "@/content/cases";
import { publishedProjects } from "@/content/projects";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <section
        aria-labelledby="hero-titulo"
        className="bg-linear-to-b from-hero-top via-hero-mid to-canvas pb-16 pt-16 md:pb-20 md:pt-24"
      >
        <Container className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src={portrait}
                alt="Retrato de Gabriel Rangel"
                width={48}
                height={48}
                priority
                placeholder="blur"
                className="size-12 rounded-full border border-hairline-strong object-cover object-[50%_25%]"
              />
              <div>
                <p className="text-body-sm font-semibold text-ink">
                  {site.name}
                </p>
                <p className="text-body-sm text-ink-muted">
                  Analista de dados e IA
                </p>
              </div>
            </div>
            <h1 id="hero-titulo" className="text-display-xl mt-6">
              Seus dados viram decisão,{" "}
              <span className="text-accent-gradient">
                sem trabalho manual no meio.
              </span>
            </h1>
            <p className="text-body-lg mt-6 max-w-2xl text-ink-muted">
              {site.tagline}
            </p>
            <ul
              aria-label="Ferramentas principais"
              className="mt-6 flex flex-wrap gap-2"
            >
              {site.stack.map((tool) => (
                <li
                  key={tool}
                  className="text-body-sm rounded-md border border-hairline-strong bg-surface-1/60 px-3 py-1 text-ink"
                >
                  {tool}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/contato" variant="cta">
                Falar comigo
              </Button>
              <Button href="/projetos" variant="secondary">
                Ver projetos
              </Button>
              {site.cv && (
                <Button href={site.cv} variant="secondary" download>
                  Baixar CV
                </Button>
              )}
            </div>
          </div>
          <div className="max-lg:hidden">
            <DemoFrame
              fallbackHref={cases["gazeta-meridiano"].demo.embedUrl}
              fallbackLabel="Abrir o dashboard em nova aba"
            >
              <ScaledFrame
                src={cases["gazeta-meridiano"].demo.embedUrl}
                title={cases["gazeta-meridiano"].demo.title}
              />
            </DemoFrame>
          </div>
        </Container>
      </section>

      <Section id="areas" eyebrow="O que construo" title="Quatro frentes de trabalho.">
        <div className="grid gap-4 sm:grid-cols-2">
          {areas.map(({ icon, title, text, note }) => (
            <FeatureCard key={title} icon={icon} title={title} note={note}>
              {text}
            </FeatureCard>
          ))}
        </div>
      </Section>

      <Section id="projetos" eyebrow="Projetos em destaque" title="Demos reais, para abrir e testar.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {publishedProjects.map((project) => (
            <CaseCard key={project.slug} project={project} />
          ))}
        </div>
        <Link
          href="/projetos"
          className="text-button mt-8 inline-flex min-h-10 items-center gap-2 rounded-md text-primary"
        >
          Ver todos os projetos
          <ArrowRightIcon />
        </Link>
      </Section>

      <Section id="demo" eyebrow="Demo rápida" title="Pergunte ao painel, em português.">
        <DemoFrame
          fallbackHref="/projetos/gazeta-meridiano"
          fallbackLabel="Ver o case Gazeta Meridiano"
        >
          <div className="flex flex-col items-start gap-4 bg-surface-2 p-6 md:p-12">
            <SparkIcon width={24} height={24} className="text-ink-muted" />
            <h3 className="text-card-title">Mesa de análise (Modo IA)</h3>
            <p className="text-body max-w-xl text-ink-muted">
              Em vez de montar filtros, você escreve a pergunta. A IA escolhe a
              análise e redige a resposta; os números vêm de um motor de
              métricas testado.
            </p>
          </div>
        </DemoFrame>
      </Section>

      <Section id="ferramentas" eyebrow="Ferramentas" title="O que uso no dia a dia.">
        <ul className="flex flex-wrap gap-2">
          {tools.map((tool) => (
            <li
              key={tool}
              className="text-body-sm rounded-md border border-hairline bg-surface-1 px-3 py-2 text-ink-muted"
            >
              {tool}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="sobre" eyebrow="Sobre" title="Quem está por trás.">
        <div className="max-w-2xl">
          <p className="text-body-lg text-ink-muted">
            Sou analista de dados e automação com IA. Construo dashboards,
            sistemas e agentes que tiram o trabalho manual do caminho. Mostro o
            trabalho em demos que você pode abrir e testar.
          </p>
          <Link
            href="/sobre"
            className="text-button mt-6 inline-flex min-h-10 items-center gap-2 rounded-md text-primary"
          >
            Conhecer a trajetória
            <ArrowRightIcon />
          </Link>
        </div>
      </Section>

      <section aria-label="Próximos passos" className="mt-section-mobile md:mt-section">
        <Container>
          <CtaBanner title="Vamos conversar sobre o que você precisa.">
            <Button href="/contato" variant="cta">
              Quero contratar
            </Button>
            <Button href="/sobre" variant="secondary">
              Sou recrutador
            </Button>
          </CtaBanner>
        </Container>
      </section>
    </>
  );
}
