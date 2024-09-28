import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';

  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=bn&region=BD&language=bn-BD&page=${page}`
  );

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }

  const data = await response.json();
  return NextResponse.json(data);
}