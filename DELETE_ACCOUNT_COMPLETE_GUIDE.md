# Complete Account Deletion Guide

## Problem

Account deletion was not working properly:

- ❌ Users could still sign in after "deletion"
- ❌ Posts and comments were not deleted
- ❌ User data remained in database

## Root Causes

1. **Missing Database Function**: The `delete_user()` RPC function wasn't created
2. **Missing CASCADE Constraints**: Foreign keys weren't set to cascade delete
3. **Incomplete Deletion**: Only profile was being deleted, not all related data

## Complete Solution

### Step 1: Run the Complete Fix SQL

**File**: `DELETE_USER_COMPLETE_FIX.sql`

This SQL script does three things:

1. **Sets up CASCADE DELETE on all foreign keys**
   - posts → profiles (CASCADE)
   - comments → profiles (CASCADE)
   - votes → profiles (CASCADE)
   - messages → profiles (CASCADE)
   - profiles → auth.users (CASCADE)

2. **Creates the `delete_user()` function**
   - Allows users to delete their own auth account
   - Runs with SECURITY DEFINER privileges
   - Cascades to all related data

3. **Creates backup `delete_user_data()` function**
   - Manual deletion method if needed
   - Deletes everything in correct order

### Step 2: Updated Code (Already Done)

**File**: `src/app/actions/authActions.js`

The `deleteAccountAction` now:

1. ✅ Deletes comment votes
2. ✅ Deletes post votes
3. ✅ Deletes messages (sent and received)
4. ✅ Deletes comments
5. ✅ Deletes posts
6. ✅ Deletes profile
7. ✅ Calls `delete_user()` RPC to remove auth user
8. ✅ Signs out the user

## How It Works

### Deletion Flow

```
User clicks "Delete Account"
  ↓
Verify password
  ↓
Delete comment_votes (user_id)
  ↓
Delete post_votes (user_id)
  ↓
Delete messages (sender_id & recipient_id)
  ↓
Delete comments (user_id)
  ↓
Delete posts (user_id)
  ↓
Delete profile (id)
  ↓
Call delete_user() RPC
  ↓
Delete auth.users entry
  ↓
Sign out
  ↓
✅ Account completely removed
```

### Why Manual Deletion?

We delete data manually (instead of relying on CASCADE) because:

1. **Guaranteed Execution**: We know exactly what's being deleted
2. **No RLS Issues**: Direct deletion bypasses potential RLS blocks
3. **Better Error Handling**: We can catch and report specific failures
4. **Works Without Function**: Even if `delete_user()` RPC fails, data is gone

## Testing

### Test Account Deletion

1. **Create a test account**

   ```
   - Sign up with test credentials
   - Create some posts
   - Create some comments
   - Vote on content
   ```

2. **Delete the account**

   ```
   - Go to profile settings
   - Click "Delete Account"
   - Enter password
   - Type "DELETE"
   - Submit
   ```

3. **Verify deletion**
   ```
   - Try to sign in → Should fail
   - Check posts page → Posts should be gone
   - Check comments → Comments should be gone
   - Check database → Profile should be gone
   ```

### Verification Queries

Run these in Supabase SQL Editor to verify:

```sql
-- Check if user still exists (replace with actual user_id)
SELECT * FROM auth.users WHERE id = 'user-id-here';

-- Check if profile still exists
SELECT * FROM profiles WHERE id = 'user-id-here';

-- Check if posts still exist
SELECT * FROM posts WHERE user_id = 'user-id-here';

-- Check if comments still exist
SELECT * FROM comments WHERE user_id = 'user-id-here';
```

All queries should return 0 rows after deletion.

## Troubleshooting

### Issue: RLS Blocking Deletions

**Symptom**: Data not being deleted, RLS policy errors

**Solution**: Update RLS policies to allow users to delete their own data:

```sql
-- Allow users to delete their own posts
CREATE POLICY "Users can delete own posts"
ON posts FOR DELETE
USING (auth.uid() = user_id);

-- Allow users to delete their own comments
CREATE POLICY "Users can delete own comments"
ON comments FOR DELETE
USING (auth.uid() = user_id);

-- Allow users to delete their own votes
CREATE POLICY "Users can delete own votes"
ON post_votes FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comment votes"
ON comment_votes FOR DELETE
USING (auth.uid() = user_id);

-- Allow users to delete their own messages
CREATE POLICY "Users can delete own messages"
ON messages FOR DELETE
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
```

### Issue: Foreign Key Constraints

**Symptom**: "violates foreign key constraint" errors

**Solution**: Run `DELETE_USER_COMPLETE_FIX.sql` to set up CASCADE DELETE

### Issue: Auth User Not Deleted

**Symptom**: User can still sign in after deletion

**Solution**:

1. Verify `delete_user()` function exists
2. Check function has SECURITY DEFINER
3. Verify GRANT EXECUTE permission
4. If still failing, manually delete from Supabase dashboard

## Manual Cleanup (If Needed)

If automated deletion fails, manually clean up:

```sql
-- Replace 'user-id-here' with actual user ID
DELETE FROM comment_votes WHERE user_id = 'user-id-here';
DELETE FROM post_votes WHERE user_id = 'user-id-here';
DELETE FROM messages WHERE sender_id = 'user-id-here' OR recipient_id = 'user-id-here';
DELETE FROM comments WHERE user_id = 'user-id-here';
DELETE FROM posts WHERE user_id = 'user-id-here';
DELETE FROM profiles WHERE id = 'user-id-here';

-- Delete from auth (requires admin access)
-- Do this in Supabase Dashboard → Authentication → Users → Delete
```

## Security Notes

1. **Password Verification**: User must enter password to delete
2. **Confirmation Required**: User must type "DELETE" to confirm
3. **No Undo**: Deletion is permanent and irreversible
4. **Data Privacy**: All user data is completely removed
5. **Cascade Safety**: Foreign keys ensure referential integrity

## Summary

The account deletion now works properly by:

✅ **Manual Deletion**: Explicitly deletes all user data in correct order
✅ **No Dependencies**: Works even if CASCADE isn't set up
✅ **Complete Removal**: Deletes votes, messages, comments, posts, profile
✅ **Auth Cleanup**: Attempts to delete auth user via RPC
✅ **Guaranteed Logout**: Signs out user after deletion
✅ **Better Messaging**: Confirms "Account and all data deleted successfully"

## Files

- **SQL**: `DELETE_USER_COMPLETE_FIX.sql` - Complete database setup
- **Code**: `src/app/actions/authActions.js` - Updated deletion logic
- **Docs**: `DELETE_ACCOUNT_COMPLETE_GUIDE.md` - This file

## Next Steps

1. **Run the SQL**: Execute `DELETE_USER_COMPLETE_FIX.sql` in Supabase
2. **Test Deletion**: Try deleting a test account
3. **Verify**: Check that user can't sign in and all data is gone

The deletion should now work completely and reliably!
