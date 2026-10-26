"use client";

import { useEffect, useRef, useState } from "react";

// Renderiza a página numa largura de desktop e reduz para caber na moldura (miniatura que continua clicável).
// A proporção reserva a altura no servidor, então não há salto de layout.
export function ScaledFrame({
  src,
  title,
  baseWidth = 1100,
  ratio = 4 / 3,
}: {
  src: string;
  title: string;
  baseWidth?: number;
  ratio?: number;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / baseWidth);
    });
    observer.observe(box);
    return () => observer.disconnect();
  }, [baseWidth]);

  return (
    <div
      ref={boxRef}
      className="relative w-full overflow-hidden bg-surface-2"
      style={{ aspectRatio: ratio }}
    >
      <iframe
        src={src}
        title={title}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        className="absolute left-0 top-0 origin-top-left border-0"
        style={{
          width: baseWidth,
          height: baseWidth / ratio,
          transform: `scale(${scale})`,
        }}
      />
    </div>
  );
}
