// Página provisória da etapa 1: confirma tokens, fontes e foco. A Home real entra na etapa 3.
export default function Home() {
  return (
    <main className="mx-auto max-w-content px-4 py-section-mobile md:px-8 md:py-section">
      <p className="text-eyebrow text-ink-subtle">Fundação</p>
      <h1 className="text-display-xl mt-4">Gabriel Rangel</h1>
      <p className="text-body-lg mt-6 max-w-2xl text-ink-muted">
        Analista de dados e automação com IA. Em construção.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href="#"
          className="touch-target text-button transition-ui inline-flex items-center rounded-md bg-primary px-4 text-on-primary hover:bg-primary-hover active:bg-primary-pressed"
        >
          Falar comigo
        </a>
        <a
          href="#"
          className="touch-target text-button transition-ui inline-flex items-center rounded-md border border-hairline bg-surface-1 px-4 text-ink hover:bg-surface-2"
        >
          Ver projetos
        </a>
      </div>
    </main>
  );
}
