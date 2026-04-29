# User Types Implementation Guide

## Overview

This guide explains how to implement and use the new user type system that differentiates between high school and college students.

## Features Implemented

### ✅ Two User Types

1. **High School Students**
   - Can use any email address (no .edu required)
   - Must confirm they are at least 16 years old
   - Default user type
   - Not automatically verified

2. **College Students**
   - **MUST** use a .edu email address
   - Email domain must match their school name
   - Automatically verified when using .edu email
   - No age confirmation required (assumed 18+)

### ✅ Email Domain Validation

The system validates that college students use an official .edu email that matches their school:

- **Example 1**: Wake Forest University → must use @wfu.edu
- **Example 2**: Stanford University → must use @stanford.edu
- **Example 3**: University of Michigan → must use @umich.edu

The validation is flexible and checks if any part of the email domain matches the school name.

## Database Schema Changes

### New Columns in `profiles` Table

```sql
- user_type: TEXT ('high_school' or 'college')
- is_verified: BOOLEAN (auto-true for .edu emails)
- age_confirmed: BOOLEAN (required for high school)
- email_domain: TEXT (extracted from email)
```

### New Columns in Content Tables (Optional - for future use)

```sql
- posts.is_anonymous: BOOLEAN
- comments.is_anonymous: BOOLEAN
- messages.is_anonymous: BOOLEAN
```

## Installation Steps

### Step 1: Run Database Migration

1. Open your Supabase Dashboard
2. Go to SQL Editor
3. Copy the contents of `USER_TYPES_MIGRATION.sql`
4. Run the migration
5. Verify all columns were added successfully

### Step 2: Verify Trigger Function

The migration creates a trigger that automatically:

- Extracts email domain from user's email
- Sets user type from signup metadata
- Sets verification status based on .edu email
- Creates profile with all user type fields

### Step 3: Test the Implementation

1. **Test High School Signup**:
   - Select "High School Student"
   - Use any email (e.g., student@gmail.com)
   - Check the age confirmation box
   - Complete signup
   - Verify profile has `user_type: 'high_school'`

2. **Test College Signup**:
   - Select "College Student"
   - Enter school name (e.g., "Wake Forest University")
   - Use matching .edu email (e.g., student@wfu.edu)
   - Complete signup
   - Verify profile has `user_type: 'college'` and `is_verified: true`

3. **Test Email Validation**:
   - Try college signup with non-.edu email → should fail
   - Try college signup with mismatched domain → should fail
   - Try college signup with correct .edu email → should succeed

## Code Changes Made

### 1. Authentication Actions (`src/app/actions/authActions.js`)

Added three helper functions:

- `extractEmailDomain(email)` - Extracts domain from email
- `isEduEmail(email)` - Checks if email ends with .edu
- `validateCollegeEmail(email, school, userType)` - Validates college email matches school

Updated `signUpAction` to:

- Accept `userType` and `ageConfirmed` parameters
- Validate user type selection
- Validate age confirmation for high school students
- Validate .edu email for college students
- Pass user type metadata to Supabase

### 2. Signup UI (`src/app/auth/page.js`)

Added:

- Radio buttons to select user type (high school vs college)
- Dynamic placeholder text based on user type
- Warning message for college students about .edu requirement
- Age confirmation checkbox for high school students
- Conditional validation based on user type

## Validation Rules

### High School Students

```javascript
✅ Any email address accepted
✅ Must check age confirmation (16+)
✅ user_type: 'high_school'
✅ is_verified: false
```

### College Students

```javascript
✅ Must use .edu email
✅ Email domain must match school name
✅ user_type: 'college'
✅ is_verified: true (automatic)
✅ No age confirmation needed
```

## Error Messages

The system provides clear error messages:

- **Invalid user type**: "Invalid user type. Please select High School or College."
- **Age not confirmed**: "You must confirm that you are at least 16 years old."
- **Non-.edu email**: "College students must use a .edu email address."
- **Domain mismatch**: "Email domain (example.edu) does not match your school (Different University). Please use your official school email."

## Future Enhancements

### Anonymous Posting (Database Ready)

The database schema includes `is_anonymous` columns for future implementation:

- High school students could post anonymously
- College students would use real identity
- Anonymous posts still track user_id internally for moderation

### Verification Badge

Display verification status on profiles:

```javascript
{
  profile.is_verified && <span className="text-green-500">✓ Verified</span>;
}
```

### User Type Filtering

Filter content by user type:

```sql
SELECT * FROM posts
JOIN profiles ON posts.user_id = profiles.id
WHERE profiles.user_type = 'college';
```

## Troubleshooting

### Issue: Email validation too strict

If the domain matching is too strict, you can adjust the validation logic in `validateCollegeEmail()` function in `authActions.js`.

### Issue: Existing users missing user_type

Run this SQL to backfill:

```sql
UPDATE profiles
SET user_type = 'high_school'
WHERE user_type IS NULL;
```

### Issue: Trigger not firing

Verify the trigger exists:

```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

Recreate if needed:

```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## Security Considerations

1. **Email Verification**: College students should verify their email to ensure they own the .edu address
2. **Age Verification**: High school age confirmation is self-reported (consider additional verification)
3. **Domain Spoofing**: The system validates domain format but doesn't verify actual enrollment
4. **Privacy**: User type is stored in profiles table (consider RLS policies if needed)

## Testing Checklist

- [ ] High school signup with Gmail works
- [ ] High school signup without age confirmation fails
- [ ] College signup with .edu email works
- [ ] College signup without .edu email fails
- [ ] College signup with mismatched domain fails
- [ ] Profile created with correct user_type
- [ ] Profile created with correct is_verified status
- [ ] Profile created with correct email_domain
- [ ] Existing users can still sign in
- [ ] User type displayed correctly in UI

## Support

If you encounter issues:

1. Check Supabase logs for database errors
2. Check browser console for frontend errors
3. Verify all migration steps completed successfully
4. Test with different email domains
5. Review the validation logic in authActions.js

## Summary

The user type system is now fully implemented with:

- ✅ Database schema updated
- ✅ Email domain validation
- ✅ User type selection UI
- ✅ Age confirmation for high school
- ✅ Automatic verification for .edu emails
- ✅ Clear error messages
- ✅ Comprehensive documentation

Users can now sign up as either high school or college students with appropriate validation for each type.
