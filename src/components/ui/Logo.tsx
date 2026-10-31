import type { SVGProps } from "react";

// Ícone da marca Rangel Analytics (R com anel). Cores fixas da marca, para fundo escuro.
export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="6 6 98 98"
      fill="none"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M40 78V32H54C70 32 70 56 54 56H40" stroke="#F1F5F9" />
      <path
        d="M54 56L64 70C72 82 100 76 99 55A44 44 0 1 0 83.3 88.7"
        stroke="#2DD4CF"
      />
      <circle cx="83.3" cy="88.7" r="6" fill="#F97316" stroke="none" />
    </svg>
  );
}
