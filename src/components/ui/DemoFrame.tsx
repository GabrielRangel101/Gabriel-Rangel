import type { ReactNode } from "react";
import { ExternalLinkIcon } from "./icons";
import { SyntheticBadge } from "./Tag";

// Moldura de demo: iframe, vídeo ou chat vão em children. O link de fallback é obrigatório.
export function DemoFrame({
  children,
  fallbackHref,
  fallbackLabel = "Abrir em nova aba",
  synthetic = true,
}: {
  children: ReactNode;
  fallbackHref: string;
  fallbackLabel?: string;
  synthetic?: boolean;
}) {
  return (
    <div className="rounded-xl border border-hairline bg-surface-1 p-4">
      <div className="overflow-hidden rounded-md">{children}</div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {synthetic ? <SyntheticBadge /> : <span />}
        <a
          href={fallbackHref}
          className="text-button inline-flex min-h-10 items-center gap-2 rounded-md text-primary"
        >
          {fallbackLabel}
          <ExternalLinkIcon />
        </a>
      </div>
    </div>
  );
}
