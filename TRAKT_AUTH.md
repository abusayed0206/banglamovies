# Trakt API Authentication Setup

This guide explains how to set up automatic token refresh for the Trakt API integration.

## Environment Files Security 🔒

### **Important: Keep Your Keys Safe!**

This project uses two environment files:

- **`.env`** - Template with placeholder values (safe to commit to GitHub)
- **`.env.local`** - Your actual keys (NEVER commit this!)
- **`.env.example`** - Example template for other developers

### **Setup Your Environment:**

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your actual keys to `.env.local` (this file is gitignored)

3. **Never** put real keys in `.env` - it's a template only!

## Prerequisites

You need a **Client Secret** for the Trakt API. There's no way around this for accessing user data like watched history. The Trakt API requires:

- **Client ID** (API Key) - for app identification
- **Client Secret** - for OAuth token operations
- **Access Token** - for accessing user data
- **Refresh Token** - for automatic token renewal

## Initial Setup

### 1. Create Trakt Application

1. Go to [Trakt OAuth Applications](https://trakt.tv/oauth/applications)
2. Create a new application
3. Set redirect URI to: `urn:ietf:wg:oauth:2.0:oob`
4. Copy your Client ID and Client Secret

### 2. Get Initial Tokens

1. Run the setup script:
   ```bash
   npm run trakt-setup
   ```

2. Or manually:
   - Visit: `https://api.trakt.tv/oauth/authorize?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=urn:ietf:wg:oauth:2.0:oob`
   - Authorize your app
   - Use the code in `scripts/trakt-oauth-setup.ts`

### 3. Environment Variables

Add these to your `.env.local`:

```env
TRAKT_CLIENT_ID=your_client_id
TRAKT_CLIENT_SECRET=your_client_secret
TRAKT_ACCESS_TOKEN=your_initial_access_token
TRAKT_REFRESH_TOKEN=your_refresh_token
```

## Automatic Token Refresh

The system automatically handles token refresh in several ways:

### 1. Built-in Auto-Refresh
- Tokens are automatically refreshed when they're about to expire
- Happens transparently in API calls
- No manual intervention needed

### 2. Scheduled Refresh (Vercel)
- Daily cron job runs at midnight UTC
- Endpoint: `/api/trakt/auth/check`
- Configured in `vercel.json`

### 3. Manual Refresh
- Call `/api/trakt/auth/refresh` to manually refresh tokens
- Useful for testing or emergency refresh

## Usage

```typescript
// The TraktAuth utility handles everything automatically
import { TraktAuth } from '../lib/trakt-auth';

// This will auto-refresh if needed
const data = await TraktAuth.makeAuthenticatedRequest(
  'https://api.trakt.tv/sync/history/movies/123'
);
```

## Alternative: Using Public Endpoints Only

If you want to avoid OAuth entirely, you can only use public Trakt endpoints:

```typescript
// Public endpoints (no authentication needed)
const headers = {
  'Content-Type': 'application/json',
  'trakt-api-version': '2',
  'trakt-api-key': TRAKT_CLIENT_ID, // Only Client ID needed
};

// Examples of public endpoints:
// - /movies/{id}
// - /shows/{id}
// - /movies/popular
// - /shows/trending
```

But you **cannot** access:
- User's watched history
- User's collection
- User's ratings
- Any user-specific data

## Troubleshooting

### Token Refresh Fails
1. Check that all environment variables are set
2. Verify Client Secret is correct
3. Check if refresh token has expired (shouldn't happen with regular use)

### "Client Secret Required" Error
- You cannot access user data without OAuth
- Consider using public endpoints only if appropriate
- Or implement the full OAuth flow as described above

## Security Notes

- Never expose Client Secret in frontend code
- Store tokens securely (consider using a database in production)
- Refresh tokens can expire if not used for 3 months
- Regular API usage keeps tokens fresh automatically
