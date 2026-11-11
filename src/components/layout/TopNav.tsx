"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LogoMark } from "@/components/ui/Logo";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { site } from "@/lib/site";

export function TopNav() {
  const [first, ...rest] = site.name.split(" ");
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
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const linkClass = (href: string) =>
    `text-body-sm touch-target transition-ui inline-flex items-center relative rounded-md px-3 ${
      isActive(href)
        ? "bg-surface-2 text-ink after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full after:bg-primary"
        : "text-ink-subtle hover:bg-surface-1 hover:text-ink"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-header">
      <Container className="flex h-14 items-center gap-6">
        <Link
          href="/"
          className="touch-target inline-flex items-center gap-3 rounded-md"
        >
          <LogoMark className="size-9 shrink-0" />
          <span className="text-body font-semibold">
            {first} <span className="text-primary">{rest.join(" ")}</span>
          </span>
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

        <div className="ml-auto flex items-center gap-2">
          <Button href={site.cta.href} variant="cta" className="max-sm:hidden">
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
          className="border-t border-hairline bg-header md:hidden"
        >
          <Container className="flex flex-col py-2">
            {site.nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={`${linkClass(href)} text-body min-h-11`}
              >
                {label}
              </Link>
            ))}
            <Button href={site.cta.href} variant="cta" className="my-4 sm:hidden">
              {site.cta.label}
            </Button>
          </Container>
        </nav>
      )}
    </header>
  );
}
