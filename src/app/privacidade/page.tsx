import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Quais dados o formulário de contato guarda, para que servem e como pedir a exclusão.",
};

// Texto-base escrito a partir do que o site de fato faz hoje. Gabriel deve revisá-lo.
const sections = [
  {
    title: "Quem é o responsável",
    body: [
      `${site.name}, responsável pelos dados enviados neste site. Para falar sobre eles, use o formulário de contato ou o LinkedIn.`,
    ],
  },
  {
    title: "Quais dados são guardados",
    body: [
      "Apenas o que você escreve no formulário de contato: nome, e-mail e mensagem. Nenhum outro dado pessoal é pedido.",
    ],
  },
  {
    title: "Para que servem",
    body: [
      "Somente para responder à sua mensagem e dar seguimento à conversa. Não uso esses dados para outra finalidade, não vendo e não compartilho com terceiros.",
    ],
  },
  {
    title: "Onde ficam e por quanto tempo",
    body: [
      "A mensagem não fica num banco de dados do site: ela é enviada por e-mail (por meio do serviço Resend) para a minha caixa de entrada, onde fica pelo tempo necessário para responder e para a conversa que resultar dela. Você pode pedir a exclusão quando quiser.",
    ],
  },
  {
    title: "Proteção contra abuso",
    body: [
      "Para evitar envios automáticos, o formulário usa um campo escondido e um limite de envios por endereço de IP. O limite é aplicado na hora do envio e o IP não é gravado junto com a sua mensagem.",
      "A hospedagem (Vercel) pode registrar dados técnicos de acesso, como o IP, nos logs dela, segundo a própria política.",
    ],
  },
  {
    title: "Seus direitos",
    body: [
      "Pela LGPD (Lei 13.709/2018), você pode pedir para confirmar se guardo dados seus, acessá-los, corrigi-los ou excluí-los. Basta me chamar pelo formulário de contato ou pelo LinkedIn.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <Container className="pt-12 md:pt-20">
      <p className="text-eyebrow text-ink-subtle">Privacidade</p>
      <h1 className="text-display-md mt-3 max-w-3xl">
        Política de Privacidade
      </h1>
      <p className="text-body mt-4 max-w-2xl text-ink-muted">
        Esta página explica, em linguagem direta, o que acontece com os dados
        que você envia pelo formulário de contato.
      </p>

      <div className="mt-12 flex max-w-3xl flex-col gap-10">
        {sections.map((section) => (
          <section key={section.title} aria-labelledby={slug(section.title)}>
            <h2 id={slug(section.title)} className="text-headline">
              {section.title}
            </h2>
            <div className="text-body mt-3 flex flex-col gap-3 text-ink-muted">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="text-body-sm mt-12 text-ink-subtle">
        Atualizada em 26/10/2026.{" "}
        <Link href="/contato" className="text-primary underline">
          Falar comigo
        </Link>
      </p>
    </Container>
  );
}

function slug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-");
}
