# Profile Features Database Migration Guide

This guide explains the database schema changes required to support the new profile features in DormTalk.

## Overview

The profile features add the following fields to user profiles:

- **Major** - Student's field of study
- **Hometown** - Where the student is from
- **Activities** - On-campus activities and clubs
- **Bio** - Short personal description (100 character limit)

## Required Database Changes

### Profiles Table Modifications

You need to add the following columns to your `profiles` table in Supabase:

```sql
-- Add new profile fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS major TEXT,
ADD COLUMN IF NOT EXISTS hometown TEXT,
ADD COLUMN IF NOT EXISTS activities TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Optional: Add check constraint for bio length
ALTER TABLE profiles
ADD CONSTRAINT bio_length_check CHECK (char_length(bio) <= 100);
```

### Column Descriptions

| Column       | Type | Description                    | Constraints        |
| ------------ | ---- | ------------------------------ | ------------------ |
| `major`      | TEXT | Student's field of study       | Optional           |
| `hometown`   | TEXT | Student's hometown             | Optional           |
| `activities` | TEXT | On-campus activities and clubs | Optional           |
| `bio`        | TEXT | Personal bio/description       | Max 100 characters |

## Step-by-Step Migration Instructions

### Option 1: Using Supabase Dashboard (Recommended)

1. **Log in to your Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration Script**
   - Copy the SQL script from the "Profiles Table Modifications" section above
   - Paste it into the SQL editor
   - Click "Run" to execute the migration

4. **Verify the Changes**
   - Go to "Table Editor" in the left sidebar
   - Select the `profiles` table
   - Verify that the new columns appear in the table schema

### Option 2: Using Supabase CLI

If you're using the Supabase CLI for migrations:

1. **Create a new migration file**

   ```bash
   supabase migration new add_profile_fields
   ```

2. **Edit the migration file**
   - Open the newly created file in `supabase/migrations/`
   - Add the SQL script from above

3. **Apply the migration**
   ```bash
   supabase db push
   ```

## Testing the Migration

After running the migration, test the new features:

1. **Test Profile Editing**
   - Navigate to `/profile/edit`
   - Fill in the new fields (major, hometown, activities, bio)
   - Save changes
   - Verify the data is saved correctly

2. **Test Profile Viewing**
   - Navigate to your profile at `/profile/[your-user-id]`
   - Verify all fields display correctly
   - Test viewing other users' profiles

3. **Test Bio Character Limit**
   - Try entering more than 100 characters in the bio field
   - Verify it's limited to 100 characters
   - Check that the character counter works

4. **Test Clickable Usernames**
   - Go to `/posts`
   - Click on a username in a post
   - Verify it navigates to that user's profile

## Rollback Instructions

If you need to rollback these changes:

```sql
-- Remove the new profile columns
ALTER TABLE profiles
DROP COLUMN IF EXISTS major,
DROP COLUMN IF EXISTS hometown,
DROP COLUMN IF EXISTS activities,
DROP COLUMN IF EXISTS bio;

-- Remove the constraint if added
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS bio_length_check;
```

## Features Enabled by This Migration

After completing this migration, users will be able to:

1. **Edit Their Profile**
   - Add/update major, hometown, activities, and bio
   - Access via `/profile/edit` page
   - Character limit enforced on bio field

2. **View Profiles**
   - View their own profile at `/profile/[user-id]`
   - View other users' profiles
   - See profile statistics (post count, comment count)

3. **Navigate to Profiles**
   - Click usernames in posts to view profiles
   - Search for users and view their profiles

## Support

If you encounter issues during migration:

1. Check the Supabase logs in the dashboard
2. Verify your database connection
3. Ensure you have the necessary permissions
4. Review the RLS policies if queries are being blocked
