"use client";

import { useState } from "react";

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

const CalendarCheckIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 3v2m8-2v2M5 8h14"
    />
    <rect
      x="4"
      y="5"
      width="16"
      height="15"
      rx="2"
      ry="2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10 13l2 2 4-4"
    />
  </svg>
);

const ExpertiseIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 6l7 4-7 4-7-4 7-4z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 14l7 4 7-4"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 10l7 4 7-4"
    />
  </svg>
);

const ShieldCheckIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 3l7 3v5c0 4.418-3.134 8.84-7 10-3.866-1.16-7-5.582-7-10V6l7-3z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9.5 12.5l2 2 3-3"
    />
  </svg>
);

export default function LawyersPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch(event) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setError("Please enter a city or ZIP code to search for disability lawyers.");
      setHasSearched(false);
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/lawyers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmedQuery }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(
          payload?.error ?? "We couldn't fetch law firms for that location. Please try again."
        );
        setResults([]);
        return;
      }

      setResults(Array.isArray(payload?.results) ? payload.results : []);
      setHasSearched(true);
    } catch (caughtError) {
      console.error("Error loading lawyers:", caughtError);
      setError("Something went wrong while searching. Please try again in a moment.");
      setResults([]);
      setHasSearched(false);
    } finally {
      setLoading(false);
    }
  }

  function getAddressLines(lawFirm) {
    const addressLines = [];

    const primaryLine =
      lawFirm?.address_line1 ??
      lawFirm?.address1 ??
      lawFirm?.street ??
      lawFirm?.street_line1 ??
      lawFirm?.address;

    const secondaryLine =
      lawFirm?.address_line2 ??
      lawFirm?.address2 ??
      lawFirm?.street_line2 ??
      lawFirm?.suite ??
      null;

    const cityStateZip = [
      lawFirm?.city ?? lawFirm?.locality ?? lawFirm?.municipality ?? null,
      lawFirm?.state ?? lawFirm?.region ?? lawFirm?.state_code ?? null,
      lawFirm?.postal_code ?? lawFirm?.zip_code ?? lawFirm?.zip ?? null,
    ]
      .filter(Boolean)
      .join(", ");

    if (primaryLine) addressLines.push(primaryLine);
    if (secondaryLine) addressLines.push(secondaryLine);
    if (cityStateZip) addressLines.push(cityStateZip);

    return addressLines.length > 0 ? addressLines : ["Location details coming soon."];
  }

  function getExperienceText(lawFirm) {
    if (typeof lawFirm?.experience === "string") return lawFirm.experience;

    const years =
      lawFirm?.experience_years ??
      lawFirm?.years_experience ??
      lawFirm?.years ??
      null;

    if (typeof years === "number" && Number.isFinite(years)) {
      return `${years}+ years experience`;
    }

    if (typeof years === "string" && years.trim()) {
      return `${years.trim()} years experience`;
    }

    return null;
  }

  function getOfferText(lawFirm) {
    if (typeof lawFirm?.offer === "string") return lawFirm.offer;

    const freeConsultation = lawFirm?.free_consultation ?? lawFirm?.offers_free_consultation;

    if (freeConsultation === true || freeConsultation === "true") {
      return "Free consultation available";
    }

    if (freeConsultation === false || freeConsultation === "false") {
      return "Consultation details available";
    }

    return null;
  }

  function getDistanceText(lawFirm) {
    const distance = lawFirm?.distance_miles ?? lawFirm?.distance ?? null;

    if (typeof distance === "number" && Number.isFinite(distance)) {
      return `${distance.toFixed(1)} miles away`;
    }

    if (typeof distance === "string" && distance.trim()) {
      return `${distance.trim()} miles away`;
    }

    return null;
  }

  function getProfileLink(lawFirm) {
    return (
      lawFirm?.profile_url ??
      lawFirm?.profile_link ??
      lawFirm?.website ??
      lawFirm?.url ??
      null
    );
  }

  const statusDescription = (() => {
    if (loading) return "Searching for nearby disability lawyers...";
    if (error) return "We weren't able to load your results. Please adjust your search and try again.";
    if (hasSearched && results.length === 0)
      return "We couldn't find any law firms for that location. Try another city or ZIP code.";
    return "Enter a city or ZIP code to see attorneys who offer free consultations for Social Security Disability cases.";
  })();

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
          <form
            className="flex flex-col gap-4 md:flex-row md:items-end"
            onSubmit={handleSearch}
          >
            <InputField
              id="lawyer-search"
              label="Location"
              placeholder="Enter ZIP code or city"
              className="flex-1"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              disabled={loading}
              type="search"
            />
            <Button
              type="submit"
              size="md"
              className="md:self-end"
              disabled={loading}
            >
              Search
            </Button>
          </form>
        </Card>

        <div className="mt-[calc(var(--space-stack))] space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
              Disability lawyers in your area
            </h2>
            <p className="mt-2 text-[color:var(--color-text-secondary)]">{statusDescription}</p>
          </div>

          {loading ? (
            <Card tone="subtle" padding="lg">
              <p className="text-sm text-[color:var(--color-text-secondary)]">
                Searching our attorney network...
              </p>
            </Card>
          ) : null}

          {!loading && error ? (
            <Card tone="subtle" padding="lg" className="border-[color:var(--color-warning-200)]">
              <p className="text-sm text-[color:var(--color-warning-700)]">{error}</p>
            </Card>
          ) : null}

          <div className="grid auto-rows-fr gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((lawFirm, index) => {
              const name =
                lawFirm?.name ??
                lawFirm?.firm_name ??
                lawFirm?.law_firm_name ??
                lawFirm?.company ??
                "Law Firm";

              const addressLines = getAddressLines(lawFirm);
              const experienceText = getExperienceText(lawFirm);
              const offerText = getOfferText(lawFirm);
              const distanceText = getDistanceText(lawFirm);
              const profileLink = getProfileLink(lawFirm);

              const metaItems = [
                experienceText
                  ? {
                      icon: ExperienceIcon,
                      text: experienceText,
                    }
                  : null,
                offerText
                  ? {
                      icon: ConsultationIcon,
                      text: offerText,
                    }
                  : null,
                distanceText
                  ? {
                      icon: LocationIcon,
                      text: distanceText,
                    }
                  : null,
              ].filter(Boolean);

              return (
                <Card
                  key={lawFirm?.id ?? lawFirm?.slug ?? `${name}-${index}`}
                  padding="lg"
                  elevated
                  className="flex h-full"
                >
                  <div className="section-stack text-left flex-1">
                    <div>
                      <h3 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
                        {name}
                      </h3>
                      <div className="mt-3 flex items-start gap-3 text-sm text-[color:var(--color-text-secondary)]">
                        <LocationIcon className="mt-1 h-4 w-4 text-[color:var(--color-text-muted)]" />
                        <div className="space-y-1">
                          {addressLines.map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                        </div>
                      </div>
                    </div>

                    {metaItems.length > 0 ? (
                      <dl className="flex flex-wrap gap-4 text-sm text-[color:var(--color-text-muted)]">
                        {metaItems.map(({ icon: Icon, text }) => (
                          <div key={text} className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span>{text}</span>
                          </div>
                        ))}
                      </dl>
                    ) : null}

                    {profileLink ? (
                      <Button size="md" className="w-full" href={profileLink}>
                        View profile
                      </Button>
                    ) : null}
                  </div>
                </Card>
              );
            })}
          </div>

          {!loading && !error && hasSearched && results.length === 0 ? (
            <Card tone="subtle" padding="lg" className="text-center">
              <p className="text-sm text-[color:var(--color-text-secondary)]">
                No disability law firms matched that search. Try another nearby city or ZIP code.
              </p>
            </Card>
          ) : null}

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
                {
                  label: "Free consultations available",
                  icon: CalendarCheckIcon,
                },
                {
                  label: "Experienced disability attorneys",
                  icon: ExpertiseIcon,
                },
                {
                  label: "No upfront fees required",
                  icon: ShieldCheckIcon,
                },
              ].map(({ label, icon }) => (
                <span key={label} className="flex items-center gap-2">
                  <BadgeIcon
                    icon={icon}
                    tone="primary"
                    size="sm"
                    className="h-8 w-8 text-[color:var(--color-primary-600)]"
                  />
                  {label}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
