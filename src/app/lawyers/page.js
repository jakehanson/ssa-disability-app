"use client";

import { useState } from "react";

import { BadgeIcon, Button, Card, InputField, SectionHeader } from "../components/ui";

const StarIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z"
      clipRule="evenodd"
    />
  </svg>
);

const LocationPinIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    aria-hidden
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
    />
  </svg>
);

const PhoneIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    aria-hidden
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
    />
  </svg>
);

const GlobeIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    aria-hidden
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
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

  function getStarRating(lawFirm) {
    const ratingValue =
      lawFirm?.star_rating ??
      lawFirm?.rating ??
      lawFirm?.average_rating ??
      null;

    const parsed = typeof ratingValue === "string" ? parseFloat(ratingValue) : ratingValue;

    if (typeof parsed === "number" && Number.isFinite(parsed)) {
      return Math.max(0, Math.min(5, parsed));
    }

    return null;
  }

  function getReviewCount(lawFirm) {
    const reviewValue =
      lawFirm?.review_count ??
      lawFirm?.reviews ??
      lawFirm?.total_reviews ??
      lawFirm?.rating_count ??
      null;

    const parsed = typeof reviewValue === "string" ? parseInt(reviewValue, 10) : reviewValue;

    if (typeof parsed === "number" && Number.isInteger(parsed) && parsed >= 0) {
      return parsed;
    }

    return null;
  }

  function getBusinessDescription(lawFirm) {
    const description =
      lawFirm?.business_description ??
      lawFirm?.description ??
      lawFirm?.about ??
      null;

    if (typeof description === "string" && description.trim()) {
      return description.trim();
    }

    return null;
  }

  function getPhoneNumber(lawFirm) {
    const phone =
      lawFirm?.phone_number ??
      lawFirm?.phone ??
      lawFirm?.telephone ??
      lawFirm?.phoneNumber ??
      null;

    if (typeof phone === "string" && phone.trim()) {
      return phone.trim();
    }

    return null;
  }

  function formatPhoneDisplay(phone) {
    if (!phone) return null;

    const digits = phone.replace(/[^0-9]/g, "");

    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    if (digits.length === 11 && digits.startsWith("1")) {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }

    return phone;
  }

  function formatPhoneDial(phone) {
    if (!phone) return null;
    const digits = phone.replace(/[^0-9+]/g, "");
    return digits ? (digits.startsWith("+") ? digits : `+1${digits}`) : null;
  }

  function getWebsiteUrl(lawFirm) {
    const website =
      lawFirm?.website ??
      lawFirm?.website_url ??
      lawFirm?.url ??
      lawFirm?.profile_url ??
      null;

    if (typeof website === "string" && website.trim()) {
      return website.trim();
    }

    return null;
  }

  function getMapsUrl(lawFirm) {
    const mapsUrl =
      lawFirm?.maps_url ??
      lawFirm?.google_maps_url ??
      lawFirm?.directions_url ??
      lawFirm?.maps_link ??
      null;

    if (typeof mapsUrl === "string" && mapsUrl.trim()) {
      return mapsUrl.trim();
    }

    return null;
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
              const distanceText = getDistanceText(lawFirm);
              const rating = getStarRating(lawFirm);
              const reviewCount = getReviewCount(lawFirm);
              const description = getBusinessDescription(lawFirm);
              const phoneRaw = getPhoneNumber(lawFirm);
              const phoneDisplay = formatPhoneDisplay(phoneRaw);
              const phoneDial = formatPhoneDial(phoneRaw);
              const websiteUrl = getWebsiteUrl(lawFirm);
              const mapsUrl = getMapsUrl(lawFirm);
              const experienceText = getExperienceText(lawFirm);
              const offerText = getOfferText(lawFirm);

              return (
                <Card
                  key={lawFirm?.id ?? lawFirm?.slug ?? `${name}-${index}`}
                  padding="lg"
                  elevated
                  className="flex h-full"
                >
                  <div className="flex w-full flex-col justify-between gap-6 text-left">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
                            {name}
                          </h3>
                          {rating ? (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="flex items-center gap-1 font-semibold text-[color:var(--color-warning-500)]">
                                <StarIcon className="h-5 w-5" />
                                {rating.toFixed(1)}
                              </span>
                              {reviewCount !== null ? (
                                <span className="text-[color:var(--color-text-secondary)]">
                                  ({reviewCount.toLocaleString()} reviews)
                                </span>
                              ) : null}
                            </div>
                          ) : null}

                          {experienceText || offerText ? (
                            <div className="flex flex-wrap gap-2 text-xs text-[color:var(--color-text-muted)]">
                              {experienceText ? (
                                <span className="rounded-full bg-[color:var(--color-surface-alt)] px-3 py-1">
                                  {experienceText}
                                </span>
                              ) : null}
                              {offerText ? (
                                <span className="rounded-full bg-[color:var(--color-surface-alt)] px-3 py-1">
                                  {offerText}
                                </span>
                              ) : null}
                            </div>
                          ) : null}
                        </div>

                        {distanceText ? (
                          <span className="rounded-full bg-[color:var(--color-primary-50)] px-3 py-1 text-xs font-medium text-[color:var(--color-primary-700)]">
                            {distanceText}
                          </span>
                        ) : null}
                      </div>

                      {description ? (
                        <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                          {description}
                        </p>
                      ) : null}

                      <div className="space-y-3 text-sm text-[color:var(--color-text-secondary)]">
                        <div className="flex items-start gap-2">
                          <LocationPinIcon className="mt-0.5 h-5 w-5 text-[color:var(--color-primary-500)]" />
                          <div className="space-y-1">
                            {addressLines.map((line) => (
                              <p key={line}>{line}</p>
                            ))}
                          </div>
                        </div>

                        {phoneDisplay && phoneDial ? (
                          <div className="flex items-center gap-2">
                            <PhoneIcon className="h-5 w-5 text-[color:var(--color-primary-500)]" />
                            <a
                              href={`tel:${phoneDial}`}
                              className="font-medium text-[color:var(--color-primary-700)] hover:underline"
                            >
                              {phoneDisplay}
                            </a>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {phoneDial ? (
                        <Button
                          size="md"
                          href={`tel:${phoneDial}`}
                          variant="secondary"
                          className="min-w-[120px] flex-1 justify-center"
                        >
                          Call
                        </Button>
                      ) : null}

                      {websiteUrl ? (
                        <Button
                          size="md"
                          href={websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          icon={<GlobeIcon className="h-5 w-5" />}
                          iconPosition="left"
                          className="min-w-[120px] flex-1 justify-center"
                        >
                          Website
                        </Button>
                      ) : null}

                      {mapsUrl ? (
                        <Button
                          size="md"
                          href={mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          variant="secondary"
                          className="min-w-[120px] flex-1 justify-center"
                        >
                          Directions
                        </Button>
                      ) : null}
                    </div>
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
              <span className="flex items-center gap-2">
                <BadgeIcon
                  icon={CalendarCheckIcon}
                  tone="primary"
                  size="sm"
                  className="h-8 w-8 text-[color:var(--color-primary-600)]"
                />
                Free consultations available
              </span>
              <span className="flex items-center gap-2">
                <BadgeIcon
                  icon={ExpertiseIcon}
                  tone="primary"
                  size="sm"
                  className="h-8 w-8 text-[color:var(--color-primary-600)]"
                />
                Experienced disability attorneys
              </span>
              <span className="flex items-center gap-2">
                <BadgeIcon
                  icon={ShieldCheckIcon}
                  tone="primary"
                  size="sm"
                  className="h-8 w-8 text-[color:var(--color-primary-600)]"
                />
                No upfront fees required
              </span>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
