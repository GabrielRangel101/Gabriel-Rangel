import type { MetadataRoute } from "next";
import { cases } from "@/content/cases";
import { siteUrl } from "@/lib/site-url";

// As demais rotas entram aqui conforme as páginas forem criadas nas próximas etapas.
const routes = ["/", "/projetos", ...Object.keys(cases).map((slug) => `/projetos/${slug}`)];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({ url: `${siteUrl}${path}` }));
}
