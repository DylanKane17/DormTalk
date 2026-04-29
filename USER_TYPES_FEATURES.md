# User Types Feature Documentation

## Overview

DormTalk now supports two distinct user types with different features and requirements:

1. **High School Students** - More privacy-focused with anonymous posting/messaging
2. **College Students** - Verified with .edu email, no anonymity

---

## User Type Differences

### High School Students

#### Signup Requirements:

- ✅ Anonymous username (required)
- ✅ Email (any email address)
- ✅ Password
- ✅ Age confirmation (must be 16+)
- ❌ School name (NOT required)

#### Features:

- ✅ **Anonymous Posting** - Can post without revealing username
- ✅ **Anonymous Messaging** - Can send messages anonymously
- ✅ All standard features (voting, commenting, etc.)

#### Privacy:

- When posting anonymously, username is hidden from other users
- When messaging anonymously, recipient sees "Anonymous" instead of username
- User can still see their own anonymous posts/messages in "My Posts" and conversations

---

### College Students

#### Signup Requirements:

- ✅ Anonymous username (required)
- ✅ Official .edu email (MUST match selected college)
- ✅ Password
- ✅ College/University selection (required, autocomplete)

#### Features:

- ✅ All standard features (posting, messaging, voting, commenting)
- ❌ **NO anonymous posting**
- ❌ **NO anonymous messaging**
- ✅ Email domain validation ensures authenticity

#### Verification:

- Email must be from official .edu domain
- Domain must match the selected college
- Example: If you select "Harvard University", email must be @harvard.edu

---

## Implementation Details

### Database Schema

#### Posts Table

```sql
- is_anonymous BOOLEAN DEFAULT false
```

#### Messages Table

```sql
- is_anonymous BOOLEAN DEFAULT false
```

#### Profiles Table

```sql
- user_type TEXT CHECK (user_type IN ('high_school', 'college'))
- school TEXT (optional for high_school, required for college)
- email_domain TEXT
```

---

## UI Components

### Signup Form (`src/app/auth/page.js`)

**User Type Selection:**

- Radio buttons to choose between "High School Student" and "College Student"
- Dynamically shows/hides school field based on selection

**High School:**

- No school field shown
- Any email accepted
- Age confirmation checkbox required

**College:**

- School autocomplete field (required)
- Email placeholder shows "@school.edu"
- Warning message about .edu requirement

---

### Post Creation (`src/app/posts/page.js`)

**For High School Students:**

- Checkbox appears: "Post anonymously (hide my username)"
- When checked, post is created with `is_anonymous: true`
- Anonymous posts show "Anonymous" instead of username

**For College Students:**

- No anonymous option available
- All posts show their username

---

### Messaging (`src/app/messages/[id]/page.js`)

**For High School Students:**

- Checkbox appears: "Send anonymously (hide my username)"
- When checked, message is sent with `is_anonymous: true`
- Recipient sees "Anonymous" instead of sender's username
- Sender sees "(sent anonymously)" indicator on their own messages

**For College Students:**

- No anonymous option available
- All messages show sender's username

---

## Code Changes Summary

### Files Modified:

1. **`src/app/auth/page.js`**
   - Removed school field requirement for high school students
   - School field only shows for college students

2. **`src/app/posts/page.js`**
   - Added `isAnonymous` state
   - Added `userType` state
   - Loads user profile to determine user type
   - Shows anonymous checkbox only for high school students
   - Passes `isAnonymous` flag to createPostAction

3. **`src/app/actions/postActions.js`**
   - Updated `createPostAction` to accept `isAnonymous` parameter
   - Passes flag to crud function

4. **`src/app/utils/supabase/crud.js`**
   - Updated `createPost()` to accept `isAnonymous` parameter (default: false)
   - Inserts `is_anonymous` field into database
   - Updated `sendMessage()` to accept `isAnonymous` parameter (default: false)
   - Inserts `is_anonymous` field into messages table

