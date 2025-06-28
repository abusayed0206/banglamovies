/* eslint-disable @typescript-eslint/no-var-requires, import/no-commonjs */
/**
 * Script to exchange authorization code for tokens
 * Usage: node scripts/exchange-tokens.js YOUR_AUTH_CODE
 */

// Load environment variables
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const { exchangeCodeForTokens } = require('./trakt-oauth-setup.js');

const authCode = process.argv[2];

if (!authCode) {
  console.error("❌ Please provide the authorization code:");
  console.log("   node scripts/exchange-tokens.js YOUR_CODE_HERE");
  console.log("");
  console.log("Get your code from:");
  const clientId = process.env.TRAKT_CLIENT_ID || 'YOUR_CLIENT_ID';
  console.log(`https://api.trakt.tv/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=urn:ietf:wg:oauth:2.0:oob`);
  process.exit(1);
}

exchangeCodeForTokens(authCode);
