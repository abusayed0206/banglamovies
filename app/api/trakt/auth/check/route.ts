/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { TraktAuth } from "../../../../../lib/trakt-auth";

/**
 * Scheduled token refresh endpoint
 * Call this endpoint daily or set up a cron job to keep tokens fresh
 * You can also use services like Vercel Cron or GitHub Actions
 */
export async function GET() {
  try {
    // This will automatically refresh if needed
    const accessToken = await TraktAuth.getValidAccessToken();
    
    return NextResponse.json({
      success: true,
      message: "Token refresh check completed",
      hasValidToken: !!accessToken,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Token refresh failed:", error.message);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export const runtime = "edge";