5. **`src/app/actions/messageActions.js`**
   - Updated `sendMessageAction` to accept `isAnonymous` from formData
   - Passes flag to sendMessage function

6. **`src/app/messages/[id]/page.js`**
   - Added `isAnonymous` state
   - Loads current user profile to check user_type
   - Shows anonymous checkbox only for high school students
   - Passes `isAnonymous` flag to sendMessageAction
   - Displays "Anonymous" label on anonymous messages
   - Shows "(sent anonymously)" indicator on user's own anonymous messages

7. **`src/app/components/PostCard.js`**
   - Checks `post.is_anonymous` flag
   - Displays "Anonymous" instead of username when true
   - Maintains link functionality for non-anonymous posts

---

## Testing Checklist

### High School Student Testing:

- [ ] Sign up without entering school name
- [ ] Create a regular post (shows username)
- [ ] Create an anonymous post (shows "Anonymous")
- [ ] Send a regular message (shows username)
- [ ] Send an anonymous message (shows "Anonymous" to recipient)
- [ ] Verify own anonymous posts/messages are visible in "My Posts"
- [ ] Verify anonymous toggle only appears for high school accounts

### College Student Testing:

- [ ] Sign up requires school selection
- [ ] Email validation works (.edu required)
- [ ] Email domain must match selected school
- [ ] Create post (no anonymous option available)
- [ ] Send message (no anonymous option available)
- [ ] Verify all posts/messages show username

### Cross-User Type Testing:

- [ ] High school student can message college student anonymously
- [ ] College student sees "Anonymous" from high school sender
- [ ] College student cannot reply anonymously
- [ ] Anonymous posts appear in feed correctly
- [ ] Voting works on anonymous posts
- [ ] Comments work on anonymous posts

---

## Privacy Considerations

### What is Hidden:

- Username (replaced with "Anonymous")
- Profile link (not clickable for anonymous content)

### What is NOT Hidden:

- Post/message content
- Timestamp
- School affiliation (if provided)
- Vote counts
- Comment counts

### Important Notes:

- Anonymous posts are still tied to user_id in database (for moderation)
- Moderators can see actual user behind anonymous posts
- Users can see their own anonymous content in "My Posts"
- Anonymity is display-only, not database-level

---

## Future Enhancements

Potential features to consider:

1. **Anonymous Comments** - Allow high school students to comment anonymously
2. **Anonymity Toggle in Profile** - Default preference for anonymous posting
3. **Anonymous Reporting** - Report content without revealing identity
4. **School-Wide Anonymous Mode** - Option for entire school to enable/disable
5. **Temporary Anonymity** - Time-limited anonymous posting
6. **Anonymous Polls** - Create polls without revealing creator

---

## Support & Troubleshooting

### Common Issues:

**Issue:** Anonymous checkbox not appearing

- **Solution:** Check that user_type is "high_school" in profiles table

**Issue:** College student can't sign up

- **Solution:** Verify email ends with .edu and matches selected school domain

**Issue:** Anonymous posts showing username

- **Solution:** Check that `is_anonymous` field exists in posts table and is set to true

**Issue:** School field required for high school

- **Solution:** Verify auth page only shows school field when userType === "college"

---

## Database Migration

If you need to add the `is_anonymous` field to existing tables:

```sql
-- Add to posts table
ALTER TABLE posts
ADD COLUMN is_anonymous BOOLEAN DEFAULT false;

-- Add to messages table
ALTER TABLE messages
ADD COLUMN is_anonymous BOOLEAN DEFAULT false;

-- Verify
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name IN ('posts', 'messages')
AND column_name = 'is_anonymous';
```

---

## Summary

This feature provides appropriate privacy controls for different user demographics:

- **High school students** get anonymity options for safer self-expression
- **College students** maintain accountability through verified .edu emails
- Both user types can interact seamlessly on the platform
- Implementation is clean, maintainable, and extensible

The system respects the different needs of each user group while maintaining platform integrity and moderation capabilities.
