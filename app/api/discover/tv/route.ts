import { NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";

  const response = await fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&include_adult=false&include_null_first_air_dates=false&page=${page}&sort_by=popularity.desc&with_original_language=bn`
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch TV shows" },
      { status: 500 }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
export const runtime = "edge";
