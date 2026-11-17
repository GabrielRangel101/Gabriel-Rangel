"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";

// Painel "Casos reais" do hero. Cada barra é um número publicado no case (sem série inventada):
// por isso o gráfico é de barras, não uma curva com pontos que não existem.
type Bar = { label: string; value: number; text: string };
type PanelCase = {
  id: string;
  tab: string;
  slug: string;
  value: number;
  format: (v: number) => string;
  sub: string;
  // Barra em destaque quando o mouse não está sobre o gráfico.
  main: number;
  bars: Bar[];
};

const br = (v: number, d: number) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

const panelCases: PanelCase[] = [
  {
    id: "pipeline",
    tab: "Pipeline",
    slug: "erp-pipeline-varejo",
    value: 83.48,
    format: (v) => `${br(v, 2)} s`,
    sub: "para carregar 1 milhão de itens de venda",
    main: 0,
    bars: [
      { label: "Carga completa", value: 83.48, text: "83,48 s" },
      { label: "Um dia (72 mil itens)", value: 14.42, text: "14,42 s" },
      { label: "Conferência", value: 2.52, text: "2,52 s" },
    ],
  },
  {
    id: "ab",
    tab: "Teste A/B",
    slug: "teste-ab-assinaturas",
    value: 0.82,
    format: (v) => `+${br(v, 2)} p.p.`,
    sub: "de conversão no checkout, p = 0,0009",
    main: 1,
    bars: [
      { label: "Controle", value: 4.384, text: "4,384%" },
      { label: "Novo checkout", value: 5.203, text: "5,203%" },
    ],
  },
  {
    id: "cashlab",
    tab: "CashLab",
    slug: "cashlab",
    value: 3.92,
    format: (v) => `R$ ${br(v, 2)} mi`,
    sub: "de saldo de caixa em 31/10/2026",
    main: 0,
    bars: [
      { label: "Saldo em 31/10", value: 3.92, text: "R$ 3,92 mi" },
      { label: "Base em 31/01", value: 4.23, text: "R$ 4,23 mi" },
      { label: "Conservador em 31/01", value: 3.89, text: "R$ 3,89 mi" },
    ],
  },
];

const W = 400;
const H = 120;

