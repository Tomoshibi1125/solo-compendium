# OAuth Provider Setup Guide

This guide explains how to set up Google and Apple authentication for the Solo Compendium.

## Overview

The Solo Compendium supports OAuth authentication through:
- **Google Sign-In** - Gmail/Google account authentication
- **Apple Sign In** - Apple ID authentication

Both providers integrate seamlessly with the existing Supabase authentication system.

## Prerequisites

1. A Supabase project (already configured for basic auth)
2. Google Cloud Console account (for Google OAuth)
3. Apple Developer account (for Apple Sign In)
4. Your app's callback URL (usually `https://your-domain.com`)

## Step 1: Google OAuth Setup

### 1.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Google+ API" (if not already enabled)

### 1.2 Create OAuth Credentials

1. Navigate to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Configure:
   - **Application type**: Web application
   - **Name**: Solo Compendium (or your preferred name)
   - **Authorized JavaScript origins**: `http://localhost:8080` (for development)
   - **Authorized redirect URIs**: `https://your-project.supabase.co/auth/v1/callback`

### 1.3 Get Client ID

1. After creation, copy the **Client ID** (ends with `.apps.googleusercontent.com`)
2. Add it to your `.env` file:
   ```
   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```

## Step 2: Apple Sign In Setup

### 2.1 Create App ID

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **+** → **Identifiers** → **App ID**
4. Configure:
   - **Description**: Solo Compendium
   - **Bundle ID**: Use reverse domain notation (e.g., `com.yourdomain.solo-compendium`)
   - **Capabilities**: Enable **Sign In with Apple**

### 2.2 Create Service ID

1. Click **+** → **Identifiers** → **Service ID**
2. Configure:
   - **Description**: Solo Compendium Web Service
   - **Identifier**: Use reverse domain notation (e.g., `com.yourdomain.solo-compendium.web`)

### 2.3 Configure Sign In with Apple

1. Navigate to **Certificates, Identifiers & Profiles** → **Identifiers**
2. Select your App ID
3. Click **Configure** next to **Sign In with Apple**
4. Select your Service ID as the primary App ID
5. Configure:
   - **Return URLs**: `https://your-project.supabase.co/auth/v1/callback`
   - **Web Domain**: Add your domain (e.g., `your-domain.com`)

### 2.4 Get Client ID

1. After configuration, copy the **Service ID** (this is your client ID)
2. Add it to your `.env` file:
   ```
   VITE_APPLE_CLIENT_ID=com.yourdomain.solo-compendium.web
   ```

## Step 3: Supabase Configuration

### 3.1 Configure OAuth Providers in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Google**:
   - **Enabled**: ON
   - **Client ID**: Your Google Client ID from Step 1.3
   - **Client Secret**: Leave empty for web apps
   - **Redirect URL**: `https://your-project.supabase.co/auth/v1/callback`

4. Enable **Apple**:
   - **Enabled**: ON
   - **Client ID**: Your Apple Service ID from Step 2.4
   - **Client Secret**: Leave empty for web apps
   - **Redirect URL**: `https://your-project.supabase.co/auth/v1/callback`

### 3.2 Update Site URL

1. In Supabase **Authentication** → **URL Configuration**
2. Set **Site URL** to your domain (e.g., `https://your-domain.com`)
3. Add redirect URLs as needed

## Step 4: Environment Configuration

Update your `.env` file with the OAuth client IDs:

```env
# OAuth Providers
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_APPLE_CLIENT_ID=com.yourdomain.solo-compendium.web

# Existing Supabase config
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

## Step 5: Testing

### 5.1 Local Development

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:8080/login`
3. Click "Continue with Google" or "Continue with Apple"
4. Complete the OAuth flow
5. Verify you're redirected back to the app and logged in

### 5.2 Production

1. Deploy your application
2. Update authorized domains in Google Console and Apple Developer Portal
3. Test the OAuth flow in production

## Troubleshooting

### Common Issues

**"redirect_uri_mismatch" Error**
- Verify the redirect URL in provider settings matches exactly
- Check for trailing slashes or protocol differences

**"invalid_client" Error**
- Verify the client ID is correct and matches the provider configuration
- Ensure the app is properly configured in the developer console

**"access_denied" Error**
- User cancelled the OAuth flow (normal behavior)
- Check if the app has the required permissions

### Debug Tips

1. Check browser console for detailed error messages
2. Verify network requests in browser dev tools
3. Check Supabase authentication logs
4. Test with incognito/private browsing mode

## Security Considerations

- Never commit client secrets to version control
- Use HTTPS in production
- Regularly rotate OAuth client secrets if using server-side flow
- Monitor authentication logs for suspicious activity

## Next Steps

After OAuth setup is complete:

1. Test user registration and login flows
2. Verify profile creation works correctly
3. Test role selection for new users
4. Update any user documentation to mention OAuth options

## Support

If you encounter issues:

1. Check this guide for common solutions
2. Review Supabase authentication documentation
3. Consult Google OAuth and Apple Sign In documentation
4. Create an issue in the project repository with detailed error logs
