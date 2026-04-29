# Post Deletion Fix Guide

## Problem

Users were unable to delete their own posts when they were not admins. The delete functionality was being blocked at the database level by Row Level Security (RLS) policies.

## Root Cause

The issue was caused by missing or incorrect RLS policies on the `posts` table. The database was likely configured to only allow admins to delete posts, or there was no DELETE policy at all, which would block all deletion attempts by regular users.

## Solution

The fix involves creating a proper RLS policy that allows users to delete their own posts while still maintaining security.

### What Changed

1. **Database RLS Policy**: Added/updated the DELETE policy on the `posts` table to allow users to delete posts where they are the owner (`auth.uid() = user_id`)

### Files Involved

- **FIX_POST_DELETE_RLS.sql**: SQL migration script to fix the RLS policy
- **src/app/utils/supabase/crud.js**: Already has the correct `deletePost` function (no changes needed)
- **src/app/actions/postActions.js**: Already has the correct `deletePostAction` (no changes needed)
- **src/app/my-posts/page.js**: Already has the correct UI implementation (no changes needed)

## Implementation Steps

### Step 1: Run the SQL Migration

1. **Log in to your Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration Script**
   - Open the file `FIX_POST_DELETE_RLS.sql`
   - Copy the entire contents
   - Paste it into the SQL editor
   - Click "Run" to execute the migration

4. **Verify the Policy**
   - The script includes a verification query at the end
   - You should see a policy named "Users can delete their own posts" with cmd = 'DELETE'
   - The qual column should show: `(auth.uid() = user_id)`

### Step 2: Test the Fix

1. **Test as a Regular User**
   - Log in as a non-admin user
   - Navigate to `/my-posts`
   - Create a test post
   - Click the "Delete" button on your own post
   - Confirm the deletion
   - The post should be deleted successfully

2. **Test Security**
   - Try to delete another user's post (this should fail)
   - The RLS policy ensures users can only delete their own posts

3. **Test Admin Functionality**
   - Admins can still delete any post using the `adminDeletePost` function
   - This uses a separate SQL function that bypasses RLS

## How It Works

### RLS Policy Explanation

```sql
CREATE POLICY "Users can delete their own posts"
ON posts
FOR DELETE
USING (auth.uid() = user_id);
```

- **Policy Name**: "Users can delete their own posts"
- **Table**: `posts`
- **Operation**: `DELETE`
- **Condition**: `auth.uid() = user_id`
  - `auth.uid()` returns the ID of the currently authenticated user
  - `user_id` is the column in the posts table that stores the post owner's ID
  - The policy only allows deletion when these match

### Application Flow

1. User clicks "Delete" button on their post in `/my-posts`
2. Frontend calls `deletePostAction(postId)` from `postActions.js`
3. Action calls `deletePost(postId)` from `crud.js`
4. Supabase client attempts to delete the post
5. RLS policy checks if `auth.uid() = user_id`
6. If true, deletion proceeds; if false, deletion is blocked
7. Result is returned to the frontend

### Admin Deletion (Separate Flow)

Admins use a different function that bypasses RLS:

1. Admin uses moderation dashboard
2. Calls `adminDeletePostAction(postId)` from `adminPostActions.js`
3. Action calls `adminDeletePost(postId)` from `crud.js`
4. This calls the `admin_delete_post` SQL function
5. SQL function runs with elevated privileges, bypassing RLS
6. Post is deleted regardless of ownership

## Troubleshooting

### Issue: Still Can't Delete Posts

**Possible Causes:**

1. RLS policy wasn't created successfully
2. Multiple conflicting policies exist
3. RLS is disabled on the table

**Solution:**

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'posts';

-- If rowsecurity is false, enable it
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Check all policies on posts table
SELECT * FROM pg_policies WHERE tablename = 'posts';

-- If there are conflicting policies, drop them and recreate
DROP POLICY IF EXISTS "conflicting_policy_name" ON posts;
```

### Issue: Error "new row violates row-level security policy"

This error is for INSERT/UPDATE operations, not DELETE. If you see this:

**Solution:**

```sql
-- Ensure you have proper INSERT and UPDATE policies
CREATE POLICY "Users can insert their own posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
ON posts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### Issue: "permission denied for table posts"

This is a different issue from RLS - it's about table-level permissions.

**Solution:**

```sql
-- Grant necessary permissions (run as superuser)
GRANT ALL ON posts TO authenticated;
GRANT ALL ON posts TO service_role;
```

## Security Considerations

### What This Fix Provides

✅ Users can delete their own posts
✅ Users cannot delete other users' posts
✅ Admins can still delete any post (via admin function)
✅ Anonymous users cannot delete posts (must be authenticated)

### What This Fix Does NOT Do

❌ Does not allow users to delete other users' posts
❌ Does not bypass authentication requirements
❌ Does not affect other operations (SELECT, INSERT, UPDATE)

## Related Files

- **ADMIN_DELETE_FUNCTION.sql**: Contains the admin bypass function
- **DATABASE_MIGRATION.md**: General database migration guide
- **src/app/actions/postActions.js**: Post action handlers
- **src/app/utils/supabase/crud.js**: Database CRUD operations

## Additional Notes

### Comments Deletion

When a post is deleted, associated comments should also be deleted. This is typically handled by:

1. Database CASCADE constraints on foreign keys
2. Or explicit deletion in the application code

Check your database schema:

```sql
-- Verify CASCADE is set up
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.table_name = 'comments'
  AND tc.constraint_type = 'FOREIGN KEY'
  AND kcu.column_name = 'post_id';
```

If CASCADE is not set up, you may need to use `deletePostWithComments` function instead.

## Testing Checklist

- [ ] Regular user can delete their own post
- [ ] Regular user cannot delete another user's post
- [ ] Admin can delete any post via admin function
- [ ] Unauthenticated users cannot delete posts
- [ ] Post deletion works from `/my-posts` page
- [ ] Comments are properly handled when post is deleted
- [ ] Page revalidates after deletion
- [ ] Success message is shown after deletion

## Support

If you continue to experience issues after applying this fix:

1. Check the Supabase logs in the dashboard
2. Verify the RLS policy was created correctly
3. Test with a fresh user account
4. Check browser console for error messages
5. Verify your Supabase client is properly authenticated
