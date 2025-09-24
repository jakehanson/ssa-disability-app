export default function BadgeIcon({
  icon: Icon,
  tone = "primary",
  size = "md",
  className = "",
}) {
  const toneClasses = {
    primary:
      "bg-[color:var(--color-primary-100)] text-[color:var(--color-primary-600)]",
    success: "bg-[color:var(--color-success-100)] text-[color:var(--color-success-500)]",
    info: "bg-[color:var(--color-info-100)] text-[color:var(--color-info-500)]",
    neutral:
      "bg-[color:var(--color-neutral-100)] text-[color:var(--color-neutral-700)]",
  };

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-14 w-14",
  };

  return (
    <span
      className={`flex items-center justify-center rounded-full ${toneClasses[tone]} ${sizeClasses[size]} ${className}`.trim()}
    >
      {Icon ? <Icon className="h-6 w-6" aria-hidden /> : null}
    </span>
  );
}

