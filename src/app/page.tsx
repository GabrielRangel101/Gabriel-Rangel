import Link from "next/link";
import { HeroStage } from "@/components/home/HeroStage";
import { CaseCard } from "@/components/ui/CaseCard";
import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { FinalCta } from "@/components/ui/FinalCta";
import { Section } from "@/components/ui/Section";
import { ArrowRightIcon } from "@/components/ui/icons";
import { areas } from "@/content/areas";
import { featuredSlugs, publishedProjects } from "@/content/projects";
import { site } from "@/lib/site";

const featured = featuredSlugs
  .map((slug) => publishedProjects.find((project) => project.slug === slug))
  .filter((project) => project !== undefined);

// Números da Home: cada um já está publicado no case para onde aponta.
const numbers = [
  {
    to: 1000000,
    decimals: 0,
    prefix: "",
    suffix: "",
    label: "itens de venda carregados em 83,48 s",
    caseTitle: "Pipeline de ERP",
    slug: "erp-pipeline-varejo",
  },
  {
    to: 53,
    decimals: 0,
    prefix: "",
    suffix: "",
    label: "tabelas com RLS",
    caseTitle: "Gestão para Barbearia",
    slug: "gestao-barbearia",
  },
  {
    to: 8,
    decimals: 0,
    prefix: "",
    suffix: "",
    label: "ferramentas somente leitura no MCP",
    caseTitle: "Radar de Agenda",
    slug: "radar-agenda",
  },
  {
    to: 0.82,
    decimals: 2,
    prefix: "+",
    suffix: " p.p.",
    label: "de conversão, com p = 0,0009",
    caseTitle: "Teste A/B",
    slug: "teste-ab-assinaturas",
  },
];

export default function Home() {
  return (
    <>
      <HeroStage />

      <section aria-labelledby="intro-titulo" className="pt-10 md:pt-14">
        <Container className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-10">
          <div data-reveal>
            <p className="text-eyebrow text-ink-subtle">
              Analista de dados e automação com IA
            </p>
            <h2
              id="intro-titulo"
              className="mt-3 max-w-[22ch] text-balance text-[clamp(24px,3vw,38px)] font-medium leading-[1.15] tracking-[-0.02em]"
            >
              Seus dados viram decisão, sem trabalho manual no meio.
            </h2>
            <p className="text-body-lg mt-4 max-w-[46ch] text-ink-muted">
              Dashboards, sistemas e agentes que tiram o trabalho manual do
              caminho.
            </p>
          </div>
          <ul
            aria-label="Ferramentas principais"
            data-reveal
            className="flex flex-wrap gap-2 lg:justify-end"
          >
            {site.stack.map((tool) => (
              <li
                key={tool}
                className="text-body-sm rounded-full border border-line-soft px-3 py-1 text-ink-muted"
              >
                {tool}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Section id="areas" eyebrow="O que construo" title="Quatro frentes de trabalho.">
        <ul className="border-t border-line-soft">
          {areas.map(({ icon: Icon, title, text, note }) => (
            <li key={title} className="border-b border-line-soft">
              <Link
                href="/servicos"
                className="group grid grid-cols-[40px_1fr] items-baseline gap-x-4 gap-y-2 py-7 transition-[padding,background-color] duration-[400ms] ease-[var(--ease-expressive)] hover:bg-[linear-gradient(90deg,rgb(43_196_207/0.08),transparent)] md:grid-cols-[56px_1fr_1.1fr] md:gap-6 md:hover:pl-4 focus-visible:pl-4"
              >
                <Icon width={22} height={22} className="translate-y-1 text-primary" aria-hidden="true" />
                <h3 className="text-[clamp(22px,2.6vw,36px)] font-normal tracking-[-0.02em]">
                  <span className="roll">
                    <span data-t={title}>{title}</span>
                  </span>
                </h3>
                <p className="text-body col-start-2 max-w-[48ch] text-ink-muted md:col-start-3">
                  {text}
                  {note && <span className="text-body-sm mt-1 block text-ink-subtle">{note}</span>}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="numeros" eyebrow="Números dos cases" title="Quatro números que dá para conferir.">
        <ul className="grid grid-cols-2 border-y border-line-soft lg:grid-cols-4">
          {numbers.map((n, i) => (
            <li
              key={n.slug}
              className={`border-line-soft ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "max-lg:border-b" : ""} lg:border-r lg:last:border-r-0`}
            >
              <Link
                href={`/projetos/${n.slug}`}
                className="group flex h-full flex-col gap-3 p-4 transition-colors duration-300 hover:bg-surface-1 md:p-6"
              >
                <CountUp
                  to={n.to}
                  decimals={n.decimals}
                  prefix={n.prefix}
                  suffix={n.suffix}
                  className="block whitespace-nowrap text-[clamp(28px,3.8vw,56px)] font-light leading-none tracking-[-0.04em] tabular-nums"
                />
                <span className="text-body-sm text-ink-muted">{n.label}</span>
                <span className="text-body-sm mt-auto inline-flex items-center gap-1.5 text-primary">
                  {n.caseTitle}
                  <ArrowRightIcon
                    width={14}
                    height={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="projetos" eyebrow="Projetos em destaque" title="Cases com demo aberta e números conferíveis.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <CaseCard key={project.slug} project={project} lean index={i} />
          ))}
        </div>
        <Link
          href="/projetos"
          className="link-retract text-button mt-10 text-primary"
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
          <Link href="/sobre" className="link-retract text-button mt-6 text-primary">
            Conhecer a trajetória
            <ArrowRightIcon />
          </Link>
        </div>
      </Section>

      <FinalCta
        eyebrow="Contato"
        title="Tem um projeto na sua empresa?"
        primary={{ href: "/contato", label: "Falar sobre o projeto" }}
        secondary={{ href: "/servicos", label: "Ver serviços" }}
      />
    </>
  );
}
