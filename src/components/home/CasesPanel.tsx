"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";

// Painel "Casos reais" do hero. Só entram números publicados em cada case; o tipo de gráfico
// muda conforme o que o número é: colunas (tempos), intervalo (efeito com IC) e linhas (projeção).
type Legend = { label: string; text: string };
type Hit = { x: number; y: number; label: string; text: string };

type Columns = { kind: "columns"; main: number; bars: { label: string; value: number; text: string }[] };
type Interval = { kind: "interval"; lo: number; mid: number; hi: number; max: number };
type Lines = {
  kind: "lines";
  min: number;
  max: number;
  start: number;
  series: { label: string; end: number; warm?: boolean }[];
};

type PanelCase = {
  id: string;
  tab: string;
  slug: string;
  value: number;
  format: (v: number) => string;
  sub: string;
  note: string;
  legend: Legend[];
  chart: Columns | Interval | Lines;
};

const br = (v: number, d: number) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
const pp = (v: number) => `+${br(v, 3)} p.p.`;

const panelCases: PanelCase[] = [
  {
    id: "pipeline",
    tab: "Pipeline",
    slug: "erp-pipeline-varejo",
    value: 83.48,
    format: (v) => `${br(v, 2)} s`,
    sub: "para carregar 1 milhão de itens de venda",
    note: "Tempos medidos no case, com dados sintéticos.",
    legend: [
      { label: "Carga completa", text: "83,48 s" },
      { label: "Um dia (72 mil itens)", text: "14,42 s" },
      { label: "Conferência", text: "2,52 s" },
    ],
    chart: {
      kind: "columns",
      main: 0,
      bars: [
        { label: "Carga completa", value: 83.48, text: "83,48 s" },
        { label: "Um dia (72 mil itens)", value: 14.42, text: "14,42 s" },
        { label: "Conferência", value: 2.52, text: "2,52 s" },
      ],
    },
  },
  {
    id: "ab",
    tab: "Teste A/B",
    slug: "teste-ab-assinaturas",
    value: 0.82,
    format: (v) => `+${br(v, 2)} p.p.`,
    sub: "de conversão no checkout, p = 0,0009",
    note: "Efeito e intervalo de confiança de 95% do case, com dados sintéticos.",
    legend: [
      { label: "Limite inferior", text: pp(0.337) },
      { label: "Estimativa", text: pp(0.819) },
      { label: "Limite superior", text: pp(1.302) },
    ],
    chart: { kind: "interval", lo: 0.337, mid: 0.819, hi: 1.302, max: 1.5 },
  },
  {
    id: "cashlab",
    tab: "CashLab",
    slug: "cashlab",
    value: 3.92,
    format: (v) => `R$ ${br(v, 2)} mi`,
    sub: "de saldo de caixa em 31/10/2026",
    note: "Projeção de 90 dias do case (dois cenários), com dados sintéticos.",
    legend: [
      { label: "Saldo em 31/10", text: "R$ 3,92 mi" },
      { label: "Base em 31/01", text: "R$ 4,23 mi" },
      { label: "Conservador em 31/01", text: "R$ 3,89 mi" },
    ],
    chart: {
      kind: "lines",
      min: 3.7,
      max: 4.4,
      start: 3.92,
      series: [
        { label: "Base em 31/01", end: 4.23 },
        { label: "Conservador em 31/01", end: 3.89, warm: true },
      ],
    },
  },
];

