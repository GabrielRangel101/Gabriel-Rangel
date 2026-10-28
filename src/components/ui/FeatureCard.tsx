import type { ComponentType, SVGProps } from "react";

export function FeatureCard({
  icon: Icon,
  title,
  note,
  children,
}: {
  note?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  children: string;
}) {
  return (
    <div className="rounded-lg border border-hairline bg-surface-1 p-6">
      <Icon width={24} height={24} className="text-ink-muted" />
      <h3 className="text-card-title mt-4">{title}</h3>
      {note && (
        <p className="text-caption mt-2 inline-block rounded-full border border-hairline-strong px-2 py-0.5 text-ink-subtle">
          {note}
        </p>
      )}
      <p className="text-body-sm mt-2 text-ink-muted">{children}</p>
    </div>
  );
}
