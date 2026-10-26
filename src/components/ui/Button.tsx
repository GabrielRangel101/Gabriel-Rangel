import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "secondary" | "tertiary";

const base =
  "touch-target text-button transition-ui inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-pressed",
  secondary:
    "border border-hairline bg-surface-1 text-ink hover:border-hairline-strong hover:bg-surface-2",
  tertiary: "bg-canvas text-ink hover:bg-surface-1",
};

type ButtonProps = {
  variant?: Variant;
} & (
  | ({ href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href">)
  | ({ href?: undefined } & ComponentPropsWithoutRef<"button">)
);

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (props.href !== undefined) {
    return <Link className={classes} {...props} />;
  }
  return <button type="button" className={classes} {...props} />;
}
