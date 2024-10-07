/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/trakt/lookup/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

const TRAKT_CLIENT_ID = process.env.TRAKT_CLIENT_ID;
const TRAKT_ACCESS_TOKEN = process.env.TRAKT_ACCESS_TOKEN;

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
    log(`Looking up watched status for TMDb ID: ${tmdbid}`);

    // Step 1: Get the Trakt ID from the first route
    const traktId = await getTraktId(tmdbid);
    if (!traktId) {
      log(`Trakt ID not found for TMDb ID: ${tmdbid}`);
      return NextResponse.json(
        { error: "Trakt ID not found for TMDb ID." },
        { status: 404 }
      );
    }

    log(`Trakt ID found: ${traktId} for TMDb ID: ${tmdbid}`);

    // Step 2: Fetch watched history from Trakt and return it as-is
    const history = await getWatchedHistory(traktId);

    log(`Successfully fetched history for Trakt ID: ${traktId}`);

    // Check if the history array is empty
    if (history.length === 0) {
      // Return a consistent JSON structure for non-watched movies
      return NextResponse.json([
        {
          id: null,
          watched_at: "none",
          action: "watch",
          type: "movie",
          movie: {
            title: "Not Watched",
            year: null,
            ids: {
              trakt: traktId,
              slug: "",
              imdb: "",
              tmdb: parseInt(tmdbid), // Include the TMDb ID
            },
          },
        },
      ]);
    }

    // Directly return the raw JSON response from Trakt API
    return NextResponse.json(history);
  } catch (error) {
    const err = error as any;
    log("Error during API request", err.response?.data || err.message);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// Helper function to get Trakt ID from the first route
async function getTraktId(tmdbid: string): Promise<number | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/trakt/tmdb?tmdbid=${tmdbid}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch Trakt ID");
  }
  const data = await response.json();
  return data.traktId || null;
}

// Helper function to fetch watched history from Trakt
async function getWatchedHistory(traktId: number): Promise<any> {
  try {
    const traktApiUrl = `https://api.trakt.tv/sync/history/movies/${traktId}`;
    log(`Requesting watched history from Trakt API (URL: ${traktApiUrl})`);

    const response = await axios.get(traktApiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TRAKT_ACCESS_TOKEN}`,
        "trakt-api-version": "2",
        "trakt-api-key": TRAKT_CLIENT_ID,
      },
    });

    log(`Watched history response for Trakt ID: ${traktId}`, response.data);
    return response.data; // Return the raw response from Trakt
  } catch (error: any) {
    log(
      `Error fetching watched history for Trakt ID: ${traktId}`,
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch watched history");
  }
}
