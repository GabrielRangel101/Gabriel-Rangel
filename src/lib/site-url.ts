// URL pública do site: variável própria, depois a URL de produção da Vercel, depois localhost.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

// Quem pode ser indexado: só produção. Preview e local ficam fora dos
// buscadores sozinhos — duas cópias do mesmo site disputando a busca pelo
// nome é pior do que não aparecer.
//
// NEXT_PUBLIC_INDEXABLE continua valendo como trava manual, nos dois
// sentidos: "false" segura a produção fora da busca (para voltar ao estado
// de pré-lançamento sem mexer em código) e "true" libera um preview.
// Estas leituras são todas de servidor (layout, robots.ts, sitemap.ts), por
// isso VERCEL_ENV basta e não precisa do prefixo NEXT_PUBLIC_.
const travaManual = process.env.NEXT_PUBLIC_INDEXABLE;

export const indexable =
  travaManual === "true"
    ? true
    : travaManual === "false"
      ? false
      : process.env.VERCEL_ENV === "production";
