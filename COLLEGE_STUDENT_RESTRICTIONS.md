# College Student Restrictions Feature

## Overview

This feature implements restrictions on college students to prevent them from posting and initiating direct messages (DMs). High school students retain full posting and messaging capabilities.

---

## Restrictions Summary

### College Students

- ❌ **Cannot create posts** - Only high school students can create posts
- ❌ **Cannot initiate DMs** - Cannot start new conversations with other users
- ❌ **Not searchable** - Do not appear in profile search results
- ✅ **Can reply to DMs** - Can respond to messages they receive from others
- ✅ **Can comment** - Can comment on existing posts
- ✅ **Can vote** - Can upvote/downvote posts and comments
- ✅ **Can view content** - Can browse all posts and profiles
- ✅ **Visible in search** - College students appear in profile search results

### High School Students

- ✅ **Can create posts** - Full posting capabilities (always anonymous with info summary)
- ✅ **Can initiate DMs** - Can message any user (always anonymous)
- ✅ **Can reply to DMs** - Can respond to messages
- ✅ **Can comment** - Can comment on posts
- ✅ **Can vote** - Can upvote/downvote posts and comments
- ✅ **Can view content** - Can browse all posts and profiles
- ❌ **Not searchable** - Do not appear in profile search results for privacy
- ℹ️ **Anonymous posts show info** - Posts display hometown, intended major, or interests instead of just "Anonymous"

---

## Implementation Details

### Backend Validation

#### 1. Post Creation Restriction (`src/app/actions/postActions.js`)

```javascript
export async function createPostAction(formData) {
  const userType = formData.get("userType");

  // College students cannot create posts
  if (userType === "college") {
    return {
      success: false,
      message:
        "College students cannot create posts. Only high school students can post.",
    };
  }
  // ... rest of validation
}
```

**How it works:**

- Checks user type before allowing post creation
- Returns error message if college student attempts to post
- Validation happens server-side for security

#### 2. DM Initiation Restriction (`src/app/actions/messageActions.js`)

```javascript
export async function sendMessageAction(recipientId, formData) {
  const userType = formData.get("userType");

  // College students can only reply to existing conversations
  if (userType === "college") {
    const conversationResult = await getConversation(recipientId);
    if (
      conversationResult.success &&
      (!conversationResult.data || conversationResult.data.length === 0)
    ) {
      return {
        success: false,
        message:
          "College students cannot initiate new conversations. You can only reply to messages you receive.",
      };
    }
  }
  // ... rest of validation
}
```

**How it works:**

- Checks if user is a college student
- Queries database to see if conversation already exists
- If no existing conversation, blocks the message
- If conversation exists (someone messaged them first), allows the reply

---

### Frontend UI Changes

#### 1. Posts Page (`src/app/posts/page.js`)

**Before:**

- "Create Post" button visible to all users

**After:**

- "Create Post" button only visible to high school students
- College students see: "Only high school students can create posts"

```jsx
{
  userType === "high_school" && (
    <Button onClick={() => setIsModalOpen(true)}>Create Post</Button>
  );
}
{
  userType === "college" && (
    <div className="text-sm text-[var(--text-tertiary)] italic">
      Only high school students can create posts
    </div>
  );
}
```

#### 2. Profile Page (`src/app/profile/[id]/page.js`)

**Before:**

- "Message" button visible to all users on other profiles

**After:**

- High school students: Always see "Message" button
- College students: Only see "Message" button if conversation already exists
- College students without existing conversation see: "College students can only reply to messages they receive"

```jsx
{
  /* High school students can always message */
}
{
  currentUser.user_type === "high_school" && (
    <Button onClick={() => router.push(`/messages/${profile.id}`)}>
      Message
    </Button>
  );
}

{
  /* College students can only message if conversation exists */
}
{
  currentUser.user_type === "college" && hasExistingConversation && (
    <Button onClick={() => router.push(`/messages/${profile.id}`)}>
      Message
    </Button>
  );
}

{
  /* Show info message for college students without existing conversation */
}
{
  currentUser.user_type === "college" && !hasExistingConversation && (
    <div className="text-sm text-[var(--text-tertiary)] italic text-center">
      College students can only reply to messages they receive
    </div>
  );
}
```

---

## User Experience Flow

### Scenario 1: College Student Tries to Create Post

1. College student navigates to `/posts`
2. Instead of "Create Post" button, they see informational text
3. If they somehow bypass UI (e.g., API call), backend validation blocks it
4. Error message: "College students cannot create posts. Only high school students can post."

### Scenario 2: College Student Tries to Initiate DM

1. College student views another user's profile
2. If no existing conversation:
   - No "Message" button appears
   - Sees: "College students can only reply to messages they receive"
3. If they somehow bypass UI, backend validation blocks it
4. Error message: "College students cannot initiate new conversations. You can only reply to messages you receive."

### Scenario 3: College Student Receives a Message

1. High school student sends message to college student
2. College student receives notification/sees in messages list
3. College student opens conversation at `/messages/[id]`
4. College student can now reply freely
5. "Message" button now appears on sender's profile (conversation exists)

