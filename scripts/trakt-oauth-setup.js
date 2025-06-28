/* eslint-disable @typescript-eslint/no-var-requires, import/no-commonjs */
/**
 * One-time setup script for Trakt OAuth
 * Run this script once to get your initial refresh token
 */

// Load environment variables from .env.local
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const TRAKT_CLIENT_ID = process.env.TRAKT_CLIENT_ID;
const TRAKT_CLIENT_SECRET = process.env.TRAKT_CLIENT_SECRET;

if (!TRAKT_CLIENT_ID || !TRAKT_CLIENT_SECRET) {
  console.error("❌ Missing Trakt credentials!");
  console.log("Please add TRAKT_CLIENT_ID and TRAKT_CLIENT_SECRET to your .env.local file");
  console.log("You can get these from: https://trakt.tv/oauth/applications");
  process.exit(1);
}

console.log("🎬 Trakt OAuth Setup Instructions:");
console.log("===================================");
console.log("");
console.log("1. Visit this URL to authorize your application:");
console.log(`https://api.trakt.tv/oauth/authorize?response_type=code&client_id=${TRAKT_CLIENT_ID}&redirect_uri=urn:ietf:wg:oauth:2.0:oob`);
console.log("");
console.log("2. After authorization, you'll get a code on the page.");
console.log("3. Copy that code and run:");
console.log("   node scripts/exchange-tokens.js YOUR_CODE_HERE");
console.log("");
console.log("4. The script will give you the tokens to add to your .env.local file");

async function exchangeCodeForTokens(authCode) {
  if (!authCode) {
    console.error("❌ Please provide the authorization code as an argument:");
    console.log("   node scripts/exchange-tokens.js YOUR_CODE_HERE");
    process.exit(1);
  }

  try {
    console.log("🔄 Exchanging authorization code for tokens...");
    
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
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${response.statusText}\n${errorText}`);
    }

    const tokens = await response.json();
    
    console.log("");
    console.log("✅ SUCCESS! Update your .env.local file with these values:");
    console.log("==========================================================");
    console.log(`TRAKT_CLIENT_ID=${TRAKT_CLIENT_ID}`);
    console.log(`TRAKT_CLIENT_SECRET=${TRAKT_CLIENT_SECRET}`);
    console.log(`TRAKT_ACCESS_TOKEN=${tokens.access_token}`);
    console.log(`TRAKT_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log("");
    console.log("🎉 You're all set! Your tokens will auto-refresh from now on.");
    
    return tokens;
  } catch (error) {
    console.error("❌ Error exchanging code for tokens:", error.message);
    process.exit(1);
  }
}

// If this script is run directly with an argument, exchange the code
if (require.main === module) {
  const authCode = process.argv[2];
  if (authCode) {
    exchangeCodeForTokens(authCode);
  }
}

module.exports = { exchangeCodeForTokens };
