import { NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const type = searchParams.get("type") || "movie"; // Default to 'movie' if type is not provided

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  // Validate type parameter
  if (type !== "movie" && type !== "tv") {
    return NextResponse.json(
      { error: 'Invalid type parameter, must be "movie" or "tv"' },
      { status: 400 }
    );
  }

  try {
    // Construct the dynamic URL based on the type (movie or tv)
    const url = `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
      query
    )}&region=BD&language=bn-BD`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch from TMDB");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching from TMDB:", error);
    return NextResponse.json(
      { error: `Failed to fetch ${type}s` },
      { status: 500 }
    );
  }
}
export const runtime = "edge";
