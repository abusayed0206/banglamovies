import { NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(
  request: Request,
  { params }: { params: { tmdb_id: string } }
) {
  const tmdbId = params.tmdb_id;

  try {
    const [bnResponse, enResponse] = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits&language=bn-BD`
      ),
      fetch(
        `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits,images,external_ids`
      ),
    ]);

    if (!bnResponse.ok || !enResponse.ok) {
      throw new Error("Failed to fetch TV show details");
    }

    const bnData = await bnResponse.json();
    const enData = await enResponse.json();
    const bnVideos = bnData.videos?.results || [];
    const enVideos = enData.videos?.results || [];
    const combinedVideos = [...bnVideos, ...enVideos];

    const tvShowData = {
      ...enData,
      ...bnData,
      overview: bnData.overview || enData.overview,
      name: bnData.name || enData.name, // Use 'name' for TV shows
      videos: { results: combinedVideos },
    };

    return NextResponse.json(tvShowData);
  } catch (error) {
    console.error("Error fetching TV show details:", error);
    return NextResponse.json(
      { error: "Failed to fetch TV show details" },
      { status: 500 }
    );
  }
}
