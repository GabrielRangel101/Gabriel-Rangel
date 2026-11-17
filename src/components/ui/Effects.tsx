"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Efeitos globais, montados uma vez no layout:
// - revelação ao rolar de qualquer elemento com data-reveal (uma vez só);
// - spotlight que segue o mouse dentro de elementos .spotlight (só com mouse).
// Com prefers-reduced-motion, tudo aparece de imediato.
export function Effects() {
  const pathname = usePathname();

  useEffect(() => {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown])"),
    );
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.setAttribute("data-shown", ""));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-shown", "");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // A partir daqui, trocas de rota animam a entrada da página (ver .nav-ready no CSS).
  useEffect(() => {
    // A página já na tela fica marcada para não animar quando a classe entrar.
    document.querySelectorAll(".page-enter").forEach((el) => el.setAttribute("data-first", ""));
    const id = requestAnimationFrame(() => document.documentElement.classList.add("nav-ready"));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest?.<HTMLElement>(".spotlight");
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      target.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
