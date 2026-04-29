# Complete Setup Instructions - User Types Feature

## ⚠️ IMPORTANT: Run Migrations FIRST!

The "unexpected_failure" error occurs because the database columns don't exist yet. You MUST run the SQL migrations before testing signup.

## 📋 Step-by-Step Setup (DO IN ORDER!)

### Step 1: Run User Types Migration ⭐ REQUIRED

**File**: `USER_TYPES_MIGRATION.sql`

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the ENTIRE contents of `USER_TYPES_MIGRATION.sql`
4. Click "Run"
5. Wait for success message

**This creates:**

- `user_type` column in profiles
- `is_verified` column in profiles
- `age_confirmed` column in profiles
- `email_domain` column in profiles
- `is_anonymous` columns in posts/comments/messages
- Helper functions for email validation
- Updated `handle_new_user()` trigger

### Step 2: Run Delete User Fix ⭐ REQUIRED

**File**: `DELETE_USER_COMPLETE_FIX.sql`

1. In Supabase SQL Editor
2. Copy and paste the ENTIRE contents of `DELETE_USER_COMPLETE_FIX.sql`
3. Click "Run"
4. Wait for success message

**This creates:**

- CASCADE DELETE constraints on all foreign keys
- `delete_user()` function
- `delete_user_data()` backup function

### Step 3: Run Profile Trigger Fix ⭐ REQUIRED

**File**: `FIX_PROFILE_TRIGGER.sql`

1. In Supabase SQL Editor
2. Copy and paste the ENTIRE contents of `FIX_PROFILE_TRIGGER.sql`
3. Click "Run"
4. Wait for success message

**This updates:**

- `handle_new_user()` trigger to use UPSERT
- Handles account recreation gracefully

### Step 4: Verify Setup

Run this query in Supabase SQL Editor to verify:

```sql
-- Check if columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name IN ('user_type', 'is_verified', 'age_confirmed', 'email_domain');

-- Should return 4 rows
```

Expected output:

```
user_type      | text
is_verified    | boolean
age_confirmed  | boolean
email_domain   | text
```

### Step 5: Test Signup

Now you can test the signup flow:

1. Visit `/auth`
2. Click "Sign Up"
3. Select "College Student"
4. Type "wake" in school field
5. Select "Wake Forest University" from dropdown
6. Enter email: youremail@wfu.edu
7. Enter password
8. Submit

Should work without errors! ✅

## 🐛 Troubleshooting

### Error: "unexpected_failure" during signup

**Cause**: Database columns don't exist yet

**Solution**: Run `USER_TYPES_MIGRATION.sql` first!

### Error: "column does not exist"

**Cause**: Migration didn't run completely

**Solution**:

1. Check Supabase logs for specific error
2. Run migration again
3. Verify columns exist with query above

### Error: "function handle_new_user() does not exist"

**Cause**: Trigger function wasn't created

**Solution**: Run Step 1 migration again

### Error: "database error saving new user" (after deletion)

**Cause**: Profile trigger not updated

**Solution**: Run `FIX_PROFILE_TRIGGER.sql`

### Error: "user not allowed" (during deletion)

**Cause**: delete_user() function doesn't exist

**Solution**: Run `DELETE_USER_COMPLETE_FIX.sql`

## ✅ Verification Checklist

After running all migrations, verify:

- [ ] `user_type` column exists in profiles table
- [ ] `is_verified` column exists in profiles table
- [ ] `age_confirmed` column exists in profiles table
- [ ] `email_domain` column exists in profiles table
- [ ] `handle_new_user()` function exists
- [ ] `delete_user()` function exists
- [ ] Trigger `on_auth_user_created` exists
- [ ] Can sign up as high school student
- [ ] Can sign up as college student
- [ ] Email validation works
- [ ] Account deletion works
- [ ] Can recreate account with same email

## 📊 Migration Order Summary

```
1. USER_TYPES_MIGRATION.sql
   ↓ Creates columns and trigger

2. DELETE_USER_COMPLETE_FIX.sql
   ↓ Sets up deletion functions

3. FIX_PROFILE_TRIGGER.sql
   ↓ Updates trigger for recreation

4. Test signup
   ↓ Should work now!
```

## 🎯 Common Mistakes

❌ **Testing before running migrations** → Will fail!
❌ **Running migrations out of order** → May cause issues
❌ **Not waiting for migration to complete** → Partial setup
❌ **Skipping verification step** → Unknown state

✅ **Run all 3 migrations in order** → Success!
✅ **Verify columns exist** → Confirmed working
✅ **Then test signup** → Everything works

## 📞 Still Having Issues?

If you've run all migrations and still get errors:

1. **Check Supabase Logs**:
   - Dashboard → Logs → Filter by "error"
   - Look for specific error messages

2. **Verify Trigger Function**:

   ```sql
   SELECT routine_name, routine_definition
   FROM information_schema.routines
   WHERE routine_name = 'handle_new_user';
   ```

3. **Check Trigger Exists**:

   ```sql
   SELECT * FROM pg_trigger
   WHERE tgname = 'on_auth_user_created';
   ```

4. **Test Trigger Manually**:
   ```sql
   -- This should not error
   SELECT handle_new_user();
   ```

## 🎉 Success Indicators

You'll know it's working when:

✅ Signup completes without errors
✅ Profile is created in database
✅ User can sign in
✅ User type is set correctly
✅ Email domain is stored
✅ Verification status is correct

## Summary

**The "unexpected_failure" error means you haven't run the database migrations yet.**

Run the 3 SQL files in order, verify the columns exist, then test signup. Everything will work once the database is properly set up!
