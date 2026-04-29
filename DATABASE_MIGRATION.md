# Database Migration Guide

This guide explains the database schema changes required to support the new search and moderation features in DormTalk.

## Overview

The new features require adding columns to the `posts` table to support:

1. **Post Flagging** - Allow users to flag inappropriate content
2. **Post Hiding** - Allow moderators to hide posts from public view
3. **Search Functionality** - Already supported by existing schema

## Required Database Changes

### Posts Table Modifications

You need to add the following columns to your `posts` table in Supabase:

```sql
-- Add moderation columns to posts table
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS flag_reason TEXT,
ADD COLUMN IF NOT EXISTS flagged_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS flagged_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_is_flagged ON posts(is_flagged);
CREATE INDEX IF NOT EXISTS idx_posts_is_hidden ON posts(is_hidden);
CREATE INDEX IF NOT EXISTS idx_posts_flagged_at ON posts(flagged_at);
```

### Column Descriptions

| Column        | Type        | Description                                       |
| ------------- | ----------- | ------------------------------------------------- |
| `is_flagged`  | BOOLEAN     | Indicates if the post has been flagged for review |
| `flag_reason` | TEXT        | The reason provided when flagging the post        |
| `flagged_at`  | TIMESTAMPTZ | Timestamp when the post was flagged               |
| `flagged_by`  | UUID        | Foreign key to the user who flagged the post      |
| `is_hidden`   | BOOLEAN     | Indicates if the post is hidden from public view  |

## Step-by-Step Migration Instructions

### Option 1: Using Supabase Dashboard (Recommended)

1. **Log in to your Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration Script**
   - Copy the SQL script from the "Posts Table Modifications" section above
   - Paste it into the SQL editor
   - Click "Run" to execute the migration

4. **Verify the Changes**
   - Go to "Table Editor" in the left sidebar
   - Select the `posts` table
   - Verify that the new columns appear in the table schema

### Option 2: Using Supabase CLI

If you're using the Supabase CLI for migrations:

1. **Create a new migration file**

   ```bash
   supabase migration new add_moderation_columns
   ```

2. **Edit the migration file**
   - Open the newly created file in `supabase/migrations/`
   - Add the SQL script from above

3. **Apply the migration**
   ```bash
   supabase db push
   ```

## Row Level Security (RLS) Policies

If you have RLS enabled on your `posts` table, you may want to add policies for the new columns:

```sql
-- Allow users to flag posts (update is_flagged, flag_reason, flagged_at, flagged_by)
CREATE POLICY "Users can flag posts"
ON posts
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Only show non-hidden posts to regular users
-- (You may want to modify your existing SELECT policy)
CREATE POLICY "Users can view non-hidden posts"
ON posts
FOR SELECT
USING (is_hidden = FALSE OR auth.uid() = user_id);

-- Moderators can hide/unhide posts
-- (You'll need to implement a moderator role system for this)
-- Example if you have a moderators table:
CREATE POLICY "Moderators can hide posts"
ON posts
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM moderators
    WHERE moderators.user_id = auth.uid()
  )
);
```

## Search Functionality

The search features use the existing schema and don't require additional columns. They utilize:

- **Profile Search**: Searches `profiles.username` and `profiles.school`
- **Post Search**: Searches `posts.title` and `posts.content`

For better search performance, you can optionally add full-text search indexes:

```sql
-- Add full-text search indexes (optional, for better performance)
CREATE INDEX IF NOT EXISTS idx_posts_title_search
ON posts USING gin(to_tsvector('english', title));

CREATE INDEX IF NOT EXISTS idx_posts_content_search
ON posts USING gin(to_tsvector('english', content));

CREATE INDEX IF NOT EXISTS idx_profiles_username_search
ON profiles USING gin(to_tsvector('english', username));

CREATE INDEX IF NOT EXISTS idx_profiles_school_search
ON profiles USING gin(to_tsvector('english', school));
```

## Rollback Instructions

If you need to rollback these changes:

```sql
-- Remove the moderation columns
ALTER TABLE posts
DROP COLUMN IF EXISTS is_flagged,
DROP COLUMN IF EXISTS flag_reason,
DROP COLUMN IF EXISTS flagged_at,
DROP COLUMN IF EXISTS flagged_by,
DROP COLUMN IF EXISTS is_hidden;

-- Drop the indexes
DROP INDEX IF EXISTS idx_posts_is_flagged;
DROP INDEX IF EXISTS idx_posts_is_hidden;
DROP INDEX IF EXISTS idx_posts_flagged_at;
DROP INDEX IF EXISTS idx_posts_title_search;
DROP INDEX IF EXISTS idx_posts_content_search;
DROP INDEX IF EXISTS idx_profiles_username_search;
DROP INDEX IF EXISTS idx_profiles_school_search;
```

## Testing the Migration

After running the migration, test the new features:

1. **Test Search**
   - Navigate to `/search`
   - Search for posts by title or content
   - Search for profiles by username or school

2. **Test Post Flagging**
   - Navigate to `/posts`
   - Click "🚩 Flag Post" on any post
   - Provide a reason and submit

3. **Test Moderation Dashboard**
   - Navigate to `/moderation`
   - View flagged posts
   - Test unflag, hide, and delete actions

## Troubleshooting

### Issue: Foreign Key Constraint Error

If you get an error about the foreign key constraint for `flagged_by`:

```sql
-- Use this alternative without the foreign key constraint
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS flagged_by UUID;
```

### Issue: Permission Denied

If you get permission errors, ensure your database user has the necessary privileges:

```sql
-- Grant necessary permissions (run as superuser)
GRANT ALL ON posts TO your_database_user;
```

### Issue: RLS Blocking Queries

If Row Level Security is blocking your queries:

1. Temporarily disable RLS for testing:

   ```sql
   ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
   ```

2. Or create appropriate policies as shown in the RLS section above

## Additional Considerations

### Moderator Roles

The current implementation allows any logged-in user to access the moderation dashboard. For production, you should:

1. Create a `moderators` table
2. Add role-based access control
3. Restrict moderation actions to authorized users only

Example moderators table:

```sql
CREATE TABLE moderators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add RLS policies
ALTER TABLE moderators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only moderators can view moderators table"
ON moderators FOR SELECT
USING (auth.uid() = user_id);
```

### Notifications

Consider implementing notifications for:

- Moderators when posts are flagged
- Users when their posts are hidden or removed
- Users when their flagged posts are reviewed

## Support

If you encounter issues during migration:

1. Check the Supabase logs in the dashboard
2. Verify your database connection
3. Ensure you have the necessary permissions
4. Review the RLS policies if queries are being blocked
