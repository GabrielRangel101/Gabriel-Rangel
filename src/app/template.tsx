import type { ReactNode } from "react";

// O template remonta a cada navegação: a página nova entra com fade e 12 px de subida
// (sem movimento com prefers-reduced-motion). O Next já abre a rota nova no topo.
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
