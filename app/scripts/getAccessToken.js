// getAccessToken.js

// remember: token normally expire in 3 month. in every 3 month you need to genarate access token and replace to environment variable in project settings.

import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// # go to this link first and you will get the TRAKT_CODE: https://trakt.tv/oauth/authorize?client_id=[client_id]&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&response_type=code

// Load the environment variables
const code = "4d80e9db"; // Authorization code
const client_id = "you_client_id"; // Client IDs
const client_secret = "your_client_secret"; // Client Secret
const redirect_uri = "urn:ietf:wg:oauth:2.0:oob"; // Or your specific redirect URI
const grant_type = "authorization_code"; // Grant type (fixed)

if (!code || !client_id || !client_secret) {
  console.error("Missing required vars");
  process.exit(1);
}

// Prepare the request payload with consistent variable names
const requestBody = {
  code, // Authorization code
  client_id, // Trakt Client ID
  client_secret, // Trakt Client Secret
  redirect_uri, // Redirect URI
  grant_type, // Grant type
};

// Make the POST request to retrieve the access token
axios
  .post("https://api.trakt.tv/oauth/token", requestBody, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((response) => {
    console.log("Access Token:", response.data.access_token);
    console.log("Refresh Token:", response.data.refresh_token);
    console.log("Token Type:", response.data.token_type);
    console.log("Expires In:", response.data.expires_in);
  })
  .catch((error) => {
    console.error(
      "Error fetching access token:",
      error.response ? error.response.data : error.message
    );
  });
