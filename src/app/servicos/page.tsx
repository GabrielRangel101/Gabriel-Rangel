import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ArrowRightIcon } from "@/components/ui/icons";
import { steps } from "@/content/contact";
import { services } from "@/content/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Serviços para empresas",
  description:
    "Dashboards de BI, sistemas web, automações com n8n e IA e dados organizados, prestados pela Rangel Analytics.",
};

export default function ServicesPage() {
  const { company } = site;

  return (
    <>
      <section aria-labelledby="servicos-titulo" className="pt-12 md:pt-20">
        <Container data-reveal>
          <p className="text-eyebrow text-ink-subtle">Serviços para empresas</p>
          <h1
            id="servicos-titulo"
            className="mt-3 max-w-[16ch] text-balance text-[clamp(40px,7vw,96px)] font-light leading-[0.98] tracking-[-0.045em]"
          >
            Dados, sistemas e automação para a sua empresa.
          </h1>
          <p className="text-subhead mt-6 max-w-2xl text-ink-muted">
            {company.name} é o nome sob o qual presto serviços para empresas;
            este portfólio é meu, Gabriel Rangel. Você conversa direto comigo,
            e o trabalho é feito sob contrato, com escopo e prazo definidos
            antes de começar.
          </p>
        </Container>
      </section>

      <Section id="entregas" tight eyebrow="O que entrego" title="Quatro frentes, do dado à decisão.">
        <ul className="border-t border-line-soft">
          {services.map(({ icon: Icon, title, text, items, href }) => (
            <li key={title} className="border-b border-line-soft" data-reveal>
              <article className="group grid gap-x-6 gap-y-3 py-8 transition-[padding,background-color] duration-[400ms] ease-[var(--ease-expressive)] hover:bg-[linear-gradient(90deg,rgb(43_196_207/0.08),transparent)] md:grid-cols-[56px_1fr_1.1fr] md:hover:pl-4">
                <Icon width={24} height={24} className="text-primary md:translate-y-1.5" aria-hidden="true" />
                <div>
                  <h3 className="text-[clamp(24px,2.8vw,38px)] font-normal leading-[1.1] tracking-[-0.02em]">
                    {title}
                  </h3>
                  <p className="text-body mt-2 max-w-[44ch] text-ink-muted">{text}</p>
                </div>
                <div className="flex flex-col gap-4">
                  <ul className="text-body-sm flex list-disc flex-col gap-1.5 pl-5 text-ink-muted marker:text-primary">
                    {items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <Link href={href} className="link-retract text-button self-start text-primary">
                    Ver projetos desse tipo
                    <ArrowRightIcon />
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="processo" eyebrow="Como funciona" title="Em três passos.">
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-[20px] border border-line-soft p-6"
              data-reveal
            >
              <span
                aria-hidden="true"
                className="block text-[clamp(40px,4vw,56px)] font-light leading-none tracking-[-0.04em] text-primary tabular-nums"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-card-title mt-4">{step.title}</h3>
              <p className="text-body-sm mt-1 text-ink-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="contratacao" eyebrow="Contratação" title="Contrato e nota fiscal.">
        <div className="text-body-lg flex max-w-2xl flex-col gap-4 text-ink-muted">
          <p>
            A contratação é por contrato de prestação de serviços, com escopo,
            etapas e prazo definidos na proposta, e a cobrança é feita por nota
            fiscal.
          </p>
          <p>
            O serviço é prestado pela {company.name}
            {company.legalName && ` (${company.legalName})`}
            {company.cnpj && `, CNPJ ${company.cnpj}`}.
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/contato" variant="cta">
            Falar sobre o projeto
          </Button>
          <Button href="/projetos" variant="secondary">
            Ver projetos
          </Button>
        </div>
      </Section>
    </>
  );
}
