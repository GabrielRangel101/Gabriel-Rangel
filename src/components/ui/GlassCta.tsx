import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "./icons";

// CTA de vidro (pílula com borda girando). Um por tela, para a ação principal.
// O texto é o nome acessível; ícone e seta são decorativos.
export function GlassCta({
  href,
  children,
  icon,
  size = "md",
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  size?: "md" | "sm";
  external?: boolean;
  className?: string;
}) {
  const content = (
    <>
      <span className="cta-spin" aria-hidden="true" />
      <span className="cta-ic" aria-hidden="true">
        {icon ?? <GridIcon />}
      </span>
      <span className="cta-tx">{children}</span>
      <span className="cta-ar" aria-hidden="true">
        <ArrowRightIcon width={16} height={16} />
      </span>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener"
        data-size={size}
        className={`cta-glass ${className}`}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} data-size={size} className={`cta-glass ${className}`}>
      {content}
    </Link>
  );
}

export function GridIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </svg>
  );
}
