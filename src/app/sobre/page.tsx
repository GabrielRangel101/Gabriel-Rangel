import type { Metadata } from "next";
import Image from "next/image";
import portrait from "@/assets/gabriel-rangel.jpg";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Section } from "@/components/ui/Section";
import { SparkIcon } from "@/components/ui/icons";
import { areas, tools } from "@/content/areas";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Gabriel Rangel, analista de dados e automação com IA: quem sou, como trabalho e com o que trabalho.",
};

export default function AboutPage() {
  return (
    <>
      <section
        aria-labelledby="sobre-titulo"
        className="pt-16 text-center md:pt-24"
      >
        <Container>
          <p className="text-button inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-surface-1 px-4 py-2 text-ink">
            <SparkIcon className="text-ink-muted" />
            Analista de dados e IA
          </p>
          <h1
            id="sobre-titulo"
            className="text-display-lg mx-auto mt-6 max-w-4xl"
          >
            Quem sou e como trabalho
          </h1>
          <p className="text-subhead mx-auto mt-6 max-w-2xl text-ink-muted">
            Transformo dados em painéis, sistemas e agentes que tiram o
            trabalho manual do caminho.
          </p>
        </Container>
      </section>

      <Section id="quem" title="Quem está por trás do portfólio">
        <div className="grid items-start gap-10 lg:grid-cols-[360px_1fr] lg:gap-16">
          <div>
            <Image
              src={portrait}
              alt="Retrato de Gabriel Rangel"
              sizes="(min-width: 1024px) 360px, 100vw"
              placeholder="blur"
              className="aspect-square w-full max-w-sm rounded-xl border border-hairline object-cover"
            />
            <div className="mt-4">
              <p className="text-card-title">{site.name}</p>
              <p className="text-body-sm mt-1 text-ink-subtle">
                Analista de dados e IA
              </p>
            </div>
          </div>

          <div className="text-body-lg flex max-w-2xl flex-col gap-5 text-ink-muted">
            <p>
              Sou {site.name}, analista de dados e automação com IA. Construo
              dashboards, sistemas e agentes que tiram o trabalho manual do
              caminho.
            </p>
            <p>
              Gosto de mostrar o trabalho funcionando: cada projeto aqui tem uma
              demo que você pode abrir e testar, com dados sintéticos.
            </p>
            <p>
              Meu jeito de trabalhar é direto e prático: resultado antes de
              tecnologia, e cada passo explicado sem jargão.
            </p>
          </div>
        </div>
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

      <Section id="ajuda" eyebrow="Em que posso ajudar" title="Do dado bruto à decisão.">
        <div className="grid gap-4 sm:grid-cols-2">
          {areas.map(({ icon, title, text }) => (
            <FeatureCard key={title} icon={icon} title={title}>
              {text}
            </FeatureCard>
          ))}
        </div>
      </Section>

      <section
        aria-label="Próximos passos"
        className="mt-section-mobile md:mt-section"
      >
        <Container>
          <CtaBanner title="Quer ver como isso funciona na prática?">
            <Button href="/projetos">Ver projetos</Button>
            <Button href="/contato" variant="secondary">
              Falar comigo
            </Button>
          </CtaBanner>
        </Container>
      </section>
    </>
  );
}
