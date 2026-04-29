# Admin System Documentation

## Overview

An admin system has been implemented to provide special permissions for designated administrators. Admins have access to the moderation dashboard and can manage flagged content.

## Setup Instructions

### 1. Configure Admin Email

**IMPORTANT:** You must update the admin email in the configuration file.

1. Open `src/app/config/admin.js`
2. Replace `"admin@example.com"` with your actual admin email address:

```javascript
export const ADMIN_EMAIL = "your-email@example.com";
```

3. Save the file

### 2. Create Admin Account

1. Sign up for an account using the email you configured above
2. Once logged in, you will automatically have admin access

### 3. Access Admin Dashboard

- Log in with your admin account
- Click on your profile picture in the top right
- Select "Admin Dashboard" from the dropdown menu
- You will be taken to `/moderation` where you can manage flagged posts

## Admin Permissions

Admins have the following special permissions:

### Moderation Dashboard Access

- View all flagged posts
- Unflag posts (approve them)
- Hide posts from public view
- Unhide previously hidden posts
- Delete any post permanently

### Protected Actions

The following actions require admin access:

- `getFlaggedPostsAction()` - View flagged content
- `unflagPostAction()` - Approve flagged content
- `hidePostAction()` - Hide posts
- `unhidePostAction()` - Unhide posts

## How It Works

### Email-Based Authentication

- Admin status is determined by email address
- The system checks if the logged-in user's email matches the configured admin email
- Case-insensitive matching (admin@example.com = ADMIN@EXAMPLE.COM)

### Server-Side Protection

- All admin actions are protected on the server side
- Unauthorized users receive an error message: "Unauthorized: Admin access required"
- Cannot be bypassed from the client side

### Client-Side UI

- Admin dashboard link only appears for admin users
- Styled in orange to distinguish from regular menu items
- Located in the profile dropdown menu

## Files Modified/Created

### New Files

- `src/app/config/admin.js` - Admin email configuration
- `src/app/utils/adminCheck.js` - Server-side admin verification
- `src/app/actions/adminActions.js` - Client-accessible admin check
- `ADMIN_SYSTEM.md` - This documentation

### Modified Files

- `src/app/actions/moderationActions.js` - Added admin checks to all moderation actions
- `src/app/components/Navigation.js` - Added admin dashboard link for admin users

## Security Considerations

### Best Practices

1. **Keep admin email private** - Don't share your admin email publicly
2. **Use a strong password** - Admin accounts should have secure passwords
3. **Regular monitoring** - Check the moderation dashboard regularly
4. **Audit trail** - All moderation actions are logged with timestamps

### Limitations

- Currently supports only one admin email
- To add multiple admins, modify `src/app/config/admin.js` to use an array:

```javascript
export const ADMIN_EMAILS = ["admin1@example.com", "admin2@example.com"];

export function isAdminEmail(email) {
  if (!email) return false;
  return ADMIN_EMAILS.some(
    (adminEmail) => email.toLowerCase() === adminEmail.toLowerCase(),
  );
}
```

## Troubleshooting

### "Unauthorized: Admin access required" Error

- Verify your email in `src/app/config/admin.js` matches your account email exactly
- Log out and log back in to refresh your session
- Check that you're using the correct email address

### Admin Dashboard Link Not Showing

- Ensure you're logged in with the admin email
- Clear your browser cache and reload
- Check browser console for any errors

### Cannot Access Moderation Page

- Verify the admin email is configured correctly
- Ensure you're logged in
- Try accessing `/moderation` directly in the URL

## Future Enhancements

Potential improvements for the admin system:

1. **Multiple Admin Support** - Allow multiple admin emails
2. **Role-Based Permissions** - Different levels of admin access
3. **Admin Activity Log** - Track all admin actions
4. **User Management** - Ban/suspend users
5. **Content Analytics** - Dashboard with moderation statistics
6. **Email Notifications** - Alert admins of new flagged content

## Support

For issues or questions about the admin system:

1. Check this documentation first
2. Review the code in `src/app/config/admin.js`
3. Verify your configuration matches the setup instructions
