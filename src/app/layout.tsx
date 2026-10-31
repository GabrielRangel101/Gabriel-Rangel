import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { TopNav } from "@/components/layout/TopNav";
import { publishedProjects } from "@/content/projects";
import { site } from "@/lib/site";
import { indexable, siteUrl } from "@/lib/site-url";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  robots: indexable ? undefined : { index: false, follow: false },
  title: {
    default: "Rangel Analytics",
    template: "%s · Rangel Analytics",
  },
  description:
    "Analista de dados e automação com IA. Dashboards, sistemas e agentes que tiram o trabalho manual do caminho.",
};

export const viewport: Viewport = {
  themeColor: "#0b1117",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <a
          href="#conteudo"
          className="text-button fixed left-4 top-2 z-50 -translate-y-20 rounded-md bg-primary px-4 py-2 text-on-primary focus:translate-y-0"
        >
          Pular para o conteúdo
        </a>
        <TopNav
          types={site.navTypes.filter((type) =>
            publishedProjects.some((project) => project.type === type),
          )}
        />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
