# User Types Migration - High School vs College

✅ **STATUS: IMPLEMENTATION COMPLETE**

This migration adds support for two user types with different requirements and features.

## Implementation Status

- ✅ Database schema designed
- ✅ SQL migration file created (`USER_TYPES_MIGRATION.sql`)
- ✅ Authentication actions updated with validation
- ✅ Signup UI updated with user type selection
- ✅ Email domain validation implemented
- ✅ Age confirmation for high school students
- ✅ Automatic verification for .edu emails
- ✅ Implementation guide created

## Quick Start

1. **Run the SQL migration**: Execute `USER_TYPES_MIGRATION.sql` in Supabase SQL Editor
2. **Test the signup flow**: Visit `/auth` and try both user types
3. **Read the guide**: See `USER_TYPES_IMPLEMENTATION_GUIDE.md` for details

## Step 1: Add User Type Fields to Profiles Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Add user type and verification fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS user_type TEXT CHECK (user_type IN ('high_school', 'college')) DEFAULT 'high_school',
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS age_confirmed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_domain TEXT;

-- Create index for user type queries
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON profiles(is_verified);
```

## Step 2: Add Anonymous Posting Support

```sql
-- Add anonymous flag to posts table
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT FALSE;

-- Add anonymous flag to comments table
ALTER TABLE comments
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT FALSE;

-- Add anonymous flag to messages table
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT FALSE;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_posts_anonymous ON posts(is_anonymous);
CREATE INDEX IF NOT EXISTS idx_comments_anonymous ON comments(is_anonymous);
CREATE INDEX IF NOT EXISTS idx_messages_anonymous ON messages(is_anonymous);
```

## Step 3: Update RLS Policies for Anonymous Content

```sql
-- Update posts select policy to handle anonymous posts
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON posts;
CREATE POLICY "Posts are viewable by everyone"
  ON posts
  FOR SELECT
  USING (true);

-- Update comments select policy to handle anonymous comments
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
CREATE POLICY "Comments are viewable by everyone"
  ON comments
  FOR SELECT
  USING (true);
```

## Step 4: Create Function to Verify Email Domain

```sql
-- Function to extract domain from email
CREATE OR REPLACE FUNCTION extract_email_domain(email TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(SPLIT_PART(email, '@', 2));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to check if email is .edu domain
CREATE OR REPLACE FUNCTION is_edu_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN extract_email_domain(email) LIKE '%.edu';
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

## Step 5: Update Profile Creation Trigger

```sql
-- Update the trigger function to set email domain
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, school, email_domain)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'school', ''),
    extract_email_domain(NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## User Type Rules

### High School Students

- **Email**: Any email address (no .edu required)
- **Age Verification**: Must confirm they are 16+ years old
- **Anonymous Posting**: Can post, comment, and message anonymously
- **Verification**: Not verified by default

### College Students

- **Email**: Must use @[university].edu email
- **Email Verification**: Automatically verified if .edu email
- **Anonymous Posting**: Cannot post anonymously (real identity required)
- **Verification**: Verified based on .edu email domain

## Features Enabled

✅ Two distinct user types
✅ Email domain verification for college students
✅ Age confirmation for high school students
✅ Anonymous posting for high school students only
✅ Automatic verification for .edu emails
✅ Database constraints and indexes

## Notes

- User type is set during signup
- College students must use .edu email matching their school
- High school students can choose to post anonymously
- Anonymous posts still track the user_id internally for moderation
- Display name shows "Anonymous" for anonymous content
