import type { ReactNode } from "react";
import { ChevronDownIcon } from "./icons";

// <details> nativo: teclado, leitor de tela e abrir/fechar sem JavaScript, sem animar layout.
// `subtitle` e `meta` (por exemplo, cargo e período) são opcionais.
export function AccordionItem({
  title,
  subtitle,
  meta,
  children,
  defaultOpen = false,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group border-b border-hairline">
      <summary className="text-body flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-xs py-4 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">
          <span className="block font-medium">{title}</span>
          {subtitle && (
            <span className="text-body-sm mt-1 block text-ink-muted">
              {subtitle}
            </span>
          )}
        </span>
        <span className="flex shrink-0 items-center gap-3">
          {meta && (
            <span className="text-body-sm hidden text-ink-subtle sm:block">
              {meta}
            </span>
          )}
          <ChevronDownIcon
            width={20}
            height={20}
            className="shrink-0 text-ink-subtle transition-ui group-open:rotate-180"
          />
        </span>
      </summary>
      <div className="text-body pb-4 text-ink-muted">
        {meta && (
          <p className="text-body-sm mb-3 text-ink-subtle sm:hidden">{meta}</p>
        )}
        {children}
      </div>
    </details>
  );
}

export function Accordion({ children }: { children: ReactNode }) {
  return <div className="border-t border-hairline">{children}</div>;
}
