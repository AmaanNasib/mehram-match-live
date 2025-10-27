# Google OAuth Setup Guide

## Setup Instructions

1. **Get Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
   - Set authorized redirect URIs for your domain
   - Copy the Client ID

2. **Add Environment Variable:**
   Create a `.env` file in the root directory and add:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here
   ```

3. **Test the Implementation:**
   - Start the development server: `npm start`
   - Navigate to the landing page
   - Click "Sign in with Google" button
   - Complete the on_behalf selection modal
   - Verify the registration flow

## Features Implemented

✅ Google OAuth Integration
✅ On Behalf Selection Modal
✅ Name Field Logic:
   - Self/Friend: Uses Google name data
   - Brother/Son/Sister/Daughter: Clears name fields for manual entry
✅ Gender Auto-selection based on on_behalf choice
✅ Redirect to /memstepone/ for profile completion
✅ Proper error handling

## Flow

1. User clicks "Sign in with Google"
2. Google OAuth popup opens
3. User selects Google account
4. On Behalf modal opens
5. User selects profile purpose (Self/Brother/etc.)
6. Gender auto-selected based on choice
7. Registration API call with appropriate data
8. Redirect to profile creation page
