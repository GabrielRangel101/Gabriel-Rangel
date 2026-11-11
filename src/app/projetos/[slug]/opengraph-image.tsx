import { ImageResponse } from "next/og";
import { caseTypes } from "@/components/ui/Tag";
import { cases } from "@/content/cases";
import { projects } from "@/content/projects";
import { site } from "@/lib/site";

// Cartao de compartilhamento de CADA case. Sem isto, LinkedIn e WhatsApp
// mostram o cartao do site inteiro ("Analista de Dados e IA") em todo link,
// e quem recebe nao sabe qual projeto esta sendo compartilhado.
//
// Por que um cartao desenhado e nao a captura de tela do case: no tamanho em
// que a previa aparece no feed, um dashboard inteiro vira borrao. Nome do
// projeto e resultado em uma linha ainda se leem.

export const alt = "Cartão do case no portfólio de Gabriel Rangel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.filter((p) => p.slug in cases).map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  const titulo = project?.title ?? site.name;
  const linha = project?.headline ?? site.tagline;
  const tipo = project ? caseTypes[project.type].label : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#07131a",
          backgroundImage:
            "linear-gradient(135deg, #0f4a57 0%, #0b2e39 42%, #07131a 100%)",
          color: "#f2f8f9",
          fontFamily: "sans-serif",
          padding: "68px 76px",
          justifyContent: "space-between",
        }}
      >
        {/* Etiquetas: tipo do case e aviso de dado sintetico */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {tipo ? (
            <span
              style={{
                display: "flex",
                fontSize: 26,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#2bc4cf",
                border: "2px solid #2bc4cf",
                borderRadius: 999,
                padding: "8px 22px",
                marginRight: 18,
              }}
            >
              {tipo}
            </span>
          ) : null}
          {project?.synthetic ? (
            <span
              style={{
                display: "flex",
                fontSize: 26,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#8fa6ae",
                border: "2px solid #2a4756",
                borderRadius: 999,
                padding: "8px 22px",
              }}
            >
              Dados sintéticos
            </span>
          ) : null}
        </div>

        {/* Nome do projeto e a linha de resultado */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: titulo.length > 26 ? 74 : 88,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -1.5,
            }}
          >
            {titulo}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 38,
              lineHeight: 1.3,
              color: "#c5d4d9",
            }}
          >
            {linha}
          </div>
        </div>

        {/* Assinatura */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid #1d3541",
            paddingTop: 28,
            fontSize: 28,
          }}
        >
          <span style={{ display: "flex", fontWeight: 600 }}>{site.name}</span>
          <span style={{ display: "flex", color: "#8fa6ae" }}>
            Analista de Dados e IA
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