export function CasesPanel() {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(panelCases[0].value);
  const [hover, setHover] = useState<number | null>(null);
  const [drawn, setDrawn] = useState(true);
  const paused = useRef(false);
  const picked = useRef(false);
  const shownRef = useRef(panelCases[0].value);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeRef = useRef(0);

  const select = useCallback((index: number) => {
    activeRef.current = index;
    setActive(index);
    setHover(null);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const to = panelCases[index].value;
    if (reduce) {
      shownRef.current = to;
      setShown(to);
      return;
    }
    // Redesenha as barras e conta o número do valor anterior até o novo.
    setDrawn(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawn(true)));
    const from = shownRef.current;
    const start = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / 700);
      const v = from + (to - from) * (1 - Math.pow(1 - k, 3));
      shownRef.current = v;
      setShown(v);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  // Primeira pintura: as barras crescem junto com a entrada do painel.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = requestAnimationFrame(() => {
      setDrawn(false);
      requestAnimationFrame(() => requestAnimationFrame(() => setDrawn(true)));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Rotação automática a cada ~5 s; para no hover, no foco e depois de um clique.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      if (paused.current || picked.current || document.hidden) return;
      select((activeRef.current + 1) % panelCases.length);
    }, 5200);
    return () => clearInterval(timer);
  }, [select]);

  function onKeyDown(event: KeyboardEvent, index: number) {
    const n = panelCases.length;
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % n
        : event.key === "ArrowLeft"
          ? (index - 1 + n) % n
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? n - 1
              : null;
    if (next === null) return;
    event.preventDefault();
    picked.current = true;
    select(next);
    tabs.current[next]?.focus();
  }

  const item = panelCases[active];
  const max = Math.max(...item.bars.map((b) => b.value)) * 1.12;
  const slot = W / item.bars.length;
  const barW = Math.min(84, slot * 0.46);

  return (
    <div
      className="relative w-full rounded-[18px] border border-line-soft bg-[linear-gradient(225deg,rgb(255_255_255/0.03),rgb(11_29_39/0.82)_60%)] p-4 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.6)] backdrop-blur-md sm:p-5 lg:w-[480px]"
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
      onFocusCapture={() => (paused.current = true)}
      onBlurCapture={() => (paused.current = false)}
    >
      <div className="flex items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Casos em destaque"
          className="flex gap-1 rounded-full border border-line-soft bg-black/30 p-[3px]"
        >
          {panelCases.map((c, i) => (
            <button
              key={c.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`painel-aba-${c.id}`}
              aria-selected={i === active}
              aria-controls="painel-casos"
              tabIndex={i === active ? 0 : -1}
              onClick={() => {
                picked.current = true;
                select(i);
              }}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`text-[12px] font-medium whitespace-nowrap rounded-full px-3 py-2 transition-colors duration-200 ${
                i === active ? "bg-primary text-on-primary" : "text-ink-subtle hover:text-ink"
              }`}
            >
              {c.tab}
            </button>
          ))}
        </div>
        <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-ink-subtle max-sm:hidden">
          <i className="live-dot size-[7px] rounded-full bg-cta" aria-hidden="true" />
          Casos reais
        </span>
      </div>

      <div id="painel-casos" role="tabpanel" aria-labelledby={`painel-aba-${item.id}`}>
        <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-[clamp(30px,3.4vw,40px)] font-light leading-none tracking-[-0.03em] tabular-nums">
            {item.format(shown)}
          </span>
          <span className="text-body-sm text-ink-subtle">{item.sub}</span>
        </p>

        <div className="relative mt-3">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="block h-auto w-full overflow-visible"
            aria-hidden="true"
          >
            {[20, 60, 100].map((y) => (
              <line key={y} x1="0" x2={W} y1={y} y2={y} stroke="rgb(242 248 249 / 0.08)" />
            ))}
            {item.bars.map((bar, i) => {
              const h = (bar.value / max) * 100;
              const x = slot * i + (slot - barW) / 2;
              const lit = hover === null ? i === item.main : hover === i;
              return (
                <rect
                  key={`${item.id}-${bar.label}`}
                  x={x}
                  y={108 - h}
                  width={barW}
                  height={h}
                  rx="4"
                  fill={lit ? "var(--color-primary)" : "rgb(143 166 174 / 0.45)"}
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover(null)}
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "bottom",
                    transform: drawn ? "scaleY(1)" : "scaleY(0)",
                    transition: drawn
                      ? `transform 900ms var(--ease-expressive) ${i * 90}ms, fill 200ms`
                      : "none",
                  }}
                />
              );
            })}
          </svg>
          {hover !== null && (
            <span
              className="pointer-events-none absolute top-0 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-primary/35 bg-tooltip px-2.5 py-1.5 text-[12px] shadow-lg"
              style={{ left: `${((slot * hover + slot / 2) / W) * 100}%` }}
            >
              {item.bars[hover].label} · <b className="font-semibold text-primary">{item.bars[hover].text}</b>
            </span>
          )}
        </div>

        <ul className="mt-2 grid text-[11px] text-ink-subtle" style={{ gridTemplateColumns: `repeat(${item.bars.length}, 1fr)` }}>
          {item.bars.map((bar) => (
            <li key={bar.label} className="text-center leading-tight">
              <span className="block">{bar.label}</span>
              <span className="mt-0.5 block font-medium text-ink-muted">{bar.text}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-[11px] text-ink-subtle">Números publicados nos cases, com dados sintéticos.</p>
          <Link
            href={`/projetos/${item.slug}`}
            className="text-[12px] inline-flex shrink-0 items-center gap-1.5 rounded-md font-medium text-primary hover:text-primary-hover"
          >
            Ver o case
            <ArrowRightIcon width={14} height={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
