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
import { ArrowRightIcon } from "@/components/ui/icons";
import { areas } from "@/content/areas";
import { cases } from "@/content/cases";
import { featuredSlugs, publishedProjects } from "@/content/projects";
import { site } from "@/lib/site";

const featured = featuredSlugs
  .map((slug) => publishedProjects.find((project) => project.slug === slug))
  .filter((project) => project !== undefined);

export default function Home() {
  return (
    <>
      <section
        aria-labelledby="hero-titulo"
        className="bg-linear-to-b from-hero-top via-hero-mid to-canvas pb-10 pt-12 md:pb-12 md:pt-20"
      >
        <Container className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div>
            <Image
              src={portrait}
              alt="Retrato de Gabriel Rangel"
              width={56}
              height={56}
              priority
              placeholder="blur"
              className="size-14 rounded-full border border-hairline-strong object-cover object-[50%_25%]"
            />
            <h1 id="hero-titulo" className="text-display-lg mt-6 max-w-3xl">
              {site.name},{" "}
              <span className="text-accent-gradient">
                analista de dados e automação com IA.
              </span>
            </h1>
            <p className="text-headline mt-6 max-w-2xl text-ink">
              Seus dados viram decisão, sem trabalho manual no meio.
            </p>
            <p className="text-body-lg mt-4 max-w-2xl text-ink-muted">
              Dashboards, sistemas e agentes que tiram o trabalho manual do
              caminho.
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
              <Button href="/projetos">Ver projetos</Button>
              <Button href="/servicos" variant="secondary">
                Serviços para empresas
              </Button>
            </div>
          </div>
          <div className="max-lg:hidden">
            <DemoFrame
              fallbackHref={cases["gazeta-meridiano"].demo!.embedUrl}
              fallbackLabel="Abrir o dashboard em nova aba"
            >
              <ScaledFrame
                src={cases["gazeta-meridiano"].demo!.embedUrl}
                title={cases["gazeta-meridiano"].demo!.title}
              />
            </DemoFrame>
          </div>
        </Container>
      </section>

      <Section
        id="areas"
        tight
        eyebrow="O que construo"
        title="Quatro frentes de trabalho."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {areas.map(({ icon, title, text, note }) => (
            <FeatureCard key={title} icon={icon} title={title} note={note}>
              {text}
            </FeatureCard>
          ))}
        </div>
      </Section>

      <Section
        id="projetos"
        eyebrow="Projetos em destaque"
        title="Cases com demo aberta e números conferíveis."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <CaseCard key={project.slug} project={project} lean />
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

      <Section id="sobre" eyebrow="Sobre" title="Quem está por trás.">
        <div className="max-w-2xl">
          <p className="text-body-lg text-ink-muted">
            Sou analista de dados e automação com IA. Construo dashboards,
            sistemas e agentes que tiram o trabalho manual do caminho. Mostro o
            trabalho em cases com demo, dados à mostra e o que cada um não
            prova.
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
          <CtaBanner title="Tem um projeto na sua empresa?">
            <Button href="/servicos">Ver serviços</Button>
            <Button href="/contato" variant="cta">
              Falar sobre o projeto
            </Button>
          </CtaBanner>
        </Container>
      </section>
    </>
  );
}
