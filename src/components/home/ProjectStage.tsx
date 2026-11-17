"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";
import { TypeTag } from "@/components/ui/Tag";
import type { CaseType } from "@/components/ui/Tag";

export type StageSlide = {
  slug: string;
  // Título de palco (curto); o card em /projetos usa o título completo.
  title: string;
  type: CaseType;
  metric: string;
  metricLabel: string;
  stack: string[];
  image?: StaticImageData;
};

const bgs = ["#07131a", "#0a1b25", "#0c202b"];

// Palco dos 3 melhores projetos. No desktop com movimento permitido, a seção fica fixa e cada
// projeto sai de cena por vez, conforme a rolagem. No celular e com movimento reduzido, vira uma
// lista empilhada (o CSS .work-* decide; este componente só calcula o progresso).
export function ProjectStage({ slides }: { slides: StageSlide[] }) {
  const n = slides.length;
  const [current, setCurrent] = useState(0);
  const workRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const work = workRef.current;
    if (!work) return;
    const pinned = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let ticking = false;

    const update = () => {
      ticking = false;
      if (!pinned.matches) {
        slideRefs.current.forEach((el) => el?.style.removeProperty("--c"));
        return;
      }
      const vh = window.innerHeight;
      const distance = work.offsetHeight - vh;
      const p = Math.min(1, Math.max(0, -work.getBoundingClientRect().top / distance));
      const t = p * (n - 1);
      slideRefs.current.forEach((el, i) => {
        const cut = i < n - 1 ? Math.min(1, Math.max(0, t - i)) * 100 : 0;
        el?.style.setProperty("--c", `${cut}%`);
      });
      setCurrent(Math.min(n - 1, Math.round(t)));
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    pinned.addEventListener("change", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      pinned.removeEventListener("change", onScroll);
    };
  }, [n]);

  return (
    <div ref={workRef} className="work-pin" style={{ "--n": n } as React.CSSProperties}>
      <div className="work-sticky">
        <p
          className="work-head text-eyebrow text-ink-subtle max-lg:hidden"
          aria-hidden="true"
        >
          Projetos em destaque · <span className="tabular-nums text-ink">0{current + 1}</span> / 0{n}
        </p>
        <ol className="work-dots max-lg:hidden" aria-hidden="true">
          {slides.map((s, i) => (
            <li key={s.slug} className={i === current ? "on" : ""} />
          ))}
        </ol>

        {slides.map((slide, i) => (
          <article
            key={slide.slug}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className={`work-slide ${i === current ? "on" : ""}`}
            style={{ background: bgs[i % bgs.length], zIndex: n - i }}
            aria-labelledby={`palco-${slide.slug}`}
          >
            <div className="mx-auto grid w-full max-w-content items-center gap-8 px-4 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] tabular-nums tracking-[0.14em] text-primary">
                    0{i + 1}
                  </span>
                  <TypeTag type={slide.type} />
                </div>
                <h3
                  id={`palco-${slide.slug}`}
                  className="work-title mt-4 text-[clamp(36px,6vw,88px)] font-light uppercase leading-[0.98] tracking-[-0.035em]"
                  aria-label={slide.title}
                >
                  {slide.title.split(" ").map((word, w, words) => {
                    const offset = words.slice(0, w).join("").length;
                    return (
                      <span key={w} aria-hidden="true" className="mr-[0.25em] inline-block whitespace-nowrap">
                        {word.split("").map((ch, c) => (
                          <span key={c} className="m">
                            <i style={{ "--i": offset + c } as React.CSSProperties}>{ch}</i>
                          </span>
                        ))}
                      </span>
                    );
                  })}
                </h3>
                <p className="mt-5 text-[clamp(26px,3vw,44px)] font-semibold leading-none tracking-[-0.02em] text-cta tabular-nums">
                  {slide.metric}
                </p>
                <p className="text-body mt-2 text-ink-muted">{slide.metricLabel}</p>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Ferramentas">
                  {slide.stack.slice(0, 4).map((tool) => (
                    <li
                      key={tool}
                      className="text-body-sm rounded-full border border-line-soft px-3 py-1 text-ink-muted"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/projetos/${slide.slug}`}
                  className="link-retract text-button touch-target mt-7 text-primary"
                >
                  Ver projeto
                  <ArrowRightIcon />
                </Link>
              </div>

              {slide.image && (
                <Link
                  href={`/projetos/${slide.slug}`}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="work-mock relative block aspect-[16/10] overflow-hidden rounded-[14px] border border-line-soft bg-surface-1 shadow-[0_30px_80px_rgb(0_0_0/0.45)]"
                >
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 560px, 100vw"
                    placeholder="blur"
                    quality={90}
                    className="object-cover object-top"
                  />
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
