# Google OAuth Setup Guide

This document explains how to set up Google OAuth authentication for the nbcon application.

## Prerequisites

1. A Google Cloud Console project
2. A Supabase project
3. The application running locally or deployed

## Step 1: Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (or Google Identity API)
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" → "OAuth 2.0 Client IDs"
6. Configure the OAuth consent screen if prompted
7. Set the application type to "Web application"
8. Add authorized redirect URIs:
   - For development: `https://your-supabase-project-ref.supabase.co/auth/v1/callback`
   - For production: `https://your-domain.com/auth/callback`

## Step 2: Configure Supabase

1. Go to your Supabase project dashboard
2. Navigate to Authentication → Providers
3. Find Google in the list and enable it
4. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
5. Set the redirect URL to: `https://your-supabase-project-ref.supabase.co/auth/v1/callback`
6. Save the configuration

## Step 3: Update Application Configuration

The application is already configured to use Google OAuth. The following components handle the authentication flow:

- `AuthContent.tsx`: Contains the Google login buttons
- `AuthCallback.tsx`: Handles the OAuth callback and user creation
- `App.tsx`: Routes the callback URL

## Step 4: Test the Integration

1. Start your application
2. Go to the login/signup page
3. Click the "Google" button
4. You should be redirected to Google's OAuth consent screen
5. After authorization, you'll be redirected back to the application
6. The user should be automatically logged in and redirected to their dashboard

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**:
   - Ensure the redirect URI in Google Cloud Console matches exactly: `https://your-supabase-project-ref.supabase.co/auth/v1/callback`

2. **"Client ID not found" error**:
   - Verify the Client ID and Client Secret are correctly entered in Supabase
   - Ensure the Google+ API is enabled in Google Cloud Console

3. **User not created in database**:
   - Check the browser console for errors
   - Verify the `profiles` table exists in Supabase
   - Check RLS (Row Level Security) policies

4. **Redirect loop**:
   - Ensure the callback URL in the application matches the one configured in Supabase
   - Check that the `/auth/callback` route is properly configured

### Environment Variables

Make sure your Supabase configuration is correct in `src/integrations/supabase/client.ts`:

```typescript
const SUPABASE_URL = "https://your-project-ref.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "your-anon-key";
```

## Security Considerations

1. Never expose your Google Client Secret in client-side code
2. Use environment variables for sensitive configuration
3. Regularly rotate your OAuth credentials
4. Monitor OAuth usage in Google Cloud Console
5. Implement proper error handling for authentication failures

## User Data Mapping

When a user signs in with Google, the following data is extracted and mapped:

- **Name**: `user_metadata.full_name` or `user_metadata.name`
- **Email**: `email`
- **Avatar**: `user_metadata.avatar_url` or `user_metadata.picture`
- **Role**: Defaults to 'engineer' (can be changed later)
- **Location**: Defaults to 'Riyadh, Saudi Arabia' (can be updated)
- **Language**: Defaults to 'en'
- **Verification Status**: Based on `email_confirmed_at`

The user profile is automatically created in the `profiles` table with the extracted information.
