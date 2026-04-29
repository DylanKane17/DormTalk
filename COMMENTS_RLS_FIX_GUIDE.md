# Fix Comments RLS Policy Error

## Problem

You're getting the error: **"new row violates row-level security policy for table 'comments'"**

This happens when you try to post a comment because the Row Level Security (RLS) policy for INSERT operations on the `comments` table is either missing or incorrectly configured.

## Root Cause

The `comments` table has RLS enabled, but the INSERT policy is either:

1. Missing entirely
2. Configured incorrectly (not matching `auth.uid()` with `user_id`)
3. Using the wrong condition

## Solution

### Step 1: Access Supabase SQL Editor

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project
3. Click on **"SQL Editor"** in the left sidebar
4. Click **"New Query"**

### Step 2: Run the Fix Script

Copy and paste the entire contents of `FIX_COMMENTS_RLS.sql` into the SQL editor, or copy this:

```sql
-- Fix Comments RLS Policy Issue
-- This script will fix the "new row violates row-level security policy" error

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
DROP POLICY IF EXISTS "Users can insert own comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;

-- Enable RLS on comments table (if not already enabled)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create proper RLS policies for comments

-- 1. SELECT policy - Everyone can view comments
CREATE POLICY "Comments are viewable by everyone"
ON comments FOR SELECT
USING (true);

-- 2. INSERT policy - Users can insert their own comments
-- This is the critical one that was likely missing or incorrect
CREATE POLICY "Users can insert own comments"
ON comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. UPDATE policy - Users can update their own comments
CREATE POLICY "Users can update own comments"
ON comments FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. DELETE policy - Users can delete their own comments
CREATE POLICY "Users can delete own comments"
ON comments FOR DELETE
USING (auth.uid() = user_id);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'comments';
```

### Step 3: Execute the Script

1. Click the **"Run"** button (or press Cmd/Ctrl + Enter)
2. Wait for the script to complete
3. You should see a success message and a table showing the created policies

### Step 4: Verify the Fix

The last SELECT statement in the script will show you all the policies for the `comments` table. You should see 4 policies:

1. ✅ Comments are viewable by everyone (SELECT)
2. ✅ Users can insert own comments (INSERT)
3. ✅ Users can update own comments (UPDATE)
4. ✅ Users can delete own comments (DELETE)

### Step 5: Test Posting a Comment

1. Go to your application
2. Navigate to any post (e.g., `/posts/[id]`)
3. Try posting a comment
4. The error should be gone! ✨

## What This Fix Does

### The Critical Policy

The most important policy is the INSERT policy:

```sql
CREATE POLICY "Users can insert own comments"
ON comments FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

This policy:

- Allows authenticated users to insert comments
- Ensures the `user_id` in the comment matches the authenticated user's ID (`auth.uid()`)
- Prevents users from creating comments as other users

### How Your Code Works With This

In your `createComment` function (in `crud.js`):

```javascript
export async function createComment(post_id, content) {
  const supabase = await createClient();
  const user_id = await getUserID(supabase);

  // This inserts with user_id = current user's ID
  const { data, error } = await supabase
    .from("comments")
    .insert([{ post_id, content, user_id }]) // ← user_id matches auth.uid()
    .select()
    .single();

  return { data, error };
}
```

The RLS policy checks that `user_id` (in the INSERT data) equals `auth.uid()` (the authenticated user), which it does, so the INSERT is allowed.

## Alternative: Temporary Disable RLS (NOT RECOMMENDED)

If you need to test quickly and want to temporarily disable RLS:

```sql
-- ONLY FOR TESTING - NOT FOR PRODUCTION
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
```

Then re-enable it and add proper policies:

```sql
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
-- Then run the policy creation statements above
```

## Troubleshooting

### Still Getting the Error?

1. **Check if you're logged in**: The error can also occur if `auth.uid()` is NULL (user not authenticated)
   - Make sure you're logged in before posting a comment
   - Check your browser's Application/Storage tab for auth tokens

2. **Verify the user_id is being set correctly**:

   ```sql
   -- Check recent comments
   SELECT id, user_id, content, created_at FROM comments ORDER BY created_at DESC LIMIT 5;
   ```

3. **Check Supabase logs**:
   - Go to Supabase Dashboard → Logs
   - Look for detailed error messages

4. **Verify your Supabase client is using the correct auth**:
   - Check that `createClient()` in `server.js` is properly configured
   - Ensure cookies are being passed correctly

### Error: "permission denied for table comments"

This is different from RLS. Run:

```sql
GRANT ALL ON comments TO authenticated;
GRANT ALL ON comments TO anon;
```

### Error: "relation 'comments' does not exist"

Your comments table might not exist. Create it:

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Verify All Tables Have Proper RLS

While you're at it, make sure your other tables also have proper RLS policies. Check the `DATABASE_FIX_GUIDE.md` file for complete policies for:

- `profiles` table
- `posts` table
- `comments` table

## Need More Help?

If you're still experiencing issues:

1. Check the browser console for JavaScript errors
2. Check the terminal/server logs for backend errors
3. Look at Supabase Dashboard → Logs for database errors
4. Share the specific error message you're seeing

## Summary

The fix is simple: **Add the missing INSERT policy for the comments table**. The policy ensures that users can only create comments with their own `user_id`, which is exactly what your application code does.

After running the SQL script, you should be able to post comments without any RLS errors! 🎉
