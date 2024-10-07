/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/trakt/tmdb/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

const TRAKT_CLIENT_ID = process.env.TRAKT_CLIENT_ID;

// Log helper
const log = (message: string, data?: any): void => {
  console.log(`[LOG] ${message}`);
  if (data) console.log(data);
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tmdbid = searchParams.get("tmdbid");

  if (!tmdbid) {
    log("Missing tmdbid parameter");
    return NextResponse.json(
      { error: "Missing tmdbid parameter." },
      { status: 400 }
    );
  }

  try {
    log(`Fetching Trakt ID for TMDb ID: ${tmdbid}`);
    const traktId = await getTraktIdFromTMDb(tmdbid);

    if (!traktId) {
      log(`Trakt ID not found for TMDb ID: ${tmdbid}`);
      return NextResponse.json(
        { error: "Trakt ID not found for TMDb ID." },
        { status: 404 }
      );
    }

    log(`Trakt ID found: ${traktId} for TMDb ID: ${tmdbid}`);
    return NextResponse.json({ traktId });
  } catch (error) {
    const err = error as any;
    log("Error during API request", err.response?.data || err.message);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// Helper function to convert TMDb ID to Trakt ID
async function getTraktIdFromTMDb(tmdbid: string): Promise<number | null> {
  try {
    const traktApiUrl = `https://api.trakt.tv/search/tmdb/${tmdbid}?type=movie`;
    log(`Requesting Trakt ID for TMDb ID: ${tmdbid} (URL: ${traktApiUrl})`);

    const response = await axios.get<{ movie: { ids: { trakt: number } } }[]>(
      traktApiUrl,
      {
        headers: {
          "Content-Type": "application/json",
          "trakt-api-version": "2",
          "trakt-api-key": TRAKT_CLIENT_ID,
        },
      }
    );

    log(`Trakt API response for TMDb ID: ${tmdbid}`, response.data);

    if (response.data.length > 0) {
      // Access the trakt ID correctly
      const traktId = response.data[0].movie.ids.trakt; // Correctly accessing the Trakt ID
      return traktId;
    } else {
      return null;
    }
  } catch (error: any) {
    log(
      `Error converting TMDb ID to Trakt ID for ${tmdbid}`,
      error.response?.data || error.message
    );
    throw new Error("Failed to get Trakt ID from TMDb ID");
  }
}
