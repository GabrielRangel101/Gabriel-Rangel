"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import cutout from "@/assets/gabriel-recorte.webp";
import { Container } from "@/components/ui/Container";
import { GlassCta } from "@/components/ui/GlassCta";
import { CasesPanel } from "./CasesPanel";
import { AgentIcon, DataIcon, FlowIcon } from "./RoleIcons";

// Colunas do fundo: duração e atraso de cada feixe; o segundo feixe de algumas colunas é laranja.
const columns = [
  { d: 7, dl: 0, beams: [0] },
  { d: 9, dl: 2.2, beams: [0, 1] },
  { d: 6, dl: 4.1, beams: [0] },
  { d: 8, dl: 1.3, beams: [1] },
  { d: 10, dl: 5.6, beams: [0] },
  { d: 7.5, dl: 3.2, beams: [0, 1] },
  { d: 9, dl: 0.8, beams: [0] },
  { d: 6.5, dl: 4.8, beams: [0] },
];

const roles = [
  { label: "Analista de dados", icon: <DataIcon /> },
  { label: "Automação com IA", icon: <FlowIcon /> },
  { label: "Agentes de IA", icon: <AgentIcon /> },
];

function Letters({ text, offset }: { text: string; offset: number }) {
  return text.split("").map((ch, i) => (
    <span key={i} className="name-ch" style={{ "--i": i + offset } as React.CSSProperties}>
      {ch}
    </span>
  ));
}

export function HeroStage() {
  const stageRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const litRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // Deriva leve da foto no scroll (todos os dispositivos).
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const top = stage.getBoundingClientRect().top;
        const dy = Math.min(Math.max(-top, 0), window.innerHeight) * 0.1;
        photoRef.current?.style.setProperty("--dy", `${dy}px`);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Lanterna e peso das letras: só com mouse.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return () => window.removeEventListener("scroll", onScroll);
    }
    const letters = Array.from(nameRef.current?.querySelectorAll<HTMLElement>(".name-ch") ?? []);
    let mx = -999;
    let my = -999;
    let queued = false;
    const weights = () => {
      queued = false;
      letters.forEach((el) => {
        const r = el.getBoundingClientRect();
        const d = Math.hypot(mx - (r.left + r.width / 2), (my - (r.top + r.height / 2)) * 0.8);
        const w = 300 + (1 - Math.min(Math.max(d / 240, 0), 1)) * 600;
        el.style.fontVariationSettings = `"wght" ${Math.round(w)}`;
      });
    };
    const setLight = (x: string, y: string) => {
      for (const el of [bgRef.current, litRef.current]) {
        el?.style.setProperty("--fx", x);
        el?.style.setProperty("--fy", y);
      }
    };
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      setLight(`${e.clientX - r.left}px`, `${e.clientY - r.top}px`);
      mx = e.clientX;
      my = e.clientY;
      if (!queued) {
        queued = true;
        requestAnimationFrame(weights);
      }
    };
    const onLeave = () => {
      setLight("-400px", "-400px");
      mx = -999;
      my = -999;
      requestAnimationFrame(weights);
    };
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("scroll", onScroll);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section
      ref={stageRef}
      aria-labelledby="hero-titulo"
      className="relative isolate overflow-hidden h-[max(640px,calc(100svh-56px))] lg:h-[clamp(600px,calc(100svh-56px),820px)]"
    >
      <div ref={bgRef} className="stage-bg" aria-hidden="true">
        <div className="stage-cols">
          {columns.map((col, i) => (
            <div key={i}>
              {col.beams.map((warm, k) => (
                <i
                  key={k}
                  className={`beam${warm ? " is-warm" : ""}`}
                  style={
                    {
                      "--d": `${col.d + k * 1.7}s`,
                      "--dl": `${col.dl + k * 3.1}s`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
          ))}
        </div>
        <div ref={litRef} className="stage-cols is-lit">
          {columns.map((_, i) => (
            <div key={i} />
          ))}
        </div>
      </div>

      <Container className="relative z-[3] flex h-full flex-col pb-6 pt-4 lg:pb-8 lg:pt-10">
        <ul
          aria-label="Especialidades"
          className="flex flex-nowrap gap-2 text-[10.5px] uppercase tracking-[0.03em] text-ink-subtle lg:absolute lg:right-8 lg:top-[calc(2.5rem+clamp(54px,11.6vw,172px)*0.18)] lg:w-[min(320px,30%)] lg:flex-col lg:gap-0 lg:text-[clamp(17px,1.6vw,22px)] lg:normal-case lg:tracking-[-0.01em] lg:text-ink"
        >
          {roles.map((role, i) => (
            <li
              key={role.label}
              className="rise whitespace-nowrap max-lg:[&+&]:before:mr-2 max-lg:[&+&]:before:text-cta max-lg:[&+&]:before:content-['·'] lg:flex lg:items-center lg:gap-4 lg:border-t lg:border-line-soft lg:py-3 lg:transition-[color,padding] lg:duration-300 lg:last:border-b lg:hover:pl-2 lg:hover:text-primary"
              style={{ "--delay": `${1100 + i * 120}ms` } as React.CSSProperties}
            >
              <span className="max-lg:hidden">{role.icon}</span>
              {role.label}
            </li>
          ))}
        </ul>

        <h1
          id="hero-titulo"
          ref={nameRef}
          className="mt-3 text-[clamp(54px,17vw,92px)] font-light uppercase leading-[0.9] tracking-[-0.04em] sm:text-[clamp(54px,11.6vw,172px)] lg:mt-0"
        >
          <span className="block whitespace-nowrap" aria-hidden="true">
            <Letters text="Gabriel" offset={0} />
          </span>
          <span className="block whitespace-nowrap text-primary" aria-hidden="true">
            <Letters text="Rangel" offset={7} />
          </span>
          <span className="sr-only">Gabriel Rangel, analista de dados e automação com IA</span>
        </h1>

        <div
          ref={photoRef}
          className="pointer-events-none relative -mb-14 -mt-4 h-[210px] self-end translate-y-[var(--dy,0px)] sm:h-[300px] lg:absolute lg:bottom-0 lg:right-0 lg:mb-0 lg:mt-0 lg:h-[clamp(280px,44vh,390px)]"
        >
          <Image
            src={cutout}
            alt="Retrato de Gabriel Rangel"
            priority
            sizes="(min-width: 1024px) 390px, 300px"
            className="cutout h-full w-auto [mask-image:linear-gradient(180deg,#000_78%,transparent)]"
          />
        </div>

        <div
          className="rise relative mt-auto flex flex-col items-start gap-4 lg:flex-row lg:items-end lg:gap-10"
          style={{ "--delay": "1000ms" } as React.CSSProperties}
        >
          <CasesPanel />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <GlassCta href="/projetos">Ver projetos</GlassCta>
            <Link
              href="/sobre"
              className="link-retract text-button touch-target text-ink-muted hover:text-ink"
            >
              Sobre mim
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
