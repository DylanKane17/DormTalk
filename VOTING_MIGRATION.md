# Voting System Migration Guide

This guide explains the database schema changes required to support upvoting and downvoting posts in DormTalk.

## Overview

The voting system allows users to:

- Upvote posts they like
- Downvote posts they dislike
- Change their vote (from upvote to downvote or vice versa)
- Remove their vote
- View vote counts on posts

## Required Database Changes

### Create Post Votes Table

```sql
-- Create post_votes table
CREATE TABLE IF NOT EXISTS post_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_post_votes_post_id ON post_votes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_votes_user_id ON post_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_votes_post_user ON post_votes(post_id, user_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_post_votes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_post_votes_updated_at_trigger
BEFORE UPDATE ON post_votes
FOR EACH ROW
EXECUTE FUNCTION update_post_votes_updated_at();
```

### Create Comment Votes Table

```sql
-- Create comment_votes table
CREATE TABLE IF NOT EXISTS comment_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_comment_votes_comment_id ON comment_votes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_votes_user_id ON comment_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_votes_comment_user ON comment_votes(comment_id, user_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_comment_votes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_comment_votes_updated_at_trigger
BEFORE UPDATE ON comment_votes
FOR EACH ROW
EXECUTE FUNCTION update_comment_votes_updated_at();
```

### Table Schema

| Column       | Type        | Description                           |
| ------------ | ----------- | ------------------------------------- |
| `id`         | UUID        | Primary key                           |
| `post_id`    | UUID        | Foreign key to posts table            |
| `user_id`    | UUID        | Foreign key to auth.users (who voted) |
| `vote_type`  | INTEGER     | 1 for upvote, -1 for downvote         |
| `created_at` | TIMESTAMPTZ | When the vote was first created       |
| `updated_at` | TIMESTAMPTZ | When the vote was last modified       |

**Note**: The `UNIQUE(post_id, user_id)` constraint ensures each user can only have one vote per post.

## Row Level Security (RLS) Policies

### Post Votes RLS Policies

Enable RLS and create policies for the post_votes table:

```sql
-- Enable RLS for post_votes
ALTER TABLE post_votes ENABLE ROW LEVEL SECURITY;

-- Allow users to view all votes (for counting)
CREATE POLICY "Anyone can view post votes"
ON post_votes
FOR SELECT
USING (true);

-- Allow authenticated users to insert their own votes
CREATE POLICY "Users can insert their own post votes"
ON post_votes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own votes
CREATE POLICY "Users can update their own post votes"
ON post_votes
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own votes
CREATE POLICY "Users can delete their own post votes"
ON post_votes
FOR DELETE
USING (auth.uid() = user_id);
```

### Comment Votes RLS Policies

Enable RLS and create policies for the comment_votes table:

```sql
-- Enable RLS for comment_votes
ALTER TABLE comment_votes ENABLE ROW LEVEL SECURITY;

-- Allow users to view all votes (for counting)
CREATE POLICY "Anyone can view comment votes"
ON comment_votes
FOR SELECT
USING (true);

-- Allow authenticated users to insert their own votes
CREATE POLICY "Users can insert their own comment votes"
ON comment_votes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own votes
CREATE POLICY "Users can update their own comment votes"
ON comment_votes
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own votes
CREATE POLICY "Users can delete their own comment votes"
ON comment_votes
FOR DELETE
USING (auth.uid() = user_id);
```

## Step-by-Step Migration Instructions

### Option 1: Using Supabase Dashboard (Recommended)

1. **Log in to your Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration Script**
   - Copy the SQL script from the "Create Post Votes Table" section above
   - Paste it into the SQL editor
   - Click "Run" to execute the migration

4. **Run the RLS Policies Script**
   - Copy the SQL script from the "Row Level Security (RLS) Policies" section
   - Paste it into a new query
   - Click "Run" to execute

5. **Verify the Changes**
   - Go to "Table Editor" in the left sidebar
   - Verify that the `post_votes` table appears
   - Check that the indexes and policies are created

### Option 2: Using Supabase CLI

