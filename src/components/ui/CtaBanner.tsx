import type { ReactNode } from "react";

export function CtaBanner({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-hairline bg-surface-1 p-6 md:p-12">
      <h2 className="text-headline max-w-xl">{title}</h2>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">{children}</div>
    </div>
  );
}
