import type { ComponentPropsWithoutRef } from "react";

export function Container({
  className = "",
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={`mx-auto w-full max-w-content px-4 md:px-8 ${className}`}
      {...props}
    />
  );
}
