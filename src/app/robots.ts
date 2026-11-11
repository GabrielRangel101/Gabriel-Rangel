import type { MetadataRoute } from "next";
import { indexable, siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  if (!indexable) {
    // Fora dos buscadores até o lançamento, mas os robôs que montam a pré-visualização
    // do link (LinkedIn, WhatsApp, Facebook, X e Slack) podem ler a página.
    return {
      rules: [
        {
          userAgent: [
            "LinkedInBot",
            "WhatsApp",
            "facebookexternalhit",
            "Twitterbot",
            "Slackbot",
          ],
          allow: "/",
          disallow: "/cv",
        },
        { userAgent: "*", disallow: "/" },
      ],
    };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/cv" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
