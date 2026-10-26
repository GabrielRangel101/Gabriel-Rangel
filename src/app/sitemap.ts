import type { MetadataRoute } from "next";
import { cases } from "@/content/cases";
import { siteUrl } from "@/lib/site-url";

const routes = [
  "/",
  "/projetos",
  "/sobre",
  "/contato",
  "/privacidade",
  ...Object.keys(cases).map((slug) => `/projetos/${slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({ url: `${siteUrl}${path}` }));
}