const W = 400;
const H = 120;
const BASE = 108;

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
    // Redesenha o gráfico e conta o número do valor anterior até o novo.
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

  // Primeira pintura: o gráfico se desenha junto com a entrada do painel.
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
  const { chart } = item;
  const grow = (i: number) =>
    drawn ? `transform 900ms var(--ease-expressive) ${i * 90}ms, fill 200ms` : "none";

  // Pontos que respondem ao mouse e posicionam o tooltip (em unidades do viewBox).
  let hits: Hit[] = [];
  let graphic: React.ReactNode = null;

  if (chart.kind === "columns") {
    const max = Math.max(...chart.bars.map((b) => b.value)) * 1.12;
    const slot = W / chart.bars.length;
    const barW = Math.min(84, slot * 0.46);
    hits = chart.bars.map((b, i) => ({
      x: slot * i + slot / 2,
      y: BASE - (b.value / max) * 100,
      label: b.label,
      text: b.text,
    }));
    graphic = chart.bars.map((bar, i) => {
      const h = (bar.value / max) * 100;
      const lit = hover === null ? i === chart.main : hover === i;
      return (
        <rect
          key={bar.label}
          x={slot * i + (slot - barW) / 2}
          y={BASE - h}
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
            transition: grow(i),
          }}
        />
      );
    });
  } else if (chart.kind === "interval") {
    const x0 = 24;
    const x1 = 376;
    const sx = (v: number) => x0 + (v / chart.max) * (x1 - x0);
    const yMid = 52;
    hits = [
      { x: sx(chart.lo), y: yMid, label: "Limite inferior do IC 95%", text: pp(chart.lo) },
      { x: sx(chart.mid), y: yMid, label: "Estimativa", text: pp(chart.mid) },
      { x: sx(chart.hi), y: yMid, label: "Limite superior do IC 95%", text: pp(chart.hi) },
    ];
    const reveal = {
      transformBox: "fill-box" as const,
      transformOrigin: "left",
      transform: drawn ? "scaleX(1)" : "scaleX(0)",
      transition: drawn ? "transform 900ms var(--ease-expressive)" : "none",
    };
    graphic = (
      <>
        {/* Zero: onde o efeito seria nulo. O intervalo inteiro fica à direita dele. */}
        <line x1={x0} x2={x0} y1="14" y2="96" stroke="rgb(242 248 249 / 0.35)" strokeDasharray="3 3" />
        <text x={x0 + 6} y="22" fontSize="9" fill="rgb(143 166 174)">
          sem efeito
        </text>
        <line x1={x0} x2={x1} y1="96" y2="96" stroke="rgb(242 248 249 / 0.2)" />
        {[0, 0.5, 1, 1.5].map((t) => (
          <g key={t}>
            <line x1={sx(t)} x2={sx(t)} y1="96" y2="100" stroke="rgb(242 248 249 / 0.3)" />
            <text x={sx(t)} y="112" fontSize="9" textAnchor="middle" fill="rgb(143 166 174)">
              {t === 0 ? "0" : `${br(t, 1)} p.p.`}
            </text>
          </g>
        ))}
        <rect
          x={sx(chart.lo)}
          y={yMid - 9}
          width={sx(chart.hi) - sx(chart.lo)}
          height="18"
          rx="9"
          fill="rgb(43 196 207 / 0.22)"
          stroke="var(--color-primary)"
          strokeOpacity="0.55"
          style={reveal}
        />
        {hits.map((h, i) => (
          <circle
            key={h.label}
            cx={h.x}
            cy={h.y}
            r={i === 1 ? 7 : 4.5}
            fill={i === 1 ? "var(--color-primary)" : "var(--color-canvas)"}
            stroke="var(--color-primary)"
            strokeWidth="2"
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
            style={{
              opacity: drawn ? 1 : 0,
              transition: drawn ? `opacity 400ms ${300 + i * 150}ms` : "none",
            }}
          />
        ))}
      </>
    );
  } else {
    const sx = (frac: number) => 24 + frac * 352;
    const sy = (v: number) => BASE - ((v - chart.min) / (chart.max - chart.min)) * 92;
    const y0 = sy(chart.start);
    hits = [
      { x: sx(0), y: y0, label: "Saldo em 31/10", text: `R$ ${br(chart.start, 2)} mi` },
      ...chart.series.map((s) => ({ x: sx(1), y: sy(s.end), label: s.label, text: `R$ ${br(s.end, 2)} mi` })),
    ];
    graphic = (
      <>
        <line x1={sx(0)} x2={sx(0)} y1="14" y2={BASE} stroke="rgb(242 248 249 / 0.18)" strokeDasharray="3 3" />
        <text x={sx(0)} y="119" fontSize="9" textAnchor="middle" fill="rgb(143 166 174)">
          31/10
        </text>
        <text x={sx(1)} y="119" fontSize="9" textAnchor="middle" fill="rgb(143 166 174)">
          31/01
        </text>
        {chart.series.map((s, i) => {
          const d = `M${sx(0)} ${y0} L${sx(1)} ${sy(s.end)}`;
          const color = s.warm ? "var(--color-cta)" : "var(--color-primary)";
          return (
            <g key={s.label}>
              <path
                d={d}
                fill="none"
                stroke={color}
                strokeWidth="2.4"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={drawn ? 0 : 1}
                style={{ transition: drawn ? `stroke-dashoffset 1100ms var(--ease-expressive) ${i * 150}ms` : "none" }}
              />
              <circle
                cx={sx(1)}
                cy={sy(s.end)}
                r="5"
                fill={color}
                stroke="var(--color-canvas)"
                strokeWidth="2"
                onPointerEnter={() => setHover(i + 1)}
                onPointerLeave={() => setHover(null)}
                style={{ opacity: drawn ? 1 : 0, transition: drawn ? `opacity 400ms ${900 + i * 150}ms` : "none" }}
              />
            </g>
          );
        })}
        <circle
          cx={sx(0)}
          cy={y0}
          r="5"
          fill="var(--color-ink)"
          stroke="var(--color-canvas)"
          strokeWidth="2"
          onPointerEnter={() => setHover(0)}
          onPointerLeave={() => setHover(null)}
        />
      </>
    );
  }

  const tip = hover !== null ? hits[hover] : null;

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
          <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" aria-hidden="true">
            {chart.kind === "columns" &&
              [20, 60, 100].map((y) => (
                <line key={y} x1="0" x2={W} y1={y} y2={y} stroke="rgb(242 248 249 / 0.08)" />
              ))}
            {graphic}
          </svg>
          {tip && (
            <span
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[130%] whitespace-nowrap rounded-md border border-primary/35 bg-tooltip px-2.5 py-1.5 text-[12px] shadow-lg"
              style={{ left: `${(tip.x / W) * 100}%`, top: `${(tip.y / H) * 100}%` }}
            >
              {tip.label} · <b className="font-semibold text-primary">{tip.text}</b>
            </span>
          )}
        </div>

        <ul className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-ink-subtle">
          {item.legend.map((l) => (
            <li key={l.label} className="text-center leading-tight">
              <span className="block">{l.label}</span>
              <span className="mt-0.5 block font-medium text-ink-muted">{l.text}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-[11px] text-ink-subtle">{item.note}</p>
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
