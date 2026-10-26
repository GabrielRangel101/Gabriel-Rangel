import { useId } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { AlertIcon } from "./icons";

// Campo com rótulo sempre visível; ajuda e erro ficam abaixo, ligados por aria-describedby.
type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
};

const control =
  "text-body w-full rounded-md border border-input-border bg-surface-1 px-3 py-2.5 text-ink placeholder:text-ink-subtle min-h-11 aria-[invalid=true]:border-error";

function useField(error?: string, hint?: string) {
  const id = useId();
  const describedBy =
    [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(" ") ||
    undefined;
  return { id, describedBy };
}

function Message({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  return (
    <>
      {hint && (
        <p id={`${id}-hint`} className="text-body-sm text-ink-subtle">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          className="text-body-sm flex items-start gap-2 text-error"
        >
          <AlertIcon className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
    </>
  );
}

export function TextField({
  label,
  hint,
  error,
  className = "",
  ...props
}: FieldProps & ComponentPropsWithoutRef<"input">) {
  const { id, describedBy } = useField(error, hint);
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-body-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${control} ${className}`}
        {...props}
      />
      <Message id={id} error={error} hint={hint} />
    </div>
  );
}

export function TextArea({
  label,
  hint,
  error,
  className = "",
  ...props
}: FieldProps & ComponentPropsWithoutRef<"textarea">) {
  const { id, describedBy } = useField(error, hint);
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-body-sm font-medium text-ink">
        {label}
      </label>
      <textarea
        id={id}
        rows={5}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${control} resize-y ${className}`}
        {...props}
      />
      <Message id={id} error={error} hint={hint} />
    </div>
  );
}
