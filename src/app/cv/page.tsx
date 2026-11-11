import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ExternalLinkIcon } from "@/components/ui/icons";
import { aboutFacts, experience } from "@/content/about";
import { site } from "@/lib/site";

// Link enviado só nas candidaturas: fora do menu, do rodapé e do sitemap, e sem indexação.
export const metadata: Metadata = {
  title: "Currículo",
  robots: { index: false, follow: false },
};

const external = { target: "_blank", rel: "noopener" } as const;

export default function CvPage() {
  const current = experience[0];

  return (
    <section aria-labelledby="cv-titulo" className="pt-12 md:pt-20">
      <Container className="max-w-3xl">
        <p className="text-eyebrow text-ink-subtle">Currículo</p>
        <h1 id="cv-titulo" className="text-display-md mt-3">
          {site.name}
        </h1>
        <p className="text-subhead mt-2 text-ink-muted">
          Analista de dados e automação com IA
        </p>

        <ul className="text-body-sm mt-6 flex flex-wrap gap-2 text-ink-muted">
          {aboutFacts.map((fact) => (
            <li
              key={fact}
              className="rounded-full border border-hairline px-3 py-1"
            >
              {fact}
            </li>
          ))}
        </ul>

        <div className="text-body-lg mt-8 flex flex-col gap-4 text-ink-muted">
          <p>
            Trabalho com Looker Studio, Power BI, BigQuery, SQL e Python para
            transformar dados em painéis que respondem à pergunta do negócio, e
            automatizo o trabalho repetitivo com Power Automate, n8n e a API do
            Claude.
          </p>
          <p>
            Hoje atuo como {current.role} no {current.company}, no time de
            Business Analytics. Também atendo clientes do varejo por conta
            própria desde 06/2023.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {site.cvPdf ? (
            <Button href={site.cvPdf} download>
              Baixar o currículo em PDF
            </Button>
          ) : (
            <span
              aria-disabled="true"
              className="text-button inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-md border border-hairline px-5 text-ink-disabled"
            >
              Baixar o currículo em PDF (em breve)
            </span>
          )}
          <Button href="/sobre" variant="secondary">
            Ver trajetória completa
          </Button>
          <Button href="/projetos" variant="secondary">
            Ver projetos
          </Button>
        </div>

        {site.external.linkedin && (
          <p className="text-body-sm mt-6 text-ink-muted">
            LinkedIn:{" "}
            <a
              href={site.external.linkedin}
              {...external}
              className="inline-flex items-center gap-1 text-primary underline"
            >
              gabriel-rangel
              <ExternalLinkIcon />
            </a>
          </p>
        )}
      </Container>
    </section>
  );
}
