// app/api/images/[type]/[id]/route.ts

import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { type: string; id: string } }
) {
  const { type, id: tmdbId } = params;
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key is missing" }, { status: 500 });
  }

  // Validate type (either 'movie' or 'tv')
  if (type !== "movie" && type !== "tv") {
    return NextResponse.json(
      { error: "Invalid type. Use 'movie' or 'tv'." },
      { status: 400 }
    );
  }

  // Build the TMDb API URL with the API key as a query parameter
  const url = `https://api.themoviedb.org/3/${type}/${tmdbId}/images?api_key=${apiKey}`;

  // Set the request options
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  try {
    // Fetch data from TMDb API
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.statusText}`);
    }

    const data = await response.json();

    // Return the images data from the response
    if (data && data.backdrops) {
      return NextResponse.json(data.backdrops, { status: 200 });
    } else {
      return NextResponse.json(
        { error: `${type.slice(0, -1)} images not found` },
        { status: 404 }
      );
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export const runtime = "edge";