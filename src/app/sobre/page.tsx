import type { Metadata } from "next";
import Image from "next/image";
import portrait from "@/assets/gabriel-rangel.jpg";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FinalCta } from "@/components/ui/FinalCta";
import { Section } from "@/components/ui/Section";
import { ExternalLinkIcon } from "@/components/ui/icons";
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

// Trechos entre ** viram negrito: a métrica abre cada item de experiência.
function Highlight({ text }: { text: string }) {
  return text.split("**").map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold text-ink">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

export default function AboutPage() {
  const { github, linkedin } = site.external;

  return (
    <>
      <section aria-labelledby="sobre-titulo" className="pt-12 md:pt-20">
        <Container data-reveal>
          <p className="text-eyebrow text-ink-subtle">Analista de dados e IA</p>
          <h1
            id="sobre-titulo"
            className="mt-3 max-w-[14ch] text-balance text-[clamp(40px,7vw,96px)] font-light leading-[0.98] tracking-[-0.045em]"
          >
            Quem sou e como trabalho
          </h1>
          <p className="text-subhead mt-6 max-w-2xl text-ink-muted">
            Mais de 3 anos em Business Analytics, transformando dados em
            painéis, automações e agentes de IA.
          </p>
        </Container>
      </section>

      <Section id="quem" title="Quem está por trás do portfólio">
        <div className="grid items-start gap-10 lg:grid-cols-[360px_1fr] lg:gap-16">
          <div className="rounded-[20px] border border-line-soft bg-surface-1/60 p-4 lg:sticky lg:top-24">
            <Image
              src={portrait}
              alt="Retrato de Gabriel Rangel"
              sizes="(min-width: 1024px) 360px, 100vw"
              placeholder="blur"
              className="aspect-square w-full rounded-[14px] object-cover"
            />
            <div className="mt-4 px-1">
              <p className="text-card-title">{site.name}</p>
              <p className="text-body-sm mt-1 text-ink-subtle">
                Analista de dados e IA
              </p>
            </div>
            <ul className="text-body-sm mt-4 flex flex-col gap-2 border-t border-line-soft px-1 pt-4 text-ink-muted">
              {aboutFacts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
              {site.email && (
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="rounded-xs text-primary underline"
                  >
                    {site.email}
                  </a>
                </li>
              )}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2 px-1">
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

      <Section id="ferramentas" eyebrow="Ferramentas" title="O que domino e o que já usei.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toolGroups.map((group) => (
            <section
              key={group.title}
              aria-labelledby={`ferr-${group.title}`}
              className="rounded-[20px] border border-line-soft p-6"
              data-reveal
            >
              <h3 id={`ferr-${group.title}`} className="text-card-title">
                {group.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="text-body-sm rounded-full border border-line-soft px-3 py-1.5 text-ink-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Section>

      <Section id="experiencia" eyebrow="Experiência profissional" title="Onde já trabalhei com dados.">
        <ol className="relative max-w-4xl border-l border-line-soft pl-6 md:pl-10">
          {experience.map((job) => (
            <li key={`${job.company}-${job.period}`} className="relative pb-12 last:pb-0" data-reveal>
              <span
                aria-hidden="true"
                className="absolute -left-[31px] top-2 size-3 rounded-full border-2 border-primary bg-canvas md:-left-[47px]"
              />
              <p className="text-body-sm text-ink-subtle">{job.period}</p>
              <h3 className="mt-1 text-[clamp(24px,2.6vw,34px)] font-light tracking-[-0.02em]">
                {job.company}
              </h3>
              <p className="text-body mt-1 text-ink-muted">{job.role}</p>
              <div className="text-body mt-5 text-ink-muted">
                {job.scope && (
                  <p className="text-body-sm mb-3 font-medium text-ink">{job.scope}</p>
                )}
                {job.intro && <p className="mb-4">{job.intro}</p>}
                <ul className="flex list-disc flex-col gap-3 pl-5 marker:text-primary">
                  {job.highlights.map((item) => (
                    <li key={item}>
                      <Highlight text={item} />
                    </li>
                  ))}
                </ul>
                {job.tools && (
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label="Ferramentas">
                    {job.tools.map((tool) => (
                      <li
                        key={tool}
                        className="text-caption rounded-full border border-line-soft px-2.5 py-0.5 text-ink-subtle"
                      >
                        {tool}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="formacao" eyebrow="Formação e cursos" title="Como continuo aprendendo.">
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <div className="rounded-[20px] border border-line-soft p-6" data-reveal>
            <h3 className="text-card-title">{education.degree}</h3>
            <p className="text-body-sm mt-2 text-ink-muted">
              {education.school}
            </p>
            <p className="text-body-sm mt-1 text-ink-subtle">
              {education.status}
            </p>
          </div>
          <p className="text-body-sm self-center text-ink-muted">{courses}</p>
        </div>
      </Section>

      <FinalCta
        title="Quer ver como isso funciona na prática?"
        primary={{ href: "/projetos", label: "Ver projetos" }}
        secondary={{ href: "/contato", label: "Falar comigo" }}
      />
    </>
  );
}
