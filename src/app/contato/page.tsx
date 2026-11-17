import type { Metadata } from "next";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ExternalLinkIcon } from "@/components/ui/icons";
import { faq } from "@/content/contact";
import { site } from "@/lib/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com Gabriel Rangel sobre os projetos, dados ou qualquer outro assunto.",
};

const channelClass =
  "spotlight relative flex min-h-14 flex-col justify-center overflow-hidden rounded-[16px] border border-line-soft px-5 py-3 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/45";

export default function ContactPage() {
  const { linkedin, github } = site.external;

  return (
    <>
      <section aria-labelledby="contato-titulo" className="pt-12 md:pt-20">
        <Container data-reveal>
          <p className="text-eyebrow text-ink-subtle">Contato</p>
          <h1
            id="contato-titulo"
            className="mt-3 max-w-4xl text-[clamp(40px,7vw,96px)] font-light leading-[0.98] tracking-[-0.045em]"
          >
            Fale comigo
          </h1>
          <p className="text-subhead mt-6 max-w-2xl text-ink-muted">
            Para trocar uma ideia sobre os projetos, sobre dados ou outro
            assunto, escreva pelo formulário ou pelos canais ao lado.
          </p>
        </Container>
      </section>

      <section aria-label="Canais e formulário" className="mt-10 md:mt-14">
        <Container className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="text-card-title">Canais diretos</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {site.email && (
                <li>
                  <a href={`mailto:${site.email}`} className={channelClass}>
                    <span className="text-eyebrow text-ink-subtle uppercase">
                      E-mail
                    </span>
                    <span className="text-body mt-1 break-all font-medium text-ink">
                      {site.email}
                    </span>
                  </a>
                </li>
              )}
              {linkedin && (
                <li>
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener"
                    className={channelClass}
                  >
                    <span className="text-eyebrow text-ink-subtle uppercase">
                      LinkedIn
                    </span>
                    <span className="text-body mt-1 inline-flex items-center gap-2 font-medium text-ink">
                      linkedin.com/in/gabriel-rangel
                      <ExternalLinkIcon />
                    </span>
                  </a>
                </li>
              )}
              {github && (
                <li>
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener"
                    className={channelClass}
                  >
                    <span className="text-eyebrow text-ink-subtle uppercase">
                      GitHub
                    </span>
                    <span className="text-body mt-1 inline-flex items-center gap-2 font-medium text-ink">
                      github.com/GabrielRangel101
                      <ExternalLinkIcon />
                    </span>
                  </a>
                </li>
              )}
            </ul>
          </div>

          <ContactForm linkedin={linkedin} />
        </Container>
      </section>

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
