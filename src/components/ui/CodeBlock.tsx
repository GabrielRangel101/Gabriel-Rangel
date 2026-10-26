// Bloco em mono para trechos curtos (fluxos, SQL, DAX). Rola na horizontal em vez de quebrar.
export function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="text-mono overflow-x-auto rounded-md border border-hairline bg-surface-1 p-4 text-ink-muted">
      <code>{children}</code>
    </pre>
  );
}
