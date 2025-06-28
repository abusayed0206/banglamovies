/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * One-time setup script for Trakt OAuth
 * Run this script once to get your initial refresh token
 */

const TRAKT_CLIENT_ID = "your_client_id"; // Replace with your actual client ID
const TRAKT_CLIENT_SECRET = "your_client_secret"; // Replace with your actual client secret

console.log("Trakt OAuth Setup Instructions:");
console.log("1. Go to https://trakt.tv/oauth/applications");
console.log("2. Create a new application if you haven't already");
console.log("3. Set redirect URI to: urn:ietf:wg:oauth:2.0:oob");
console.log("4. Copy your Client ID and Client Secret");
console.log("");
console.log("5. Visit this URL to authorize your application:");
console.log(`https://api.trakt.tv/oauth/authorize?response_type=code&client_id=${TRAKT_CLIENT_ID}&redirect_uri=urn:ietf:wg:oauth:2.0:oob`);
console.log("");
console.log("6. After authorization, you'll get a code. Use it in the exchangeCode function below.");

async function exchangeCodeForTokens(authCode: string) {
  try {
    const response = await fetch("https://api.trakt.tv/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: authCode,
        client_id: TRAKT_CLIENT_ID,
        client_secret: TRAKT_CLIENT_SECRET,
        redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const tokens = await response.json();
    
    console.log("SUCCESS! Add these to your environment variables:");
    console.log(`TRAKT_CLIENT_ID=${TRAKT_CLIENT_ID}`);
    console.log(`TRAKT_CLIENT_SECRET=${TRAKT_CLIENT_SECRET}`);
    console.log(`TRAKT_ACCESS_TOKEN=${tokens.access_token}`);
    console.log(`TRAKT_REFRESH_TOKEN=${tokens.refresh_token}`);
    
    return tokens;
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
  }
}

// Uncomment and replace 'YOUR_AUTH_CODE_HERE' with the actual code from step 5
// exchangeCodeForTokens('YOUR_AUTH_CODE_HERE');

export { exchangeCodeForTokens };
