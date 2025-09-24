import { BadgeIcon, Button, Card, InputField, SectionHeader } from "../components/ui";

const LocationIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 11a3 3 0 100-6 3 3 0 000 6z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19.5 11c0 7-7.5 11-7.5 11S4.5 18 4.5 11a7.5 7.5 0 1115 0z"
    />
  </svg>
);

const ExperienceIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 5h18M7 5v14m10-14v14M5 19h14"
    />
  </svg>
);

const ConsultationIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 11c1.657 0 3-.895 3-2s-1.343-2-3-2-3 .895-3 2 1.343 2 3 2zm0 0v1m0 4h.01m-6-1a6 6 0 1112 0v2H6v-2z"
    />
  </svg>
);

const lawyers = [
  {
    name: "Johnson & Associates Law Firm",
    address: ["123 Main Street, Suite 200", "Chicago, IL 60601"],
    experience: "15+ years experience",
    offer: "Free consultation",
  },
  {
    name: "Disability Rights Legal Group",
    address: ["456 Oak Avenue, Floor 3", "Chicago, IL 60602"],
    experience: "20+ years experience",
    offer: "No fee unless you win",
  },
  {
    name: "Miller & Thompson Attorneys",
    address: ["789 Pine Street, Suite 150", "Chicago, IL 60603"],
    experience: "12+ years experience",
    offer: "Free consultation",
  },
];

export default function LawyersPage() {
  return (
    <main className="min-h-screen bg-[color:var(--color-surface-alt)]">
      <section className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)] py-[var(--space-section)]">
        <div className="app-container">
          <SectionHeader
            eyebrow="Attorney Network"
            title="Find a disability lawyer near you"
            lead="Connect with trusted Social Security Disability attorneys who understand how to strengthen your claim."
          />
        </div>
      </section>

      <section className="app-container py-[var(--space-section)]">
        <Card padding="lg" className="section-stack">
          <div className="flex flex-col gap-2 text-left">
            <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
              Search for lawyers
            </h2>
            <p className="text-sm text-[color:var(--color-text-secondary)]">
              Enter a city or ZIP code to see attorneys who offer free consultations for Social Security Disability cases.
            </p>
          </div>
          <form className="flex flex-col gap-4 md:flex-row md:items-end">
            <InputField
              id="lawyer-search"
              label="Location"
              placeholder="Enter ZIP code or city"
              className="flex-1"
            />
            <Button type="submit" size="md" className="md:self-stretch">
              Search
            </Button>
          </form>
        </Card>

        <div className="mt-[calc(var(--space-stack))] space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
              Disability lawyers in your area
            </h2>
            <p className="mt-2 text-[color:var(--color-text-secondary)]">
              Showing results near your location.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lawyers.map(({ name, address, experience, offer }) => (
              <Card key={name} padding="lg" elevated>
                <div className="section-stack text-left">
                  <div>
                    <h3 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
                      {name}
                    </h3>
                    <div className="mt-3 flex items-start gap-3 text-sm text-[color:var(--color-text-secondary)]">
                      <LocationIcon className="mt-1 h-4 w-4 text-[color:var(--color-text-muted)]" />
                      <div className="space-y-1">
                        {address.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <dl className="flex flex-wrap gap-4 text-sm text-[color:var(--color-text-muted)]">
                    <div className="flex items-center gap-2">
                      <ExperienceIcon className="h-4 w-4" />
                      <span>{experience}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ConsultationIcon className="h-4 w-4" />
                      <span>{offer}</span>
                    </div>
                  </dl>

                  <Button size="md" className="w-full">
                    View profile
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Card tone="subtle" padding="lg" className="text-center">
            <SectionHeader
              eyebrow="Need assistance?"
              title="Not sure where to begin?"
              lead="All lawyers in our directory specialize in Social Security Disability cases and offer free consultations, so you can talk through your situation risk-free."
              align="center"
              className="mb-6"
            />
            <div className="flex flex-wrap justify-center gap-4 text-sm text-[color:var(--color-primary-700)]">
              {[
                "Free consultations available",
                "Experienced disability attorneys",
                "No upfront fees required",
              ].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <BadgeIcon
                    icon={ConsultationIcon}
                    tone="primary"
                    size="sm"
                    className="h-8 w-8 text-[color:var(--color-primary-600)]"
                  />
                  {item}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
