export default function InputField({
  label,
  description,
  error,
  className = "",
  inputClassName = "",
  ...props
}) {
  const describedBy = [];
  if (description) describedBy.push(`${props.id}-description`);
  if (error) describedBy.push(`${props.id}-error`);

  return (
    <div className={`flex flex-col gap-2 ${className}`.trim()}>
      {label ? (
        <label
          className="text-sm font-medium text-[color:var(--color-text-primary)]"
          htmlFor={props.id}
        >
          {label}
        </label>
      ) : null}
      <input
        className={`w-full rounded-[var(--radius)] border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm text-[color:var(--color-text-primary)] shadow-xs outline-none transition focus:border-transparent focus:ring-2 focus:ring-[color:var(--color-primary-300)] ${inputClassName}`.trim()}
        aria-describedby={describedBy.join(" ") || undefined}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {description ? (
        <p id={`${props.id}-description`} className="text-xs text-[color:var(--color-text-muted)]">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={`${props.id}-error`} className="text-xs text-[color:var(--color-warning-500)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

