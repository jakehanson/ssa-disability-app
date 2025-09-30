import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") ?? searchParams.get("query") ?? "";

    if (!query.trim()) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required." },
        { status: 400 }
      );
    }

    if (!OPENCAGE_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Server configuration error: Missing OPENCAGE_API_KEY environment variable.",
        },
        { status: 500 }
      );
    }

    const url = new URL("https://api.opencagedata.com/geocode/v1/json");
    url.searchParams.set("q", query.trim());
    url.searchParams.set("key", OPENCAGE_API_KEY);
    url.searchParams.set("limit", "1");
    url.searchParams.set("countrycode", "us");

    const response = await fetch(url.toString(), { method: "GET", cache: "no-store" });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Failed to geocode location. OpenCage responded with status ${response.status}.`,
        },
        { status: response.status }
      );
    }

    const payload = await response.json();
    const geometry = payload?.results?.[0]?.geometry;

    if (
      !geometry ||
      typeof geometry.lat !== "number" ||
      typeof geometry.lng !== "number"
    ) {
      return NextResponse.json(
        {
          error: "No matching location found for that query.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      query: query.trim(),
      coordinates: {
        lat: geometry.lat,
        lon: geometry.lng,
      },
    });
  } catch (error) {
    console.error("Unexpected error in /api/geocode:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected server error while looking up that location.",
      },
      { status: 500 }
    );
  }
}

