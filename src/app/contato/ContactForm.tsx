"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextArea, TextField } from "@/components/ui/Field";
import { AlertIcon, CheckCircleIcon } from "@/components/ui/icons";
import { submitContact } from "./actions";
import type { ContactState } from "./actions";

const initial: ContactState = { status: "idle" };

export function ContactForm({ linkedin }: { linkedin?: string }) {
  const [state, action, pending] = useActionState(submitContact, initial);
  // Marca o momento em que o formulário apareceu; o servidor recusa envios rápidos demais.
  const [startedAt] = useState(() => Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Depois de um erro, o foco vai para o primeiro campo com problema (ou para o aviso geral).
  useEffect(() => {
    if (state.status === "idle") return;
    const invalid = formRef.current?.querySelector<HTMLElement>(
      "[aria-invalid=true]",
    );
    (invalid ?? bannerRef.current)?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-xl border border-hairline bg-surface-1 p-6 md:p-8"
      >
        <CheckCircleIcon width={28} height={28} className="text-success" />
        <h2 className="text-card-title mt-4">Mensagem enviada</h2>
        <p className="text-body mt-2 text-ink-muted">
          Recebi sua mensagem e respondo no e-mail que você informou.
        </p>
      </div>
    );
  }

  const values = state.values;

  return (
    <form
      ref={formRef}
      action={action}
      noValidate
      className="flex flex-col gap-5 rounded-xl border border-hairline bg-surface-1 p-6 md:p-8"
    >
      <div>
        <h2 className="text-card-title">Conte o que você precisa</h2>
        <p className="text-body-sm mt-1 text-ink-muted">
          Três campos. Eu respondo com os próximos passos.
        </p>
      </div>

      {state.message && (
        <div
          ref={bannerRef}
          tabIndex={-1}
          role="alert"
          className="text-body-sm flex items-start gap-2 rounded-md border border-hairline bg-surface-2 p-3 text-error"
        >
          <AlertIcon className="mt-0.5 shrink-0" />
          <span>
            {state.message}
            {linkedin && (
              <>
                {" "}
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener"
                  className="text-primary underline"
                >
                  Abrir o LinkedIn
                </a>
              </>
            )}
          </span>
        </div>
      )}

      <TextField
        label="Nome"
        name="name"
        autoComplete="name"
        required
        defaultValue={values?.name}
        error={state.errors?.name}
      />
      <TextField
        label="E-mail"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        defaultValue={values?.email}
        error={state.errors?.email}
      />
      <TextArea
        label="O que você precisa?"
        name="message"
        required
        hint="Conte o que hoje é manual ou o que você quer enxergar nos seus números."
        defaultValue={values?.message}
        error={state.errors?.message}
      />

      {/* Honeypot: invisível para pessoas, tentador para bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Não preencha este campo
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Enviando…" : "Enviar mensagem"}
      </Button>

      <p className="text-body-sm text-ink-subtle">
        Uso só nome, e-mail e mensagem, para responder. Detalhes na{" "}
        <Link href="/privacidade" className="text-primary underline">
          Política de Privacidade
        </Link>
        .
      </p>
    </form>
  );
}
