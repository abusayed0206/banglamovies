/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const TRAKT_CLIENT_ID = process.env.TRAKT_CLIENT_ID;
const TRAKT_CLIENT_SECRET = process.env.TRAKT_CLIENT_SECRET;

interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  created_at: number;
}

// In a real application, store these in a database
let cachedTokens: TokenData | null = null;

export class TraktAuth {
  private static async refreshTokens(refreshToken: string): Promise<TokenData> {
    try {
      const response = await axios.post("https://api.trakt.tv/oauth/token", {
        refresh_token: refreshToken,
        client_id: TRAKT_CLIENT_ID,
        client_secret: TRAKT_CLIENT_SECRET,
        redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
        grant_type: "refresh_token",
      });

      const responseData = response.data as any;
      const tokenData: TokenData = {
        access_token: responseData.access_token,
        refresh_token: responseData.refresh_token,
        expires_in: responseData.expires_in,
        created_at: Math.floor(Date.now() / 1000),
      };

      // Cache the new tokens
      cachedTokens = tokenData;
      
      // In production, save to database here
      console.log("Tokens refreshed and cached");
      
      return tokenData;
    } catch (error: any) {
      console.error("Failed to refresh tokens:", error.response?.data || error.message);
      throw new Error("Token refresh failed");
    }
  }

  private static isTokenExpired(tokenData: TokenData): boolean {
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = tokenData.created_at + tokenData.expires_in;
    // Refresh 5 minutes before expiration
    return now >= (expiresAt - 300);
  }

  public static async getValidAccessToken(): Promise<string> {
    // First, check if we have cached tokens that are still valid
    if (cachedTokens && !this.isTokenExpired(cachedTokens)) {
      return cachedTokens.access_token;
    }

    // If no cached tokens, we need to refresh using the refresh token
    const refreshToken = process.env.TRAKT_REFRESH_TOKEN;
    
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    // Since tokens expire in 24 hours, always refresh when no cache exists
    console.log("No cached token data or expired, refreshing tokens...");
    const newTokens = await this.refreshTokens(refreshToken);
    return newTokens.access_token;
  }

  public static async makeAuthenticatedRequest(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    data?: any
  ): Promise<any> {
    const accessToken = await this.getValidAccessToken();

    const config = {
      method,
      url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "trakt-api-version": "2",
        "trakt-api-key": TRAKT_CLIENT_ID,
      },
      ...(data && { data }),
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error: any) {
      // If token is invalid, try to refresh once
      if (error.response?.status === 401) {
        console.log("Token invalid, attempting refresh...");
        const newAccessToken = await this.refreshTokens(process.env.TRAKT_REFRESH_TOKEN!);
        
        // Retry with new token
        config.headers.Authorization = `Bearer ${newAccessToken.access_token}`;
        const retryResponse = await axios(config);
        return retryResponse.data;
      }
      throw error;
    }
  }
}
