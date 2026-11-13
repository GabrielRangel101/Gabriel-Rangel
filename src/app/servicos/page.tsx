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
        <Container>
          <p className="text-eyebrow text-ink-subtle">Serviços para empresas</p>
          <h1 id="servicos-titulo" className="text-display-lg mt-3 max-w-4xl">
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
        <div className="grid gap-4 md:grid-cols-2">
          {services.map(({ icon: Icon, title, text, items, href }) => (
            <article
              key={title}
              className="flex flex-col rounded-lg border border-hairline bg-surface-1 p-6"
            >
              <Icon width={24} height={24} className="text-ink-muted" />
              <h3 className="text-card-title mt-4">{title}</h3>
              <p className="text-body-sm mt-2 text-ink-muted">{text}</p>
              <ul className="text-body-sm mt-4 flex list-disc flex-col gap-1.5 pl-5 text-ink-muted">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link
                href={href}
                className="text-button mt-auto inline-flex min-h-10 items-center gap-2 pt-4 text-primary"
              >
                Ver projetos desse tipo
                <ArrowRightIcon />
              </Link>
            </article>
          ))}
        </div>
      </Section>

      <Section id="processo" eyebrow="Como funciona" title="Em três passos.">
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-lg border border-hairline bg-surface-1 p-5"
            >
              <span
                aria-hidden="true"
                className="text-card-title grid size-10 place-items-center rounded-md bg-surface-2 text-ink-muted"
              >
                {index + 1}
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
