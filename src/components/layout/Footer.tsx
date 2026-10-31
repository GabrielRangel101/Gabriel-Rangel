import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

const linkClass =
  "text-body-sm touch-target transition-ui inline-flex items-center rounded-xs text-ink-subtle hover:text-ink";

export function Footer() {
  const { github, linkedin } = site.external;

  return (
    <footer className="mt-section-mobile bg-canvas py-16 md:mt-section">
      <Container className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-sm">
          <p className="text-body font-semibold text-ink">{site.brand}</p>
          <p className="text-body-sm mt-3 text-ink-subtle">{site.tagline}</p>
        </div>

        <nav aria-label="Rodapé: navegação">
          <p className="text-eyebrow text-ink-muted">Navegação</p>
          <ul className="mt-2 flex flex-col">
            {site.nav.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={linkClass}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Rodapé: contato">
          <p className="text-eyebrow text-ink-muted">Contato</p>
          <ul className="mt-2 flex flex-col">
            <li>
              <Link href="/contato" className={linkClass}>
                Fale comigo
              </Link>
            </li>
            {site.email && (
              <li>
                <a href={`mailto:${site.email}`} className={linkClass}>
                  {site.email}
                </a>
              </li>
            )}
            {github && (
              <li>
                <a href={github} rel="noopener" className={linkClass}>
                  GitHub
                </a>
              </li>
            )}
            {linkedin && (
              <li>
                <a href={linkedin} rel="noopener" className={linkClass}>
                  LinkedIn
                </a>
              </li>
            )}
            <li>
              <Link href="/privacidade" className={linkClass}>
                Privacidade
              </Link>
            </li>
          </ul>
        </nav>
      </Container>

      <Container className="mt-12 border-t border-hairline pt-6">
        <p className="text-body-sm text-ink-subtle">
          © {new Date().getFullYear()} {site.brand}. Cases com dados sintéticos.
        </p>
      </Container>
    </footer>
  );
}
