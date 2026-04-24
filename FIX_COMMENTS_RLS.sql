-- Fix Comments RLS Policy Issue
-- This script will fix the "new row violates row-level security policy" error

-- First, let's check if RLS is enabled on comments table
-- If you get errors, RLS might already be enabled

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
