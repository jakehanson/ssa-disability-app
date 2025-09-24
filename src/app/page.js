import Link from "next/link";
import {
  BadgeIcon,
  Button,
  Card,
  SectionHeader,
} from "./components/ui";

const CheckIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const ReportIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 5a3 3 0 006 0M12 11h4M12 15h4M8 11h.01M8 15h.01"
    />
  </svg>
);

const CompassIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16.24 7.76l-4.24 1.06-1.06 4.24 4.24-1.06 1.06-4.24z"
    />
  </svg>
);

const ArrowIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 7l5 5m0 0l-5 5m5-5H6"
    />
  </svg>
);

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[color:var(--color-primary-50)] to-[color:var(--color-primary-100)] py-[var(--space-section)]">
      <div className="app-container text-center">
        <section className="section-stack">
          <SectionHeader
            eyebrow="Social Security Disability Support"
            title="Start your free disability assessment"
            lead="Understand your eligibility and get personalized guidance on the next steps for Social Security Disability benefits."
            align="center"
          />

          <div className="flex justify-center">
            <Button
              href="/assessment"
              size="lg"
              icon={<ArrowIcon />}
              iconPosition="right"
            >
              Start My Free Assessment
            </Button>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-6 text-sm text-[color:var(--color-text-muted)]">
            {["100% Free", "Confidential & secure", "Takes 5–10 minutes"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-[color:var(--color-success-500)]" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16">
          <Card className="section-stack">
            <div className="flex flex-col gap-3 text-left">
              <h3 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
                What you’ll receive
              </h3>
              <p className="text-[color:var(--color-text-secondary)]">
                Discover actionable insights tailored to your Social Security Disability case.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Eligibility Check",
                  copy: "Understand if you qualify for SSDI or SSI benefits.",
                  icon: CheckIcon,
                  tone: "success",
                },
                {
                  title: "Personalized Report",
                  copy: "Receive a breakdown of what matters most for your situation.",
                  icon: ReportIcon,
                  tone: "info",
                },
                {
                  title: "Next Steps",
                  copy: "Get clear guidance on how to move forward confidently.",
                  icon: CompassIcon,
                  tone: "primary",
                },
              ].map(({ title, copy, icon, tone }) => (
                <div key={title} className="text-left">
                  <BadgeIcon
                    icon={icon}
                    tone={tone}
                    className="mb-4 mx-auto md:mx-0 text-[color:var(--color-primary-600)]"
                  />
                  <h4 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
                    {title}
                  </h4>
                  <p className="mt-2 text-[color:var(--color-text-secondary)]">{copy}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
