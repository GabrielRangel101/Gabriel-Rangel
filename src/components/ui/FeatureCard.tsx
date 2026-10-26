import type { ComponentType, SVGProps } from "react";

export function FeatureCard({
  icon: Icon,
  title,
  children,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  children: string;
}) {
  return (
    <div className="rounded-lg border border-hairline bg-surface-1 p-6">
      <Icon width={24} height={24} className="text-ink-muted" />
      <h3 className="text-card-title mt-4">{title}</h3>
      <p className="text-body-sm mt-2 text-ink-muted">{children}</p>
    </div>
  );
}
