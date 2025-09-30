console.log("OpenCage Key Loaded:", process.env.OPENCAGE_API_KEY);

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const RADIUS_MILES = 50;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

function getSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Server configuration error: Missing Supabase credentials. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) are set."
    );
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

async function fetchCoordinates(request, query) {
  const geocodeUrl = new URL("/api/geocode", request.nextUrl.origin);
  geocodeUrl.searchParams.set("q", query);

  const response = await fetch(geocodeUrl.toString(), {
    method: "GET",
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      error:
        payload?.error ??
        `Failed to geocode location. Geocode endpoint responded with status ${response.status}.`,
      status: response.status,
    };
  }

  return { coordinates: payload?.coordinates ?? null };
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);

    const searchQuery = body?.query ?? body?.search ?? body?.q;

    if (typeof searchQuery !== "string" || !searchQuery.trim()) {
      return NextResponse.json(
        { error: "Request body must include a non-empty 'query' string." },
        { status: 400 }
      );
    }

    const geocodeResult = await fetchCoordinates(request, searchQuery.trim());

    if (geocodeResult?.error || !geocodeResult?.coordinates) {
      return NextResponse.json(
        {
          error:
            geocodeResult?.error ??
            "We couldn't find that location. Try searching with a different city or ZIP code.",
        },
        { status: geocodeResult?.status ?? 404 }
      );
    }

    const { coordinates } = geocodeResult;

    const supabase = getSupabaseClient();

    const { data, error } = await supabase.rpc("lawyers_within_radius", {
      lat: coordinates.lat,
      long: coordinates.lon,
      radius_miles: RADIUS_MILES,
    });

    if (error) {
      console.error("Error querying Supabase:", error);
      return NextResponse.json(
        {
          error:
            "We ran into a problem looking up nearby law firms. Please try again later.",
        },
        { status: 500 }
      );
    }

    const normalizedResults = (data ?? []).map((firm) => ({
      ...firm,
      star_rating: firm?.star_rating ?? firm?.rating ?? null,
      review_count: firm?.review_count ?? firm?.reviews ?? firm?.rating_count ?? null,
      business_description:
        firm?.business_description ??
        firm?.description ??
        firm?.about ??
        firm?.summary ??
        null,
      phone_number:
        firm?.phone_number ??
        firm?.phone ??
        firm?.telephone ??
        firm?.phoneNumber ??
        null,
      website: firm?.website ?? firm?.website_url ?? firm?.url ?? null,
      maps_url: firm?.maps_url ?? firm?.google_maps_url ?? firm?.directions_url ?? null,
    }));

    return NextResponse.json({
      query: searchQuery.trim(),
      center: coordinates,
      radiusMiles: RADIUS_MILES,
      results: normalizedResults,
    });
  } catch (error) {
    console.error("Unexpected error in /api/lawyers:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected server error while searching for law firms.",
      },
      { status: 500 }
    );
  }
}

