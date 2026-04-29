# DormTalk - Features Documentation

This document provides comprehensive documentation for the features implemented in DormTalk.

## Table of Contents

1. [Overview](#overview)
2. [Voting System](#voting-system)
3. [Search Features](#search-features)
4. [Moderation Features](#moderation-features)
5. [API Reference](#api-reference)
6. [Usage Examples](#usage-examples)
7. [Security Considerations](#security-considerations)

---

## Overview

Major features available in DormTalk:

1. **Post Voting** - Upvote and downvote posts
2. **Profile Search** - Search for college students by username or school
3. **Post Search** - Search for posts by title or content
4. **Post Moderation** - Flag, hide, and manage inappropriate content

### New Pages

- `/search` - Unified search interface for posts and profiles
- `/moderation` - Moderation dashboard for reviewing flagged posts

### New Components

- `VoteButtons` component for upvoting/downvoting posts
- Updated `PostCard` component with voting and flag functionality
- Updated `Navigation` component with new page links

---

## Voting System

### Post Voting

Users can upvote or downvote posts to show their support or disagreement.

**Features:**

- Upvote posts you like (+1 to score)
- Downvote posts you dislike (-1 to score)
- Change your vote at any time
- Remove your vote by clicking the same button again
- Real-time vote score updates
- Visual feedback for your current vote
- Color-coded scores (green for positive, red for negative)

**How Voting Works:**

1. **Upvote**: Click the up arrow button
   - If you haven't voted: Adds +1 to the score
   - If you already upvoted: Removes your vote
   - If you downvoted: Changes to upvote (+2 to score)

2. **Downvote**: Click the down arrow button
   - If you haven't voted: Adds -1 to the score
   - If you already downvoted: Removes your vote
   - If you upvoted: Changes to downvote (-2 to score)

3. **Vote Score**: The number between the buttons shows the total score
   - Score = (Total Upvotes) - (Total Downvotes)
   - Example: 10 upvotes and 3 downvotes = score of 7

**Visual Indicators:**

- **Green button**: You've upvoted this post
- **Red button**: You've downvoted this post
- **Gray buttons**: You haven't voted on this post
- **Green score**: Positive score (more upvotes)
- **Red score**: Negative score (more downvotes)
- **Gray score**: Neutral (equal votes or no votes)

**Usage:**

1. Navigate to any page with posts (`/posts`, `/my-posts`, `/search`)
2. Find the voting buttons below each post
3. Click the up arrow to upvote or down arrow to downvote
4. Click again to remove your vote

**Best Practices:**

- Upvote posts that are helpful, interesting, or contribute to the community
- Downvote posts that are off-topic, unhelpful, or violate guidelines
- Don't downvote just because you disagree with an opinion
- Use voting to help surface quality content

---

## Search Features

### Profile Search

Search for student profiles by username or school name.

**Features:**

- Case-insensitive search
- Searches both username and school fields
- Returns up to 20 results by default
- Real-time search results

**Usage:**

1. Navigate to `/search`
2. Click "Search Profiles" tab
3. Enter a username or school name
4. Click "Search" or press Enter

**Example Searches:**

- "john" - Finds all users with "john" in their username
- "MIT" - Finds all users from MIT
- "stanford" - Finds all users from Stanford

### Post Search

Search for posts by title or content.

**Features:**

- Case-insensitive search
- Searches both title and content fields
- Returns up to 50 results by default
- Shows comment counts
- Sorted by most recent first

**Usage:**

1. Navigate to `/search`
2. Click "Search Posts" tab (default)
3. Enter keywords to search for
4. Click "Search" or press Enter

**Example Searches:**

- "roommate" - Finds all posts about roommates
- "dining hall" - Finds posts mentioning dining halls
- "study group" - Finds posts about study groups

---

## Moderation Features

### Post Flagging

Users can flag posts that violate community guidelines.

**Features:**

- Any logged-in user can flag posts
- Requires a reason for flagging
- Tracks who flagged the post and when
- Flagged posts appear in moderation dashboard

**How to Flag a Post:**

1. Navigate to `/posts`
2. Find the post you want to flag
3. Click "🚩 Flag Post" button
4. Enter a reason (e.g., "spam", "harassment", "inappropriate")
5. Confirm

**Flag Reasons (Suggested):**

- `inappropriate` - Inappropriate content
- `spam` - Spam or advertising
- `harassment` - Harassment or bullying
- `misinformation` - False information
- `offensive` - Offensive language

### Moderation Dashboard

Centralized dashboard for reviewing and managing flagged posts.

**Features:**

- View all flagged posts
- See flag reason and who flagged it
- Unflag (approve) posts
- Hide posts from public view
- Delete posts permanently
- View full post details

**Moderation Actions:**

1. **Unflag (Approve)**
   - Removes the flag from the post
   - Post remains visible
   - Use when content is acceptable

2. **Hide Post**
   - Hides post from public view
   - Post author can still see it
   - Reversible action
   - Use for temporary removal

3. **Unhide Post**
   - Makes hidden post visible again
   - Available for hidden posts

4. **Delete Post**
   - Permanently removes the post
   - Cannot be undone
   - Use for severe violations

**Access:**

- Navigate to `/moderation`
- View all flagged posts requiring review
- Take appropriate action on each post

---

## API Reference

### CRUD Functions

#### Voting Operations

```javascript
// Vote on a post (upvote or downvote)
voteOnPost(post_id, vote_type);
// vote_type: 1 for upvote, -1 for downvote
// Returns: { data: Vote, error: Error | null }

// Remove your vote from a post
removeVote(post_id);
// Returns: { data: any, error: Error | null }

// Get the current user's vote on a post
getUserVoteOnPost(post_id);
// Returns: { data: { vote_type: 1 | -1 } | null, error: Error | null }

// Get vote statistics for a post
getPostVoteStats(post_id);
// Returns: { data: { upvotes: number, downvotes: number, score: number, total: number }, error: Error | null }
```

#### Search Operations

```javascript
// Search profiles by username or school
searchProfiles(searchTerm, (limit = 20));
// Returns: { data: Profile[], error: Error | null }

// Search posts by title or content
searchPosts(searchTerm, (limit = 50));
// Returns: { data: Post[], error: Error | null }
```

#### Moderation Operations

```javascript
// Flag a post for review
flagPost(post_id, (reason = "inappropriate"));
// Returns: { data: Post, error: Error | null }

// Remove flag from a post
unflagPost(post_id);
// Returns: { data: Post, error: Error | null }

// Get all flagged posts
getFlaggedPosts((limit = 50));
// Returns: { data: Post[], error: Error | null }

// Hide a post from public view
hidePost(post_id);
// Returns: { data: Post, error: Error | null }

// Unhide a previously hidden post
unhidePost(post_id);
// Returns: { data: Post, error: Error | null }

// Get only visible (non-hidden) posts
getVisiblePosts((limit = 50), (offset = 0));
// Returns: { data: Post[], error: Error | null }
```

### Server Actions

#### Voting Actions

```javascript
// Upvote a post (server action)
upvotePostAction(postId);
// Returns: { success: boolean, data?: Vote, message: string }

// Downvote a post (server action)
downvotePostAction(postId);
// Returns: { success: boolean, data?: Vote, message: string }

// Remove your vote from a post (server action)
removeVoteAction(postId);
// Returns: { success: boolean, data?: any, message: string }

// Get current user's vote on a post (server action)
getUserVoteAction(postId);
// Returns: { success: boolean, data?: { vote_type: 1 | -1 } | null }

// Get vote statistics for a post (server action)
getPostVoteStatsAction(postId);
// Returns: { success: boolean, data?: { upvotes: number, downvotes: number, score: number, total: number } }
```

#### Search Actions

```javascript
// Search profiles (server action)
searchProfilesAction(searchTerm, (limit = 20));
// Returns: { success: boolean, data?: Profile[], message?: string }

// Search posts (server action)
searchPostsAction(searchTerm, (limit = 50));
// Returns: { success: boolean, data?: Post[], message?: string }
```

#### Moderation Actions

```javascript
// Flag a post (server action)
flagPostAction(postId, (reason = "inappropriate"));
// Returns: { success: boolean, data?: Post, message: string }

// Unflag a post (server action)
unflagPostAction(postId);
// Returns: { success: boolean, data?: Post, message: string }

// Get flagged posts (server action)
getFlaggedPostsAction((limit = 50));
// Returns: { success: boolean, data?: Post[], message?: string }

// Hide a post (server action)
hidePostAction(postId);
// Returns: { success: boolean, data?: Post, message: string }

// Unhide a post (server action)
unhidePostAction(postId);
// Returns: { success: boolean, data?: Post, message: string }

// Get visible posts (server action)
getVisiblePostsAction((limit = 50), (offset = 0));
// Returns: { success: boolean, data?: Post[], message?: string }
```

### Data Types

```typescript
interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_flagged: boolean;
  flag_reason: string | null;
  flagged_at: string | null;
  flagged_by: string | null;
  is_hidden: boolean;
  author?: Profile;
  flagger?: Profile;
  comments?: Comment[] | { count: number }[];
}

interface Profile {
  id: string;
  username: string;
  school: string;
  created_at: string;
}
```

---

## Usage Examples

### Example 1: Using the VoteButtons Component

```javascript
"use client";

import VoteButtons from "../components/VoteButtons";

export default function MyPostCard({ post }) {
  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p>{post.content}</p>

      {/* Add voting buttons */}
      <VoteButtons postId={post.id} initialScore={0} />
    </div>
  );
}
```

### Example 2: Voting Programmatically

```javascript
"use client";

import { upvotePostAction, downvotePostAction } from "../actions/voteActions";

async function handleUpvote(postId) {
  const result = await upvotePostAction(postId);
  if (result.success) {
    console.log("Post upvoted!", result.message);
  } else {
    console.error("Failed to upvote:", result.message);
  }
}

async function handleDownvote(postId) {
  const result = await downvotePostAction(postId);
  if (result.success) {
    console.log("Post downvoted!", result.message);
  }
}
```

### Example 3: Getting Vote Statistics

```javascript
import { getPostVoteStatsAction } from "../actions/voteActions";

async function displayVoteStats(postId) {
  const result = await getPostVoteStatsAction(postId);
  if (result.success) {
    const { upvotes, downvotes, score, total } = result.data;
    console.log(`Score: ${score} (${upvotes} up, ${downvotes} down)`);
  }
}
```

### Example 4: Implementing Search in a Custom Component

```javascript
"use client";

import { useState } from "react";
import { searchPostsAction } from "../actions/searchActions";

export default function CustomSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const result = await searchPostsAction(query);
    if (result.success) {
      setResults(result.data);
    }
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts..."
      />
      <button onClick={handleSearch}>Search</button>
      {results.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### Example 2: Flagging a Post Programmatically

```javascript
import { flagPostAction } from "../actions/moderationActions";

async function handleFlag(postId) {
  const result = await flagPostAction(postId, "spam");
  if (result.success) {
    console.log("Post flagged successfully");
  } else {
    console.error("Failed to flag post:", result.message);
  }
}
```

### Example 3: Checking if a Post is Flagged

```javascript
// In your component
{
  post.is_flagged && (
    <div className="bg-yellow-100 p-2 rounded">
      ⚠️ This post has been flagged for: {post.flag_reason}
    </div>
  );
}
```

### Example 4: Filtering Out Hidden Posts

```javascript
import { getVisiblePostsAction } from "../actions/moderationActions";

async function loadPosts() {
  // Only get posts that are not hidden
  const result = await getVisiblePostsAction(50, 0);
  if (result.success) {
    setPosts(result.data);
  }
}
```

---

## Security Considerations

### Authentication

- All moderation actions require user authentication
- Flagging requires a logged-in user
- User ID is tracked for accountability

### Authorization

**Current Implementation:**

- Any logged-in user can flag posts
- Any logged-in user can access moderation dashboard
- All moderation actions are available to logged-in users

**Recommended for Production:**

1. **Implement Role-Based Access Control (RBAC)**

   ```sql
   CREATE TABLE moderators (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id),
     role TEXT DEFAULT 'moderator',
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

2. **Restrict Moderation Dashboard**
   - Check if user is a moderator before showing dashboard
   - Return 403 Forbidden for non-moderators

3. **Add Middleware Protection**
   ```javascript
   // middleware.js
   export async function middleware(request) {
     if (request.nextUrl.pathname.startsWith("/moderation")) {
       const user = await getUser();
       const isModerator = await checkIfModerator(user.id);
       if (!isModerator) {
         return NextResponse.redirect("/unauthorized");
       }
     }
   }
   ```

### Data Privacy

- Flagged posts show who flagged them (for accountability)
- Consider anonymizing flagger information for regular users
- Only show flagger details to moderators

### Rate Limiting

Consider implementing rate limiting for:

- Search queries (prevent abuse)
- Flagging actions (prevent spam flagging)
- Moderation actions (prevent accidental bulk actions)

### Input Validation

- Search terms are sanitized by Supabase
- Flag reasons should be validated
- Consider limiting flag reason length

### Audit Logging

Consider adding audit logs for:

- All moderation actions
- Who performed the action
- When it was performed
- What was changed

Example audit log table:

```sql
CREATE TABLE moderation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  moderator_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  post_id UUID REFERENCES posts(id),
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Best Practices

### For Users

1. **Flagging Posts**
   - Only flag posts that genuinely violate guidelines
   - Provide clear, specific reasons
   - Don't abuse the flagging system

2. **Searching**
   - Use specific keywords for better results
   - Try different search terms if no results
   - Search profiles by school to find classmates

### For Moderators

1. **Reviewing Flagged Posts**
   - Review context before taking action
   - Be consistent with moderation decisions
   - Document reasons for actions

2. **Taking Action**
   - Unflag if content is acceptable
   - Hide for temporary removal
   - Delete only for severe violations
   - Communicate with users when appropriate

### For Developers

1. **Extending Features**
   - Add more search filters (date, author, etc.)
   - Implement advanced search with multiple criteria
   - Add search result pagination
   - Implement search history

2. **Improving Moderation**
   - Add automated content filtering
   - Implement appeal system
   - Add moderation notes
   - Create moderation statistics dashboard

---

## Future Enhancements

Potential improvements for these features:

1. **Search Enhancements**
   - Advanced filters (date range, author, school)
   - Search suggestions/autocomplete
   - Search history
   - Saved searches
   - Full-text search with ranking

2. **Moderation Enhancements**
   - Automated content filtering (AI/ML)
   - User reputation system
   - Appeal process for removed content
   - Moderation queue with priority levels
   - Bulk moderation actions
   - Moderation statistics and reports

3. **Notification System**
   - Notify moderators of new flags
   - Notify users when their posts are moderated
   - Email notifications for important actions

4. **Analytics**
   - Search analytics (popular searches)
   - Moderation metrics (flags per day, etc.)
   - User behavior analytics

---

## Support

For questions or issues:

1. Check the DATABASE_MIGRATION.md for setup instructions
2. Review this documentation for usage guidance
3. Check the code comments in the implementation files
4. Test features in a development environment first

## Related Files

### Voting System

- `/src/app/utils/supabase/crud.js` - Voting CRUD functions
- `/src/app/actions/voteActions.js` - Voting server actions
- `/src/app/components/VoteButtons.js` - Vote buttons component
- `/src/app/components/PostCard.js` - Post card with voting UI
- `VOTING_MIGRATION.md` - Voting database setup guide

### Search & Moderation

- `/src/app/utils/supabase/crud.js` - Core CRUD functions
- `/src/app/actions/searchActions.js` - Search server actions
- `/src/app/actions/moderationActions.js` - Moderation server actions
- `/src/app/search/page.js` - Search page UI
- `/src/app/moderation/page.js` - Moderation dashboard UI
- `DATABASE_MIGRATION.md` - Moderation database setup guide
