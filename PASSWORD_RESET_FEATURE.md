# Password Reset Feature

## Overview

This feature allows users to reset their password via email when they forget it. The implementation includes a dedicated password reset page and updated authentication actions.

## How It Works

### 1. User Requests Password Reset

- User navigates to `/auth` page
- Clicks "Forgot Password?" button to switch to reset mode
- Enters their email address
- Clicks "Send Reset Link"

### 2. Email Sent

- The `resetPasswordAction` sends a password reset email via Supabase Auth
- The email contains a secure link with a recovery token
- The link redirects to: `http://localhost:3000/reset-password` (or production URL)

### 3. User Clicks Reset Link

- User clicks the link in their email
- They are redirected to `/reset-password` page
- The page verifies the recovery token from the URL

### 4. Password Reset

- User enters their new password (twice for confirmation)
- Password must be at least 6 characters long
- Both password fields must match
- On success, user is redirected to `/auth` to sign in with new password

## Files Created/Modified

### New Files

- **`src/app/reset-password/page.js`** - Password reset page component
  - Validates recovery token
  - Provides form for new password entry
  - Handles password update via Supabase Auth
  - Redirects to login on success

### Modified Files

- **`src/app/actions/authActions.js`** - Updated `resetPasswordAction`
  - Added `redirectTo` parameter to specify the reset password page URL
  - Uses `NEXT_PUBLIC_SITE_URL` environment variable (falls back to localhost)
  - Updated success message

## Configuration

### Environment Variables

The feature uses the following environment variable (optional):

```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

If not set, it defaults to `http://localhost:3000` for local development.

### Supabase Configuration

Make sure your Supabase project has:

1. Email authentication enabled
2. Email templates configured (optional customization)
3. Redirect URLs configured in Supabase dashboard:
   - Add `http://localhost:3000/reset-password` for development
   - Add `https://yourdomain.com/reset-password` for production

## User Flow

```
┌─────────────────┐
│   /auth page    │
│  (Forgot Pass)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Enter Email     │
│ Click Send      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Email Sent      │
│ Check Inbox     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Click Link      │
│ in Email        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ /reset-password │
│ Token Verified  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Enter New Pass  │
│ Confirm Pass    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Password Reset  │
│ Redirect /auth  │
└─────────────────┘
```

## Security Features

1. **Token Validation**: The reset page validates the recovery token before allowing password reset
2. **Session Check**: Uses Supabase session to verify the token is valid and not expired
3. **Password Requirements**: Enforces minimum 6 character password length
4. **Confirmation Match**: Requires password to be entered twice and match
5. **Secure Links**: Reset links contain secure tokens that expire after use or timeout

## Error Handling

The page handles several error scenarios:

- Invalid or expired reset token
- Password mismatch
- Password too short
- Network errors
- Supabase authentication errors

All errors are displayed to the user via the Alert component.

## Testing

To test the password reset flow:

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/auth`

3. Click "Forgot Password?" button

4. Enter a valid user email address

5. Check the email inbox (or Supabase logs if email is not configured)

6. Click the reset link in the email

7. Enter a new password and confirm it

8. Verify you can sign in with the new password

## Production Deployment

Before deploying to production:

1. Set the `NEXT_PUBLIC_SITE_URL` environment variable to your production domain
2. Configure Supabase redirect URLs in the dashboard to include your production domain
3. Ensure email delivery is properly configured in Supabase
4. Test the complete flow in production environment

## Notes

- The reset token is single-use and expires after a set time (configured in Supabase)
- Users can request multiple reset emails if needed
- The old password becomes invalid once the reset is complete
- Users are automatically signed out after password reset and must sign in again
