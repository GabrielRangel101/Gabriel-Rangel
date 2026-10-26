import type { ReactNode } from "react";
import { Container } from "./Container";

// Seção com 96 px de respiro no desktop e 64 px no mobile; o título amarra o aria-labelledby.
export function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={`${id}-titulo`}
      className="mt-section-mobile md:mt-section"
    >
      <Container>
        {eyebrow && <p className="text-eyebrow text-ink-subtle">{eyebrow}</p>}
        <h2
          id={`${id}-titulo`}
          className="text-display-md mt-3 max-w-3xl"
        >
          {title}
        </h2>
        <div className="mt-8 md:mt-12">{children}</div>
      </Container>
    </section>
  );
}
