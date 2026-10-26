import type { Metadata } from "next";
import Image from "next/image";
import portrait from "@/assets/gabriel-rangel.jpg";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Section } from "@/components/ui/Section";
import { ExternalLinkIcon, SparkIcon } from "@/components/ui/icons";
import { areas } from "@/content/areas";
import {
  aboutBio,
  aboutFacts,
  courses,
  education,
  experience,
  toolGroups,
} from "@/content/about";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Gabriel Rangel, analista de dados e automação com IA: quem sou, com o que trabalho e onde já atuei.",
};

const external = { target: "_blank", rel: "noopener" } as const;

export default function AboutPage() {
  const { github, linkedin } = site.external;

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
            Mais de 3 anos em Business Analytics, transformando dados em
            painéis, automações e agentes de IA.
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
            <ul className="text-body-sm mt-4 flex flex-col gap-2 text-ink-muted">
              {aboutFacts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {linkedin && (
                <Button href={linkedin} variant="secondary" {...external}>
                  LinkedIn
                  <ExternalLinkIcon />
                </Button>
              )}
              {github && (
                <Button href={github} variant="secondary" {...external}>
                  GitHub
                  <ExternalLinkIcon />
                </Button>
              )}
            </div>
          </div>

          <div className="text-body-lg flex max-w-2xl flex-col gap-5 text-ink-muted">
            {aboutBio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section id="ferramentas" eyebrow="Ferramentas" title="O que uso no dia a dia.">
        <div className="grid gap-4 sm:grid-cols-2">
          {toolGroups.map((group) => (
            <section
              key={group.title}
              aria-labelledby={`ferr-${group.title}`}
              className="rounded-lg border border-hairline bg-surface-1 p-6"
            >
              <h3 id={`ferr-${group.title}`} className="text-card-title">
                {group.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="text-body-sm rounded-md border border-hairline bg-surface-2 px-3 py-2 text-ink-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
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

      <Section id="experiencia" eyebrow="Experiência profissional" title="Onde já trabalhei com dados.">
        <div className="max-w-4xl">
          <Accordion>
            {experience.map((job) => (
              <AccordionItem
                key={`${job.company}-${job.period}`}
                title={job.company}
                subtitle={job.role}
                meta={job.period}
              >
                {job.scope && (
                  <p className="text-body-sm mb-3 font-medium text-ink">
                    {job.scope}
                  </p>
                )}
                {job.intro && <p className="mb-4">{job.intro}</p>}
                <ul className="flex list-disc flex-col gap-3 pl-5">
                  {job.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {job.tools && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {job.tools.map((tool) => (
                      <li
                        key={tool}
                        className="text-caption rounded-full border border-hairline px-2 py-0.5 text-ink-subtle"
                      >
                        {tool}
                      </li>
                    ))}
                  </ul>
                )}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      <Section id="formacao" eyebrow="Formação e cursos" title="Como continuo aprendendo.">
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <div className="rounded-xl border border-hairline bg-surface-1 p-6">
            <h3 className="text-card-title">{education.degree}</h3>
            <p className="text-body-sm mt-2 text-ink-muted">
              {education.school}
            </p>
            <p className="text-body-sm mt-1 text-ink-subtle">
              {education.status}
            </p>
          </div>
          <dl className="flex flex-col divide-y divide-hairline rounded-xl border border-hairline bg-surface-1">
            {courses.map((course) => (
              <div key={course.area} className="p-5">
                <dt className="text-body-sm font-medium text-ink">
                  {course.area}
                </dt>
                <dd className="text-body-sm mt-1 text-ink-muted">
                  {course.items}
                </dd>
              </div>
            ))}
          </dl>
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