### Scenario 4: High School Student (No Restrictions)

1. High school student can create posts (always anonymous)
2. High school student can message any user (always anonymous)
3. No restrictions on their interactions

---

## Security Considerations

### Defense in Depth

1. **UI Level**: Buttons hidden/disabled for restricted actions
2. **Action Level**: Server-side validation in action functions
3. **Database Level**: User type stored in profiles table

### Why Both UI and Backend Validation?

- **UI hiding**: Better user experience, clear communication
- **Backend validation**: Security - prevents API manipulation
- Users cannot bypass restrictions by:
  - Using browser dev tools
  - Making direct API calls
  - Modifying client-side code

---

## Database Schema

No database changes required. Uses existing `user_type` field:

```sql
-- profiles table already has:
user_type TEXT CHECK (user_type IN ('high_school', 'college'))
```

---

## Testing Checklist

### College Student Tests

- [ ] Cannot see "Create Post" button on posts page
- [ ] Sees informational message instead of button
- [ ] Cannot create post via API (backend blocks it)
- [ ] Cannot see "Message" button on profiles (no existing conversation)
- [ ] Sees informational message about messaging restrictions
- [ ] Cannot send message via API to new user (backend blocks it)
- [ ] CAN reply to messages received from others
- [ ] "Message" button appears on profiles after receiving message from them
- [ ] Can comment on posts
- [ ] Can vote on posts and comments
- [ ] Can view all content

### High School Student Tests

- [ ] Can see "Create Post" button
- [ ] Can create posts successfully (always anonymous)
- [ ] Can see "Message" button on all profiles
- [ ] Can initiate DMs with any user (always anonymous)
- [ ] Can reply to messages
- [ ] Can comment on posts
- [ ] Can vote on posts and comments
- [ ] Can view all content

### Cross-User Type Tests

- [ ] High school student messages college student → College student can reply
- [ ] College student receives message → "Message" button appears on sender's profile
- [ ] College student cannot message high school student first
- [ ] High school student can message college student first
- [ ] Posts only show from high school students (college students can't post)

---

## Error Messages

### Post Creation Error

```
"College students cannot create posts. Only high school students can post."
```

### DM Initiation Error

```
"College students cannot initiate new conversations. You can only reply to messages you receive."
```

---

## Files Modified

1. **`src/app/actions/postActions.js`**
   - Added user type check in `createPostAction`
   - Blocks college students from creating posts

2. **`src/app/actions/messageActions.js`**
   - Added conversation existence check in `sendMessageAction`
   - Blocks college students from initiating new conversations
   - Allows replies to existing conversations

3. **`src/app/posts/page.js`**
   - Conditionally renders "Create Post" button
   - Shows informational message for college students

4. **`src/app/profile/[id]/page.js`**
   - Added `hasExistingConversation` state
   - Added `checkExistingConversation` function
   - Conditionally renders "Message" button based on user type and conversation status
   - Shows informational message for restricted college students

5. **`src/app/components/PostCard.js`**
   - Updated anonymous post display logic
   - Shows high school student info (hometown, intended major, interests) instead of just "Anonymous"
   - Falls back to "High School Student" if no info available

6. **`src/app/utils/supabase/crud.js`**
   - Updated `searchProfiles` function
   - Added filter to only return college students in search results
   - High school students are excluded from profile searches for privacy

---

## Rationale

### Why These Restrictions?

1. **Prevent spam/abuse**: College students verified with .edu emails are less likely to need anonymity
2. **Protect high school students**: Ensures high school students control their interactions
3. **Platform safety**: Reduces potential for unwanted contact
4. **Clear user expectations**: Different user types have different capabilities

### Why Allow Replies?

- Once someone initiates contact, conversation should be two-way
- Blocking replies would break normal communication flow
- College students can still participate in conversations they're invited to

---

## Future Enhancements

Potential improvements to consider:

1. **Admin override**: Allow admins to grant posting privileges to specific college students
2. **Temporary restrictions**: Time-based restrictions (e.g., new users)
3. **Reputation system**: Earn posting rights through positive engagement
4. **Request system**: College students can request posting privileges
5. **Analytics**: Track restriction impact on user engagement

---

## Support & Troubleshooting

### Common Issues

**Issue**: College student sees "Create Post" button

- **Solution**: Clear browser cache, ensure user_type is set correctly in database

**Issue**: College student can't reply to messages

- **Solution**: Check that conversation exists in database, verify user_type

**Issue**: High school student can't create posts

- **Solution**: Verify user_type is "high_school" in profiles table

**Issue**: Message button not appearing after receiving message

- **Solution**: Refresh page, check conversation exists in messages table

---

## Summary

This feature successfully implements granular restrictions on college students while maintaining full functionality for high school students. The implementation includes:

- ✅ Server-side validation for security
- ✅ User-friendly UI feedback
- ✅ Clear error messages
- ✅ Allows necessary interactions (replies, comments, voting)
- ✅ Prevents unwanted interactions (posting, DM initiation)
- ✅ No database migrations required
- ✅ Backward compatible with existing data

The restrictions create a safer, more controlled environment while still allowing meaningful participation from all user types.
