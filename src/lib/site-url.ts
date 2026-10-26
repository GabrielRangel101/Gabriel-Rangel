// URL pública do site: variável própria, depois a URL de produção da Vercel, depois localhost.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

// Antes do lançamento o site fica fora dos buscadores. Ligue com NEXT_PUBLIC_INDEXABLE=true.
export const indexable = process.env.NEXT_PUBLIC_INDEXABLE === "true";
