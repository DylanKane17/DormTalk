# Direct Messaging Database Migration

This guide will help you set up the direct messaging system for DormTalk.

## Step 1: Create Messages Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_conversation ON messages(sender_id, recipient_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_messages_updated_at();
```

## Step 2: Set Up Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view messages they sent or received
CREATE POLICY "Users can view their own messages"
  ON messages
  FOR SELECT
  USING (
    auth.uid() = sender_id OR auth.uid() = recipient_id
  );

-- Policy: Users can send messages
CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Policy: Users can update messages they received (mark as read)
CREATE POLICY "Users can update received messages"
  ON messages
  FOR UPDATE
  USING (auth.uid() = recipient_id);

-- Policy: Users can delete messages they sent
CREATE POLICY "Users can delete sent messages"
  ON messages
  FOR DELETE
  USING (auth.uid() = sender_id);
```

## Step 3: Verify Setup

Run this query to verify the table was created:

```sql
SELECT * FROM messages LIMIT 1;
```

## Features Enabled

✅ Direct messaging between users
✅ Message read status tracking
✅ Conversation history
✅ Real-time message updates
✅ Secure RLS policies
✅ Automatic timestamps

## Notes

- Messages are automatically deleted when a user deletes their account (CASCADE)
- Only sender and recipient can view messages
- Recipients can mark messages as read
- Senders can delete their sent messages
