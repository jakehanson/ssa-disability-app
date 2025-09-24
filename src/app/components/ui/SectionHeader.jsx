export default function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "center",
  className = "",
}) {
  const alignment = {
    left: "items-start text-left",
    center: "items-center text-center",
  };

  return (
    <div className={`flex flex-col gap-3 ${alignment[align]} ${className}`.trim()}>
      {eyebrow ? (
        <span className="text-sm font-semibold tracking-wide uppercase text-[color:var(--color-primary-600)]">
          {eyebrow}
        </span>
      ) : null}
      {title ? (
        <h2 className="text-balance text-[length:var(--font-size-3xl)] font-semibold text-[color:var(--color-text-primary)]">
          {title}
        </h2>
      ) : null}
      {lead ? (
        <p className="max-w-2xl text-lg text-[color:var(--color-text-secondary)]">{lead}</p>
      ) : null}
    </div>
  );
}

