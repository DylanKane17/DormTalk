# Database Fix Guide - Sign Up Not Working

This guide will help you fix sign-up issues after manually deleting data from your Supabase database.

## Problem

After manually deleting users, posts, and comments from the database, sign-up is no longer working. This is likely due to:

1. Broken foreign key constraints
2. Orphaned data in auth.users table
3. Missing triggers or functions
4. RLS policies blocking operations

## Quick Fix - Reset Everything

### Step 1: Clean Up Auth Users

Run this in Supabase SQL Editor:

```sql
-- Delete all users from auth.users (this will cascade to profiles)
DELETE FROM auth.users;
```

### Step 2: Verify Tables Are Empty

```sql
-- Check if tables are empty
SELECT COUNT(*) FROM profiles;
SELECT COUNT(*) FROM posts;
SELECT COUNT(*) FROM comments;
SELECT COUNT(*) FROM auth.users;
```

All counts should be 0.

### Step 3: Reset Sequences (if using serial IDs)

```sql
-- Only run if you're using serial/sequence IDs
-- Skip this if you're using UUIDs
ALTER SEQUENCE IF EXISTS profiles_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS posts_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS comments_id_seq RESTART WITH 1;
```

### Step 4: Verify Database Triggers

Check if the profile creation trigger exists:

```sql
-- Check for trigger
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

If it doesn't exist, create it:

```sql
-- Create function to auto-create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, school)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'school', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Step 5: Verify RLS Policies

Check and fix RLS policies:

```sql
-- Disable RLS temporarily to test (ONLY FOR TESTING)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
```

Then try signing up. If it works, re-enable RLS and add proper policies:

```sql
-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Add proper policies for profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Add proper policies for posts
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON posts;
CREATE POLICY "Posts are viewable by everyone"
ON posts FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can insert own posts" ON posts;
CREATE POLICY "Users can insert own posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own posts" ON posts;
CREATE POLICY "Users can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own posts" ON posts;
CREATE POLICY "Users can delete own posts"
ON posts FOR DELETE
USING (auth.uid() = user_id);

-- Add proper policies for comments
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
CREATE POLICY "Comments are viewable by everyone"
ON comments FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can insert own comments" ON comments;
CREATE POLICY "Users can insert own comments"
ON comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own comments" ON comments;
CREATE POLICY "Users can update own comments"
ON comments FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
CREATE POLICY "Users can delete own comments"
ON comments FOR DELETE
USING (auth.uid() = user_id);
```

## Alternative: Check Specific Error

If you're getting a specific error message, check the browser console or terminal for details.

### Common Errors and Fixes

#### Error: "duplicate key value violates unique constraint"

```sql
-- Check for orphaned data
SELECT * FROM profiles WHERE id NOT IN (SELECT id FROM auth.users);
SELECT * FROM posts WHERE user_id NOT IN (SELECT id FROM auth.users);
SELECT * FROM comments WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Delete orphaned data
DELETE FROM profiles WHERE id NOT IN (SELECT id FROM auth.users);
DELETE FROM posts WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM comments WHERE user_id NOT IN (SELECT id FROM auth.users);
```

#### Error: "new row violates row-level security policy"

This means RLS is blocking the operation. Temporarily disable RLS (see Step 5 above) to test, then add proper policies.

#### Error: "null value in column violates not-null constraint"

Check which columns are required:

```sql
-- Check table structure
\d profiles
\d posts
\d comments
```

Make sure your sign-up is providing all required fields.

## Test Sign Up

After running the fixes:

1. Go to `/auth` page
2. Try signing up with:
   - Email: test@example.com
   - Password: password123
   - Username: testuser
   - School: Test University

3. Check if it works

4. Verify in Supabase:
   ```sql
   SELECT * FROM auth.users;
   SELECT * FROM profiles;
   ```

## Prevention

To safely delete data in the future:

```sql
-- Safe way to delete all data (respects foreign keys)
DELETE FROM comments;  -- Delete comments first
DELETE FROM posts;     -- Then posts
DELETE FROM profiles;  -- Then profiles
DELETE FROM auth.users; -- Finally users (this cascades to profiles if set up correctly)
```

Or use TRUNCATE with CASCADE:

```sql
-- Nuclear option - deletes everything
TRUNCATE auth.users CASCADE;
TRUNCATE profiles CASCADE;
TRUNCATE posts CASCADE;
TRUNCATE comments CASCADE;
```

## Still Not Working?

If sign-up still doesn't work:

1. Check the browser console for JavaScript errors
2. Check the terminal for server errors
3. Check Supabase logs in the dashboard
4. Try creating a user directly in Supabase Auth dashboard
5. Verify your `.env.local` file has correct Supabase credentials

## Need More Help?

Share the specific error message you're seeing:

- Browser console error
- Terminal error
- Supabase logs error

This will help diagnose the exact issue.
