import type { Metadata } from "next";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Section } from "@/components/ui/Section";
import { ExternalLinkIcon, SparkIcon } from "@/components/ui/icons";
import { areas } from "@/content/areas";
import { faq, steps } from "@/content/contact";
import { site } from "@/lib/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com Gabriel Rangel sobre dashboards, sistemas, automações e agentes de IA para o seu negócio.",
};

const external = { target: "_blank", rel: "noopener" } as const;

export default function ContactPage() {
  const { linkedin, github } = site.external;

  return (
    <>
      <section
        aria-labelledby="contato-titulo"
        className="pt-16 text-center md:pt-24"
      >
        <Container>
          <p className="text-button inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-surface-1 px-4 py-2 text-ink">
            <SparkIcon className="text-ink-muted" />
            Contato
          </p>
          <h1
            id="contato-titulo"
            className="text-display-lg mx-auto mt-6 max-w-4xl"
          >
            Vamos conversar sobre o seu projeto
          </h1>
          <p className="text-subhead mx-auto mt-6 max-w-2xl text-ink-muted">
            Dashboards, sistemas, automações e agentes de IA. Conte o que hoje
            é manual ou o que você quer enxergar nos seus números.
          </p>
        </Container>
      </section>

      <section
        aria-label="Como funciona e formulário"
        className="mt-section-mobile md:mt-section"
      >
        <Container className="grid items-start gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <p className="text-eyebrow text-ink-subtle">Como funciona</p>
            <h2 className="text-display-md mt-3">Em três passos.</h2>
            <ol className="mt-8 flex flex-col gap-4">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className="flex gap-4 rounded-lg border border-hairline bg-surface-1 p-5"
                >
                  <span
                    aria-hidden="true"
                    className="text-card-title grid size-10 shrink-0 place-items-center rounded-md bg-surface-2 text-ink-muted"
                  >
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-card-title">{step.title}</h3>
                    <p className="text-body-sm mt-1 text-ink-muted">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            {(linkedin || github) && (
              <div className="mt-8">
                <p className="text-body-sm text-ink-muted">
                  Prefere outro canal? Me chame por aqui:
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
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
            )}
          </div>

          <ContactForm linkedin={linkedin} />
        </Container>
      </section>

      <Section id="oferta" eyebrow="O que posso fazer por você" title="Do dado bruto à decisão.">
        <div className="grid gap-4 sm:grid-cols-2">
          {areas.map(({ icon, title, text }) => (
            <FeatureCard key={title} icon={icon} title={title}>
              {text}
            </FeatureCard>
          ))}
        </div>
      </Section>

      <Section id="faq" eyebrow="Perguntas frequentes" title="O que costumam me perguntar.">
        <div className="max-w-3xl">
          <Accordion>
            {faq.map((item) => (
              <AccordionItem key={item.question} title={item.question}>
                {item.answer}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>
    </>
  );
}
