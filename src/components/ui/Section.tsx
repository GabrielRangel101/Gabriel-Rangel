import type { ReactNode } from "react";
import { Container } from "./Container";

// Seção com 96 px de respiro no desktop e 64 px no mobile; o título amarra o aria-labelledby.
export function Section({
  id,
  eyebrow,
  title,
  children,
  tight = false,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  // Aproxima da seção de cima (usado logo depois do hero).
  tight?: boolean;
}) {
  return (
    <section
      aria-labelledby={`${id}-titulo`}
      className={tight ? "mt-8 md:mt-12" : "mt-section-mobile md:mt-section"}
    >
      <Container>
        <div data-reveal>
          {eyebrow && <p className="text-eyebrow text-ink-subtle">{eyebrow}</p>}
          <h2
            id={`${id}-titulo`}
            className="mt-3 max-w-[18ch] text-balance text-[clamp(30px,4.6vw,60px)] font-light leading-[1.04] tracking-[-0.03em]"
          >
            {title}
          </h2>
        </div>
        <div className="mt-8 md:mt-12">{children}</div>
      </Container>
    </section>
  );
}
