import { NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(
  request: Request,
  { params }: { params: { tmdb_id: string; type: string } }
) {
  const { tmdb_id, type } = params; // Extract tmdb_id and type (movie/tv)
  const validTypes = ["movie", "tv"]; // Define valid content types

  // Ensure the type is either 'movie' or 'tv'
  if (!validTypes.includes(type)) {
    return NextResponse.json(
      { error: "Invalid type provided" },
      { status: 400 }
    );
  }

  try {
    // Construct the appropriate URL based on the type (movie or tv)
    const url = `https://api.themoviedb.org/3/${type}/${tmdb_id}/watch/providers?api_key=${TMDB_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch watch providers");
    }

    const data = await response.json();

    // Extract India-specific data if available, otherwise return an empty object
    const inData = data.results?.IN || {};

    return NextResponse.json(inData);
  } catch (error) {
    console.error("Error fetching watch providers:", error);
    return NextResponse.json(
      { error: "Failed to fetch watch providers" },
      { status: 500 }
    );
  }
}
export const runtime = "edge";
