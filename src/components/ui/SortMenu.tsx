"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "./icons";

export type SortOption = { value: string; label: string; href: string };

// Menu de ordenação feito de links, então a ordem fica na URL e funciona sem estado no servidor.
export function SortMenu({
  options,
  current,
}: {
  options: SortOption[];
  current: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === current) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="text-button touch-target transition-ui inline-flex w-full items-center justify-between gap-3 rounded-lg border border-hairline bg-surface-2 px-4 hover:border-hairline-strong md:w-auto md:min-w-44"
      >
        <span>
          <span className="sr-only">Ordenar por: </span>
          {selected.label}
        </span>
        <ChevronDownIcon
          className={`transition-ui text-ink-subtle ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul className="absolute right-0 z-20 mt-2 w-full min-w-44 rounded-lg border border-hairline-strong bg-surface-3 p-1 shadow-lg">
          {options.map((o) => (
            <li key={o.value}>
              <Link
                href={o.href}
                onClick={() => setOpen(false)}
                aria-current={o.value === selected.value ? "true" : undefined}
                className={`text-button flex min-h-10 items-center gap-2 rounded-md px-3 hover:bg-surface-4 ${
                  o.value === selected.value ? "text-primary" : "text-ink-muted"
                }`}
              >
                <span className="grid w-4 place-items-center">
                  {o.value === selected.value && <CheckIcon />}
                </span>
                {o.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
