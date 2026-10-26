import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { TextArea, TextField } from "@/components/ui/Field";
import { Skeleton } from "@/components/ui/Skeleton";
import { SyntheticBadge, TypeTag, caseTypes } from "@/components/ui/Tag";
import type { CaseType } from "@/components/ui/Tag";

// Página provisória da etapa 2: galeria dos componentes base. A Home real entra na etapa 3.
export default function Home() {
  return (
    <Container className="flex flex-col gap-12 py-section-mobile md:py-section">
      <header>
        <p className="text-eyebrow text-ink-subtle">Componentes base</p>
        <h1 className="text-display-lg mt-4">Gabriel Rangel</h1>
      </header>

      <section aria-labelledby="botoes" className="flex flex-col gap-4">
        <h2 id="botoes" className="text-headline">Botões</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Falar comigo</Button>
          <Button variant="secondary">Ver projetos</Button>
          <Button variant="tertiary">Baixar currículo</Button>
          <Button disabled>Indisponível</Button>
        </div>
      </section>

      <section aria-labelledby="tags" className="flex flex-col gap-4">
        <h2 id="tags" className="text-headline">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(caseTypes) as CaseType[]).map((t) => (
            <TypeTag key={t} type={t} />
          ))}
          <SyntheticBadge />
        </div>
      </section>

      <section aria-labelledby="campos" className="flex max-w-xl flex-col gap-4">
        <h2 id="campos" className="text-headline">Campos</h2>
        <TextField label="Nome" placeholder="Como devo te chamar" />
        <TextField
          label="E-mail"
          type="email"
          defaultValue="nome@"
          error="Confira o e-mail: falta o domínio, como nome@empresa.com."
        />
        <TextArea label="Mensagem" hint="Conte em poucas linhas o que você precisa." />
      </section>

      <section aria-labelledby="acordeao" className="flex max-w-xl flex-col gap-4">
        <h2 id="acordeao" className="text-headline">Acordeão</h2>
        <Accordion>
          <AccordionItem title="Como funciona o diagnóstico?" defaultOpen>
            Conversamos sobre o seu processo atual e eu aponto o que dá para automatizar.
          </AccordionItem>
          <AccordionItem title="Quanto tempo leva?">
            Depende do escopo; o diagnóstico define o prazo.
          </AccordionItem>
        </Accordion>
      </section>

      <section aria-labelledby="skeleton" className="flex max-w-xl flex-col gap-3">
        <h2 id="skeleton" className="text-headline">Skeleton</h2>
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </section>
    </Container>
  );
}
