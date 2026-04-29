# High School Students Always Anonymous - Implementation Summary

## Overview

High school students are now always anonymous when creating posts and sending messages. The option to toggle anonymity has been removed from the UI, and the backend automatically sets `is_anonymous` to `true` for all high school student content.

## Changes Made

### 1. Frontend UI Changes

#### `/src/app/posts/page.js`

- **Removed**: `isAnonymous` state variable and `setIsAnonymous` setter
- **Removed**: Checkbox UI for toggling anonymous posting
- **Added**: Info message displaying "Your posts will be anonymous to protect your privacy" for high school students
- **Modified**: `handleCreatePost` to pass `userType` instead of `isAnonymous` to the backend

#### `/src/app/messages/[id]/page.js`

- **Removed**: `isAnonymous` state variable and `setIsAnonymous` setter
- **Removed**: Checkbox UI for toggling anonymous messaging
- **Added**: Info message displaying "Your messages will be sent anonymously to protect your privacy" for high school students
- **Modified**: `handleSendMessage` to pass `userType` instead of `isAnonymous` to the backend

#### `/src/app/my-posts/page.js`

- **Added**: `userType` state variable to track user type
- **Added**: Loading of user profile to get user type
- **Added**: Info message for high school students when creating new posts
- **Modified**: `handleCreatePost` to pass `userType` to the backend

### 2. Backend Action Changes

#### `/src/app/actions/postActions.js`

- **Modified**: `createPostAction` function
  - Now receives `userType` from formData instead of `isAnonymous`
  - Automatically sets `isAnonymous = true` when `userType === "high_school"`
  - College students and other user types remain non-anonymous by default

#### `/src/app/actions/messageActions.js`

- **Modified**: `sendMessageAction` function
  - Now receives `userType` from formData instead of `isAnonymous`
  - Automatically sets `isAnonymous = true` when `userType === "high_school"`
  - College students and other user types remain non-anonymous by default

### 3. Database Layer

No changes were required to `/src/app/utils/supabase/crud.js` as the functions already accept the `isAnonymous` parameter, which is now automatically set by the action layer.

## User Experience

### For High School Students:

- **Posts**: When creating a post, they see an info message that their posts will be anonymous. No checkbox is shown.
- **Messages**: When sending a message, they see an info message that their messages will be sent anonymously. No checkbox is shown.
- **Display**: Their username is hidden and replaced with "Anonymous" or "@anonymous" in the UI.

### For College Students:

- **Posts**: No changes - they continue to post with their username visible.
- **Messages**: No changes - they continue to send messages with their username visible.
- **No Anonymous Option**: College students do not have the option to post or message anonymously.

## Technical Implementation

The implementation follows this flow:

1. **Frontend** collects the user's `user_type` from their profile
2. **Frontend** passes `userType` to the backend action via FormData
3. **Backend Action** checks if `userType === "high_school"`
4. **Backend Action** sets `isAnonymous = true` for high school students, `false` otherwise
5. **CRUD Layer** inserts the post/message with the appropriate `is_anonymous` flag
6. **Database** stores the content with the anonymity flag
7. **Display Logic** shows "Anonymous" instead of username when `is_anonymous` is true

## Benefits

1. **Privacy Protection**: High school students are automatically protected without needing to remember to check a box
2. **Simplified UX**: Removes decision fatigue - high school students don't need to decide each time
3. **Consistent Behavior**: All high school student content is consistently anonymous
4. **Clear Communication**: Info messages clearly explain the behavior to users
5. **Maintainable Code**: Centralized logic in the backend actions makes it easy to modify behavior in the future

## Testing Recommendations

1. Test creating posts as a high school student - verify they appear anonymous
2. Test creating posts as a college student - verify username is visible
3. Test sending messages as a high school student - verify they appear anonymous
4. Test sending messages as a college student - verify username is visible
5. Test the "My Posts" page for high school students - verify info message appears
6. Verify existing anonymous posts/messages still display correctly

## Future Considerations

- If college students need anonymous posting in the future, the toggle UI can be re-added specifically for them
- The backend logic is flexible and can be extended to support different anonymity rules per user type
- Consider adding a profile setting to allow high school students to opt-in to non-anonymous posting if needed
