"use client";

import { useEffect, useRef, useState } from "react";
import { Skeleton } from "./Skeleton";

// Iframe de demo com skeleton enquanto carrega. Três modos:
// - baseWidth e baseHeight: renderiza o conteúdo no tamanho nativo e reduz para caber na largura da
//   moldura (visores que abrem em 100%, como o Power BI, cortariam o relatório e mostrariam rolagem);
// - ratio: a altura acompanha a largura da moldura (ex.: Looker Studio);
// - nenhum: 70% da altura da tela no celular e 16/10 no desktop.
export function EmbedFrame({
  src,
  title,
  ratio,
  baseWidth,
  baseHeight,
  settleMs = 0,
}: {
  src: string;
  title: string;
  // Largura / altura do conteúdo, no formato "16 / 9".
  ratio?: string;
  baseWidth?: number;
  baseHeight?: number;
  // Tempo extra de skeleton depois do evento load, para visores que desenham o conteúdo depois.
  settleMs?: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [scale, setScale] = useState(0.5);
  const boxRef = useRef<HTMLDivElement>(null);
  const scaled = baseWidth !== undefined && baseHeight !== undefined;

  useEffect(() => {
    const box = boxRef.current;
    if (!scaled || !box) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / baseWidth);
    });
    observer.observe(box);
    return () => observer.disconnect();
  }, [scaled, baseWidth]);

  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => setReady(true), settleMs);
    return () => clearTimeout(timer);
  }, [loaded, settleMs]);

  const [w, h] = ratio ? ratio.split("/").map((n) => Number(n.trim())) : [0, 0];
  const style = scaled
    ? ({ aspectRatio: `${baseWidth} / ${baseHeight}` } as React.CSSProperties)
    : ratio
      ? ({ aspectRatio: `${w} / ${h}` } as React.CSSProperties)
      : undefined;

  const size = scaled
    ? ""
    : ratio
      ? "h-[70dvh] min-h-[420px] md:h-auto md:min-h-0"
      : "h-[70dvh] min-h-[520px] md:h-auto md:aspect-[16/10]";

  return (
    <div ref={boxRef} className={`relative w-full overflow-hidden bg-surface-2 ${size}`} style={style}>
      {!ready && (
        <Skeleton className="absolute inset-0 z-10 flex items-center justify-center rounded-none">
          <span className="text-body-sm text-ink-subtle">Carregando a demo…</span>
        </Skeleton>
      )}
      <iframe
        src={src}
        title={title}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        onLoad={() => setLoaded(true)}
        className={
          scaled
            ? "absolute left-0 top-0 origin-top-left border-0"
            : "absolute inset-0 size-full border-0"
        }
        style={
          scaled
            ? {
                width: baseWidth,
                height: baseHeight,
                transform: `scale(${scale})`,
              }
            : undefined
        }
      />
    </div>
  );
}
