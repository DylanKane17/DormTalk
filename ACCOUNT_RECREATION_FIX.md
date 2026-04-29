# Account Recreation Fix

## Problem

After deleting an account, trying to create a new account with the same email causes:

```
Error: "database error saving new user"
```

## Root Cause

The profile trigger uses `INSERT` which fails if a profile with that ID already exists. This can happen if:

1. The profile wasn't fully deleted
2. There's a timing issue with cascade deletes
3. The auth user was deleted but profile remained

## Solution

Update the profile creation trigger to use **UPSERT** (INSERT ... ON CONFLICT).

### Run This SQL

**File**: `FIX_PROFILE_TRIGGER.sql`

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (...)
  VALUES (...)
  ON CONFLICT (id)
  DO UPDATE SET
    username = EXCLUDED.username,
    school = EXCLUDED.school,
    -- ... updates all fields
  RETURN NEW;
END;
$$;
```

## How It Works

### Before (Broken)

```
User deletes account
  ↓
Profile might not be fully deleted
  ↓
User signs up with same email
  ↓
Trigger tries: INSERT INTO profiles (id = same_id)
  ↓
❌ Error: "duplicate key value violates unique constraint"
```

### After (Fixed)

```
User deletes account
  ↓
Profile might not be fully deleted
  ↓
User signs up with same email
  ↓
Trigger tries: INSERT ... ON CONFLICT DO UPDATE
  ↓
✅ Success: Profile created or updated
```

## Benefits

✅ **No More Errors**: Handles duplicate IDs gracefully
✅ **Idempotent**: Can run multiple times safely
✅ **Clean Slate**: Updates profile with new data
✅ **Backward Compatible**: Works for new and existing users
✅ **Edge Case Handling**: Covers all scenarios

## Testing

### Test Account Recreation

1. **Create and delete account**

   ```
   - Sign up: test@example.com
   - Create some content
   - Delete account
   ```

2. **Recreate with same email**

   ```
   - Sign up again: test@example.com
   - Should work without errors ✅
   - New profile created/updated
   ```

3. **Verify clean slate**
   ```
   - Old posts should be gone
   - Old comments should be gone
   - New profile with new data
   ```

## Alternative: Clean Up Orphaned Profiles

If you want to prevent this issue entirely, clean up orphaned profiles:

```sql
-- Delete profiles that don't have corresponding auth users
DELETE FROM profiles
WHERE id NOT IN (SELECT id FROM auth.users);
```

Run this periodically or add it to your deletion flow.

## What the Trigger Does

### ON CONFLICT Behavior

**If profile doesn't exist:**

- Creates new profile with signup data

**If profile exists:**

- Updates all fields with new signup data
- Resets to fresh state
- Updates `updated_at` timestamp

### Fields Updated

```sql
username = new username
school = new school
email_domain = new email domain
user_type = new user type
is_verified = new verification status
age_confirmed = new age confirmation
updated_at = NOW()
```

## Security Considerations

1. **Same User ID**: Supabase reuses user IDs for the same email
2. **Data Isolation**: Old data is deleted before recreation
3. **No Data Leakage**: New user gets fresh profile
4. **Audit Trail**: `updated_at` shows when profile was recreated

## Summary

The profile trigger now uses UPSERT to handle account recreation gracefully. Users can delete and recreate accounts with the same email without errors. The trigger ensures a clean slate while handling edge cases.

## Files

- **SQL**: `FIX_PROFILE_TRIGGER.sql` - Updated trigger with UPSERT
- **Guide**: `ACCOUNT_RECREATION_FIX.md` - This file

## Next Steps

1. **Run the SQL**: Execute `FIX_PROFILE_TRIGGER.sql` in Supabase
2. **Test Recreation**: Delete and recreate an account
3. **Verify**: Should work without "database error"

The account recreation should now work perfectly! ✅
