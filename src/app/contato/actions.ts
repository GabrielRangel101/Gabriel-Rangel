"use server";

import { headers } from "next/headers";

export type ContactField = "name" | "email" | "message";

export type ContactState = {
  status: "idle" | "success" | "error" | "unavailable";
  message?: string;
  errors?: Partial<Record<ContactField, string>>;
  values?: Record<ContactField, string>;
};

const MIN_FILL_MS = 2500;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;

// Limite por IP em memória: protege contra rajadas de uma instância. O limite definitivo
// (compartilhado entre instâncias) exigiria um banco; para um portfólio, o limite em memória basta.
const hits = new Map<string, number[]>();

function tooManyRequests(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function validate(values: Record<ContactField, string>) {
  const errors: Partial<Record<ContactField, string>> = {};
  if (values.name.length < 2 || values.name.length > 120) {
    errors.name = "Escreva seu nome, com pelo menos 2 letras.";
  }
  if (
    values.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)
  ) {
    errors.email = "Confira o e-mail: ele precisa ter o formato nome@empresa.com.";
  }
  if (values.message.length < 10 || values.message.length > 4000) {
    errors.message =
      "Conte um pouco mais sobre o que você precisa, com pelo menos 10 caracteres.";
  }
  return errors;
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  // Honeypot e tempo mínimo: bots preenchem o campo escondido ou enviam rápido demais.
  // Respondemos como se tivesse dado certo, sem guardar nada.
  const trap = String(formData.get("website") ?? "");
  const startedAt = Number(formData.get("startedAt"));
  if (trap || !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return { status: "success" };
  }

  const errors = validate(values);
  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, values };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconhecido";
  if (tooManyRequests(ip)) {
    return {
      status: "error",
      message:
        "Você já enviou algumas mensagens agora há pouco. Espere alguns minutos ou me chame pelo LinkedIn.",
      values,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    return {
      status: "unavailable",
      message:
        "O formulário ainda não está ativo. Por enquanto, me chame pelo LinkedIn.",
      values,
    };
  }

  try {
    // Só texto puro: nada do que o visitante escreve vira HTML no e-mail.
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfólio <onboarding@resend.dev>",
        to: [to],
        reply_to: values.email,
        subject: `Contato pelo portfólio: ${values.name.replace(/\s+/g, " ")}`,
        text: [
          `Nome: ${values.name}`,
          `E-mail: ${values.email}`,
          "",
          values.message,
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`Resend respondeu ${response.status}`);
    return { status: "success" };
  } catch {
    return {
      status: "error",
      message:
        "Não consegui enviar agora. Tente de novo em instantes ou me chame pelo LinkedIn.",
      values,
    };
  }
}
