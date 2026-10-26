import type { ReactNode } from "react";
import { ChevronDownIcon } from "./icons";

// <details> nativo: teclado, leitor de tela e abrir/fechar sem JavaScript, sem animar layout.
export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group border-b border-hairline"
    >
      <summary className="text-body flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-xs py-4 font-medium [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDownIcon
          width={20}
          height={20}
          className="shrink-0 text-ink-subtle transition-ui group-open:rotate-180"
        />
      </summary>
      <div className="text-body pb-4 text-ink-muted">{children}</div>
    </details>
  );
}

export function Accordion({ children }: { children: ReactNode }) {
  return <div className="border-t border-hairline">{children}</div>;
}
