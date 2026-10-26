// Confere razões de contraste WCAG dos pares de cor do DESIGN.md.
// Uso: node scripts/contrast.mjs   (sai com código 1 se algum par reprovar)

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const c = {
  primary: "#2bc4cf",
  onPrimary: "#010102",
  primaryHover: "#4fd6df",
  primaryPressed: "#1fa7b1",
  ink: "#f7f8f8",
  inkMuted: "#d0d6e0",
  inkSubtle: "#8a8f98",
  canvas: "#010102",
  surface1: "#0f1011",
  surface2: "#141516",
  inputBorder: "#62666d",
  error: "#f87171",
  warning: "#fbbf24",
  success: "#27a644",
};

// [descrição, primeiro plano, fundo, mínimo]
const pairs = [
  ["Botão primário (texto escuro no acento)", c.onPrimary, c.primary, 4.5],
  ["Botão primário hover", c.onPrimary, c.primaryHover, 4.5],
  ["Botão primário pressionado", c.onPrimary, c.primaryPressed, 4.5],
  ["Link (acento) no canvas", c.primary, c.canvas, 4.5],
  ["Link (acento) na surface-1", c.primary, c.surface1, 4.5],
  ["Anel de foco no canvas", c.primary, c.canvas, 3],
  ["Texto principal no canvas", c.ink, c.canvas, 4.5],
  ["Texto secundário na surface-1", c.inkMuted, c.surface1, 4.5],
  ["Texto sutil na surface-1", c.inkSubtle, c.surface1, 4.5],
  ["Texto sutil na surface-2", c.inkSubtle, c.surface2, 4.5],
  ["Borda de input na surface-1", c.inputBorder, c.surface1, 3],
  ["Erro na surface-1", c.error, c.surface1, 4.5],
  ["Aviso na surface-1", c.warning, c.surface1, 4.5],
  ["Sucesso na surface-1", c.success, c.surface1, 4.5],
];

let failed = 0;
for (const [name, fg, bg, min] of pairs) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(
    `${ok ? "OK  " : "FAIL"} ${r.toFixed(2).padStart(5)}:1  (mín ${min})  ${name}`,
  );
}
process.exit(failed ? 1 : 0);
