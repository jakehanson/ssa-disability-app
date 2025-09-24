export default function MessageBubble({
  variant = "assistant",
  message,
  timestamp,
  name,
  className = "",
}) {
  const isAssistant = variant === "assistant";

  return (
    <div className={`flex gap-3 ${isAssistant ? "flex-row" : "flex-row-reverse"}`.trim()}>
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isAssistant ? "bg-[color:var(--color-primary-600)] text-white" : "bg-[color:var(--color-neutral-200)] text-[color:var(--color-text-primary)]"}`.trim()}
      >
        {isAssistant ? "AI" : "You"}
      </div>
      <div className={`flex flex-col items-start ${isAssistant ? "" : "items-end"}`}>
        <div
          className={`max-w-lg rounded-[var(--radius-lg)] px-4 py-3 text-sm shadow-xs ${isAssistant ? "bg-[color:var(--color-surface)] border border-[color:var(--color-border)] text-[color:var(--color-text-primary)]" : "bg-[color:var(--color-primary-600)] text-white"} ${className}`.trim()}
        >
          {typeof message === "string" ? (
            <p className="text-pretty leading-6">{message}</p>
          ) : (
            <div className="text-pretty leading-6">{message}</div>
          )}
        </div>
        {(name || timestamp) && (
          <p className={`mt-1 text-xs text-[color:var(--color-text-muted)] ${isAssistant ? "" : "text-right"}`}>
            {[name, timestamp].filter(Boolean).join(" • ")}
          </p>
        )}
      </div>
    </div>
  );
}

