import type { ComponentPropsWithoutRef } from "react";

// Bloco em surface-2. Sem brilho animado: o pulso só roda quando o usuário aceita movimento.
export function Skeleton({
  className = "",
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-md bg-surface-2 motion-safe:animate-pulse ${className}`}
      {...props}
    />
  );
}
