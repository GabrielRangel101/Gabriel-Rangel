import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

// As demais rotas entram aqui conforme as páginas forem criadas nas próximas etapas.
const routes = ["/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({ url: `${siteUrl}${path}` }));
}
