import Link from "next/link";
import type { ReactNode } from "react";
import { GlassCta } from "./GlassCta";

// CTA de fechamento: a moldura (borda na cor do fundo) abre quando o botão principal recebe hover ou foco.
export function FinalCta({
  eyebrow,
  title,
  primary,
  secondary,
}: {
  eyebrow?: string;
  title: string;
  primary: { href: string; label: string; icon?: ReactNode };
  secondary?: { href: string; label: string };
}) {
  return (
    <section
      aria-labelledby="cta-final-titulo"
      className="cta-stage relative mt-section-mobile h-[min(80vh,620px)] min-h-[460px] overflow-hidden md:mt-section"
      style={{
        background:
          "radial-gradient(50% 60% at 50% 50%, rgb(43 196 207 / 0.4), rgb(43 196 207 / 0.05) 70%), var(--color-surface-3)",
      }}
    >
      <div className="cta-frame" aria-hidden="true" />
      <div className="relative z-[3] flex h-full flex-col items-center justify-center gap-7 px-6 text-center">
        {eyebrow && <p className="text-eyebrow text-ink">{eyebrow}</p>}
        <h2
          id="cta-final-titulo"
          className="max-w-[14ch] text-balance text-[clamp(32px,5.4vw,72px)] font-light leading-none tracking-[-0.035em]"
        >
          {title}
        </h2>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
          <GlassCta href={primary.href} icon={primary.icon} className="cta-open">
            {primary.label}
          </GlassCta>
          {secondary && (
            <Link
              href={secondary.href}
              className="link-retract text-button touch-target text-ink-muted hover:text-ink"
            >
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
