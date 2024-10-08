import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(
  request: Request,
  { params }: { params: { tmdb_id: string } }
) {
  const tmdbId = params.tmdb_id;

  try {
    const [bnResponse, enResponse] = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos&language=bn-BD`
      ),
      fetch(
        `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,images`
      ),
    ]);

    if (!bnResponse.ok || !enResponse.ok) {
      throw new Error('Failed to fetch movie details');
    }

    const bnData = await bnResponse.json();
    const enData = await enResponse.json();
    const bnVideos = bnData.videos?.results || [];
    const enVideos = enData.videos?.results || [];
    const combinedVideos = [...bnVideos, ...enVideos];

    const movieData = {
      ...enData,
      ...bnData,
      overview: bnData.overview || enData.overview,
      title: bnData.title || enData.title,
      videos: { results: combinedVideos },
      
    };

    return NextResponse.json(movieData);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return NextResponse.json({ error: 'Failed to fetch movie details' }, { status: 500 });
  }
}