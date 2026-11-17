"use client";

import { useEffect, useRef } from "react";

// Número que conta até o valor quando entra na tela (uma vez).
// O HTML do servidor já traz o valor final: sem JS ou com movimento reduzido, ele fica como está.
export function CountUp({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (v: number) =>
    `${prefix}${v.toLocaleString("pt-BR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const k = Math.min(1, (now - start) / 1600);
          el.textContent = format(to * (1 - Math.pow(1 - k, 3)));
          if (k < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
    // format depende só das props abaixo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, decimals, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {format(to)}
    </span>
  );
}
