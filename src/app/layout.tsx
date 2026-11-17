import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { TopNav } from "@/components/layout/TopNav";
import { Effects } from "@/components/ui/Effects";
import { site } from "@/lib/site";
import { indexable, siteUrl } from "@/lib/site-url";
import "./globals.css";

// Inter variável (100 a 900): o nome do hero usa 300 e o peso reage ao cursor.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
    default: `${site.name} | Analista de Dados e IA`,
    template: `%s | ${site.name}`,
  },
  description:
    "Analista de dados e automação com IA. Dashboards, sistemas e agentes que tiram o trabalho manual do caminho.",
  // A imagem de pré-visualização vem de opengraph-image.png (mesma pasta).
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    title: `${site.name} | Analista de Dados e IA`,
    description:
      "Dashboards, sistemas e agentes que tiram o trabalho manual do caminho.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Analista de Dados e IA`,
    description:
      "Dashboards, sistemas e agentes que tiram o trabalho manual do caminho.",
  },
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
      suppressHydrationWarning
    >
      <head>
        {/* Marca que há JS antes da pintura: só então os blocos de revelação começam ocultos. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <Effects />
        <a
          href="#conteudo"
          className="text-button fixed left-4 top-2 z-50 -translate-y-20 rounded-md bg-primary px-4 py-2 text-on-primary focus:translate-y-0"
        >
          Pular para o conteúdo
        </a>
        <TopNav />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
