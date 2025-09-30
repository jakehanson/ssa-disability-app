'use client';

import { useState } from "react";
import { Button, Card, InputField, MessageBubble } from "../components/ui";

const INITIAL_MESSAGES = [
  {
    id: "assistant-1",
    variant: "assistant",
    message:
      "Hi there! I'm here to help you understand your potential eligibility for Social Security disability benefits.\n\nPlease describe what health challenges are making it difficult for you to work.",
    timestamp: new Date(),
    name: "Assistant",
  },
];

export default function AssessmentPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createMessageId = (prefix) =>
    `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedInput = inputValue.trim();
    if (!trimmedInput) {
      return;
    }

    const userMessage = {
      id: createMessageId("user"),
      variant: "user",
      message: trimmedInput,
      timestamp: new Date(),
      name: "You",
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      const replyText = data?.message ?? data?.reply ?? "";

      if (!replyText) {
        throw new Error("No reply from server");
      }

      const assistantMessage = {
        id: createMessageId("assistant"),
        variant: "assistant",
        message: replyText,
        timestamp: new Date(),
        name: "Assistant",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to send message", error);

      const errorMessage = {
        id: createMessageId("assistant-error"),
        variant: "assistant",
        message: "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
        name: "Assistant",
      };

      setMessages((prev) => [...prev, errorMessage]);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-screen flex-col bg-[color:var(--color-surface-alt)]">
      <header className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        <div className="app-container py-6">
          <Card tone="subtle" padding="md" className="shadow-none">
            <div className="flex flex-col gap-2 text-left">
              <span className="text-sm font-medium uppercase tracking-wide text-[color:var(--color-primary-600)]">
                Guided assessment
              </span>
              <h1 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
                Social Security Disability Assessment
              </h1>
              <p className="text-sm text-[color:var(--color-text-secondary)]">
                We’ll walk through a short set of questions to understand your eligibility.
              </p>
            </div>
          </Card>
        </div>
      </header>

      <section className="flex-1">
        <div className="app-container flex h-full flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto py-8">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                variant={message.variant}
                message={message.message}
                timestamp={message.timestamp}
                name={message.name}
                className={message.variant === "user" ? "ml-auto" : undefined}
              />
            ))}
            {isLoading && (
              <MessageBubble
                key="assistant-loading"
                variant="assistant"
                message="typing..."
                timestamp={new Date()}
                name="Assistant"
              />
            )}
          </div>

          <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-6 py-6">
            <form
              className="flex flex-col gap-4 md:flex-row md:items-end"
              onSubmit={handleSubmit}
              suppressHydrationWarning
            >
              <InputField
                id="message"
                placeholder="Type your response here..."
                className="flex-1"
                inputClassName="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-[var(--radius-lg)] shadow-xs"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
              />
              <Button type="submit" size="md" className="w-full self-end md:w-auto md:self-end">
                Send
              </Button>
            </form>
            <p className="mt-3 text-xs text-[color:var(--color-text-muted)]">
              Your responses are confidential and will not be shared.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}