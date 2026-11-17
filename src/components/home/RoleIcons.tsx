// Ícones animados das especialidades do hero. Decorativos (aria-hidden); o texto ao lado é o nome.
// Cada um mostra o que a especialidade faz: barras que oscilam, fluxo entre nós, balão digitando.
const base = "size-7 shrink-0 text-primary";

export function DataIcon() {
  return (
    <svg viewBox="0 0 28 28" className={base} fill="currentColor" aria-hidden="true">
      {[3, 9, 15, 21].map((x, i) => (
        <rect
          key={x}
          x={x}
          y="4"
          width="4"
          height="20"
          rx="2"
          className="role-bar"
          style={{ animationDelay: `${i * 180}ms` }}
        />
      ))}
    </svg>
  );
}

export function FlowIcon() {
  return (
    <svg viewBox="0 0 28 28" className={base} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 14h16" strokeLinecap="round" strokeDasharray="3 4" className="role-flow" opacity="0.7" />
      <circle cx="5" cy="14" r="3.2" fill="var(--color-canvas)" />
      <circle cx="14" cy="14" r="3.2" fill="var(--color-canvas)" className="role-node" />
      <circle cx="23" cy="14" r="3.2" fill="var(--color-canvas)" stroke="var(--color-cta)" />
    </svg>
  );
}

export function AgentIcon() {
  return (
    <svg viewBox="0 0 28 28" className={base} fill="none" aria-hidden="true">
      <path
        d="M5 6h18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9l-5 4v-4H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {[9.5, 14, 18.5].map((x, i) => (
        <circle
          key={x}
          cx={x}
          cy="12.5"
          r="1.7"
          fill="currentColor"
          className="role-dot"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </svg>
  );
}
