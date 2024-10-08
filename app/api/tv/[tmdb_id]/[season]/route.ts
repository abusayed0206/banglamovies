/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/tv/[tv]/[season]/route.ts

import { NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(
  request: Request,
  { params }: { params: { tv: string; season: string } }
) {
  const { tv, season } = params;

  try {
    // Build the API URL dynamically with the TV show ID and season number
    const tmdbApiUrl = `https://api.themoviedb.org/3/tv/${tv}/season/${season}?append_to_response=images,videos,credits&language=en-US&api_key=${TMDB_API_KEY}`;

    const response = await fetch(tmdbApiUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch season details");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching season details:", error);
    return NextResponse.json(
      { error: "Failed to fetch season details" },
      { status: 500 }
    );
  }
}

export const runtime = "edge";
