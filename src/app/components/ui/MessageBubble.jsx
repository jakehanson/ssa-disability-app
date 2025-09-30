"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function MessageBubble({
  variant = "assistant",
  message,
  timestamp,
  name,
  className = "",
}) {
  const isAssistant = variant === "assistant";
  const [relativeTime, setRelativeTime] = useState(() =>
    timestamp instanceof Date ? formatDistanceToNow(timestamp, { addSuffix: true }) : timestamp
  );

  useEffect(() => {
    if (!(timestamp instanceof Date)) {
      setRelativeTime(timestamp);
      return;
    }

    const updateRelativeTime = () => {
      setRelativeTime(formatDistanceToNow(timestamp, { addSuffix: true }));
    };

    updateRelativeTime();

    const interval = setInterval(updateRelativeTime, 30_000);
    return () => clearInterval(interval);
  }, [timestamp]);

  return (
    <div className={`flex gap-3 ${isAssistant ? "flex-row" : "flex-row-reverse"}`.trim()}>
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
      >
        {isAssistant ? (
          <Image
            src="/chat-avatar.png"
            alt="Assistant Avatar"
            width={36}
            height={36}
            priority
          />
        ) : (
          "You"
        )}
      </div>
      <div className={`flex flex-col items-start ${isAssistant ? "" : "items-end"}`}>
        <div
          className={`max-w-lg rounded-[var(--radius-lg)] px-4 py-3 text-sm shadow-xs ${isAssistant ? "bg-[color:var(--color-surface)] border border-[color:var(--color-border)] text-[color:var(--color-text-primary)]" : "bg-[color:var(--color-primary-600)] text-white"} ${className}`.trim()}
        >
          {isAssistant ? (
            <div className="prose prose-sm prose-slate text-pretty leading-6 dark:prose-invert">
              <ReactMarkdown>{message}</ReactMarkdown>
            </div>
          ) : typeof message === "string" ? (
            <p className="text-pretty leading-6">{message}</p>
          ) : (
            <div className="text-pretty leading-6">{message}</div>
          )}
        </div>
        {(name || relativeTime) && (
          <p className={`mt-1 text-xs text-[color:var(--color-text-muted)] ${isAssistant ? "" : "text-right"}`}>
            {[name, relativeTime].filter(Boolean).join(" • ")}
          </p>
        )}
      </div>
    </div>
  );
}

