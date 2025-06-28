/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const TRAKT_CLIENT_ID = process.env.TRAKT_CLIENT_ID;
const TRAKT_CLIENT_SECRET = process.env.TRAKT_CLIENT_SECRET;
const TRAKT_REFRESH_TOKEN = process.env.TRAKT_REFRESH_TOKEN;

export async function POST() {
  if (!TRAKT_CLIENT_ID || !TRAKT_CLIENT_SECRET || !TRAKT_REFRESH_TOKEN) {
    return NextResponse.json(
      { error: "Missing Trakt credentials in environment variables" },
      { status: 500 }
    );
  }

  try {
    const response = await axios.post("https://api.trakt.tv/oauth/token", {
      refresh_token: TRAKT_REFRESH_TOKEN,
      client_id: TRAKT_CLIENT_ID,
      client_secret: TRAKT_CLIENT_SECRET,
      redirect_uri: "urn:ietf:wg:oauth:2.0:oob", // or your actual redirect URI
      grant_type: "refresh_token",
    });

    const responseData = response.data as any;
    const { access_token, refresh_token } = responseData;

    // In a real app, you'd save these to a secure database or update environment variables
    console.log("New access token:", access_token);
    console.log("New refresh token:", refresh_token);

    return NextResponse.json({
      access_token,
      refresh_token,
      message: "Tokens refreshed successfully",
    });
  } catch (error: any) {
    console.error("Error refreshing tokens:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to refresh tokens" },
      { status: 500 }
    );
  }
}

export const runtime = "edge";