If you're using the Supabase CLI for migrations:

1. **Create a new migration file**

   ```bash
   supabase migration new add_post_voting
   ```

2. **Edit the migration file**
   - Open the newly created file in `supabase/migrations/`
   - Add both SQL scripts from above

3. **Apply the migration**
   ```bash
   supabase db push
   ```

## How the Voting System Works

### Vote Types

- **Upvote**: `vote_type = 1`
- **Downvote**: `vote_type = -1`

### Vote Calculation

The total score for a post is calculated by summing all vote_type values:

- If a post has 5 upvotes and 2 downvotes: score = 5(1) + 2(-1) = 3

### User Actions

1. **First Vote**: Insert a new row with vote_type = 1 or -1
2. **Change Vote**: Update the existing row's vote_type
3. **Remove Vote**: Delete the row

### Unique Constraint

The `UNIQUE(post_id, user_id)` constraint ensures:

- Each user can only have one vote per post
- Attempting to insert a duplicate will fail
- Use UPSERT (INSERT ... ON CONFLICT) to handle vote changes

## Testing the Migration

After running the migration, test the voting system:

1. **Test Upvoting**
   - Navigate to `/posts`
   - Click the upvote button on a post
   - Verify the vote count increases

2. **Test Downvoting**
   - Click the downvote button on a post
   - Verify the vote count decreases

3. **Test Vote Changes**
   - Upvote a post, then downvote it
   - Verify the vote changes correctly

4. **Test Vote Removal**
   - Click the same vote button again
   - Verify the vote is removed

## Rollback Instructions

If you need to rollback these changes:

```sql
-- Drop the trigger
DROP TRIGGER IF EXISTS update_post_votes_updated_at_trigger ON post_votes;

-- Drop the function
DROP FUNCTION IF EXISTS update_post_votes_updated_at();

-- Drop the table (this will also drop indexes and policies)
DROP TABLE IF EXISTS post_votes;
```

## Performance Considerations

### Indexes

The migration creates three indexes:

- `idx_post_votes_post_id`: Fast lookups of all votes for a post
- `idx_post_votes_user_id`: Fast lookups of all votes by a user
- `idx_post_votes_post_user`: Fast lookups of a specific user's vote on a post

### Aggregation

When displaying posts, vote counts are aggregated using:

```sql
SELECT
  posts.*,
  COALESCE(SUM(post_votes.vote_type), 0) as vote_score,
  COUNT(post_votes.id) as vote_count
FROM posts
LEFT JOIN post_votes ON posts.id = post_votes.post_id
GROUP BY posts.id
```

## Additional Features (Optional)

### Vote History

To track vote history, you could create a separate audit table:

```sql
CREATE TABLE post_votes_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL,
  user_id UUID NOT NULL,
  vote_type INTEGER NOT NULL,
  action VARCHAR(10) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Prevent Vote Manipulation

Add rate limiting or cooldown periods:

```sql
-- Add a function to check if user voted recently
CREATE OR REPLACE FUNCTION check_vote_cooldown()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM post_votes
    WHERE user_id = NEW.user_id
    AND updated_at > NOW() - INTERVAL '1 second'
  ) THEN
    RAISE EXCEPTION 'Please wait before voting again';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Troubleshooting

### Issue: Foreign Key Constraint Error

If you get an error about foreign key constraints:

- Ensure the `posts` table exists
- Verify that `auth.users` is accessible
- Check that UUID extension is enabled: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

### Issue: Unique Constraint Violation

If you get unique constraint violations:

- Use UPSERT pattern: `INSERT ... ON CONFLICT (post_id, user_id) DO UPDATE ...`
- This is handled in the application code

### Issue: RLS Blocking Queries

If Row Level Security is blocking queries:

- Verify policies are created correctly
- Check that `auth.uid()` returns the correct user ID
- Test with RLS temporarily disabled for debugging

## Support

If you encounter issues during migration:

1. Check the Supabase logs in the dashboard
2. Verify your database connection
3. Ensure you have the necessary permissions
4. Review the RLS policies if queries are being blocked
