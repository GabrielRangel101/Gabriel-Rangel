"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

export type TabItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  panel: ReactNode;
};

// Abas no padrão WAI-ARIA: setas, Home e End movem o foco; só a aba ativa entra na ordem do Tab.
// Os painéis ficam todos no HTML (hidden), então a página continua estática e indexável.
export function Tabs({ label, tabs }: { label: string; tabs: TabItem[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(event: KeyboardEvent, index: number) {
    const last = tabs.length - 1;
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % tabs.length
        : event.key === "ArrowLeft"
          ? (index - 1 + tabs.length) % tabs.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    setActive(tabs[next].id);
    buttons.current[next]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        className="mx-auto flex w-fit max-w-full gap-1 rounded-full border border-hairline bg-surface-1 p-1"
      >
        {tabs.map((tab, index) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                buttons.current[index] = el;
              }}
              role="tab"
              type="button"
              id={`aba-${tab.id}`}
              aria-selected={selected}
              aria-controls={`painel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={`text-button touch-target transition-ui inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 sm:px-5 ${
                selected
                  ? "bg-surface-3 text-ink"
                  : "text-ink-subtle hover:text-ink"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`painel-${tab.id}`}
          aria-labelledby={`aba-${tab.id}`}
          hidden={tab.id !== active}
          className="mt-8"
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
