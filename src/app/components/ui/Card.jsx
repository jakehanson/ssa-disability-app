export default function Card({
  as: Component = "div",
  className = "",
  children,
  tone = "default",
  padding = "lg",
  elevated = false,
  ...props
}) {
  const toneClasses = {
    default: "bg-[color:var(--color-surface)] border border-[color:var(--color-border)]",
    subtle: "bg-[color:var(--color-surface-alt)] border border-transparent",
    primary: "bg-[color:var(--color-primary-600)] text-white",
  };

  const paddingClasses = {
    none: "p-0",
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
  };

  const elevation = elevated ? "shadow-sm" : "shadow-xs";

  return (
    <Component
      className={`rounded-[var(--radius-lg)] ${toneClasses[tone]} ${paddingClasses[padding]} ${elevation} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

