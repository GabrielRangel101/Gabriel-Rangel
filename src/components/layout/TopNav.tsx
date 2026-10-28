"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { caseTypes } from "@/components/ui/Tag";
import { site } from "@/lib/site";

const pillClass =
  "text-body-sm touch-target transition-ui inline-flex items-center gap-2 rounded-full bg-surface-1 px-3 text-ink-subtle hover:bg-surface-2 hover:text-ink";

function TypePills({ className = "" }: { className?: string }) {
  return (
    <ul className={className}>
      {site.navTypes.map((type) => {
        const { label, Icon } = caseTypes[type];
        return (
          <li key={type}>
            <Link href={`/projetos?tipo=${type}`} className={pillClass}>
              <Icon />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

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
          <span
            aria-hidden="true"
            className="text-caption grid size-8 place-items-center rounded-md bg-primary font-semibold text-on-primary"
          >
            GR
          </span>
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

        <TypePills className="hidden items-center gap-2 xl:flex" />

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
            <p className="text-eyebrow mt-4 px-3 text-ink-subtle">
              Tipos de projeto
            </p>
            <TypePills className="mt-2 flex flex-wrap gap-2 px-3" />
            <Button href={site.cta.href} variant="cta" className="my-4 sm:hidden">
              {site.cta.label}
            </Button>
          </Container>
        </nav>
      )}
    </header>
  );
}
