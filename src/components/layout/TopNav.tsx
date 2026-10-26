"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { site } from "@/lib/site";

export function TopNav() {
  const pathname = usePathname();
  // O menu guarda a página em que foi aberto; ao navegar, deixa de valer e fecha sozinho.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Escape fecha e devolve o foco ao botão.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenOn(null);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const linkClass = (href: string) =>
    `text-body-sm transition-ui rounded-md px-3 py-2 ${
      isActive(href) ? "text-ink" : "text-ink-subtle hover:text-ink"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas">
      <Container className="flex h-14 items-center justify-between">
        <Link
          href="/"
          className="text-body touch-target inline-flex items-center rounded-xs font-semibold"
        >
          {site.name}
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {site.nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={linkClass(href)}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button href={site.cta.href} className="max-sm:hidden">
            {site.cta.label}
          </Button>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen(!open)}
            className="transition-ui inline-flex size-11 items-center justify-center rounded-md text-ink hover:bg-surface-1 md:hidden"
          >
            {open ? (
              <CloseIcon width={20} height={20} />
            ) : (
              <MenuIcon width={20} height={20} />
            )}
          </button>
        </div>
      </Container>

      {open && (
        <nav
          id="menu-mobile"
          aria-label="Principal"
          className="border-t border-hairline bg-canvas md:hidden"
        >
          <Container className="flex flex-col py-2">
            {site.nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={`${linkClass(href)} text-body flex min-h-11 items-center`}
              >
                {label}
              </Link>
            ))}
            <Button href={site.cta.href} className="my-2 sm:hidden">
              {site.cta.label}
            </Button>
          </Container>
        </nav>
      )}
    </header>
  );
}
