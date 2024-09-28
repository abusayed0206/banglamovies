import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(
  request: Request,
  { params }: { params: { tmdb_id: string } }
) {
  const movieId = params.tmdb_id;
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch watch providers');
    }
    const data = await response.json();
    
    // Extract India-specific data if available, otherwise return an empty object
    const inData = data.results.IN || {};
    
    return NextResponse.json(inData);
  } catch (error) {
    console.error('Error fetching watch providers:', error);
    return NextResponse.json({ error: 'Failed to fetch watch providers' }, { status: 500 });
  }
}