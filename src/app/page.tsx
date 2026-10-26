import Image from "next/image";
import Link from "next/link";
import portrait from "@/assets/gabriel-rangel.jpg";
import { Button } from "@/components/ui/Button";
import { CaseCard } from "@/components/ui/CaseCard";
import { Container } from "@/components/ui/Container";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { DemoFrame } from "@/components/ui/DemoFrame";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Section } from "@/components/ui/Section";
import {
  ArrowRightIcon,
  BarChartIcon,
  DatabaseIcon,
  LayersIcon,
  SparkIcon,
  WorkflowIcon,
} from "@/components/ui/icons";
import { cases } from "@/content/cases";
import { projects } from "@/content/projects";
import { site } from "@/lib/site";

const areas = [
  {
    icon: BarChartIcon,
    title: "Dashboards de BI",
    text: "Painéis em Power BI e Looker que respondem à pergunta do negócio.",
  },
  {
    icon: LayersIcon,
    title: "Sistemas web",
    text: "Sistemas sob medida para trocar planilha por um fluxo que funciona.",
  },
  {
    icon: WorkflowIcon,
    title: "Agentes e automações",
    text: "Fluxos em n8n e agentes de IA que assumem o trabalho repetitivo.",
  },
  {
    icon: DatabaseIcon,
    title: "Dados organizados",
    text: "Modelagem e SQL para ter uma fonte confiável por trás de cada número.",
  },
];

const tools = [
  "Power BI",
  "Looker",
  "SQL",
  "Python",
  "n8n",
  "Supabase",
  "Claude API",
];

export default function Home() {
  return (
    <>
      <section aria-labelledby="hero-titulo" className="pt-16 md:pt-24">
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
                <p className="text-body-sm font-semibold text-ink">Portfólio</p>
                <p className="text-body-sm text-ink-subtle">
                  Dados, automação e IA
                </p>
              </div>
            </div>
            <h1 id="hero-titulo" className="text-display-xl mt-6">
              {site.name}
            </h1>
            <p className="text-body-lg mt-6 max-w-2xl text-ink-muted">
              {site.tagline}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/projetos">Ver projetos</Button>
              <Button href="/contato" variant="secondary">
                Falar comigo
              </Button>
            </div>
          </div>
          <div className="max-lg:hidden">
            <DemoFrame
              fallbackHref={cases["gazeta-meridiano"].demo.embedUrl}
              fallbackLabel="Abrir o dashboard em nova aba"
            >
              <iframe
                src={cases["gazeta-meridiano"].demo.embedUrl}
                title={cases["gazeta-meridiano"].demo.title}
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                className="aspect-[4/3] w-full bg-surface-2"
              />
            </DemoFrame>
          </div>
        </Container>
      </section>

      <Section id="areas" eyebrow="O que construo" title="Do dado bruto à decisão, sem trabalho manual no meio.">
        <div className="grid gap-4 sm:grid-cols-2">
          {areas.map(({ icon, title, text }) => (
            <FeatureCard key={title} icon={icon} title={title}>
              {text}
            </FeatureCard>
          ))}
        </div>
      </Section>

      <Section id="projetos" eyebrow="Projetos em destaque" title="Demos reais, com dados sintéticos.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
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
            <Button href="/servicos">Quero contratar</Button>
            <Button href="/vagas" variant="secondary">
              Sou recrutador
            </Button>
          </CtaBanner>
        </Container>
      </section>
    </>
  );
}
