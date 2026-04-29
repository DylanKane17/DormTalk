# Content Moderation Implementation

## Overview

Content moderation has been implemented across the entire application to prevent inappropriate language from being posted in any user-generated content.

## Features

### Bad Words List

- Located at: `src/assets/bad_words.txt`
- Contains 2,487+ inappropriate words and phrases
- Loaded and cached for performance

### Moderation Utility

- Location: `src/app/utils/moderation.js`
- Provides two main functions:
  - `checkForBadWords(text)` - Checks if text contains any bad words
  - `validateContent(content, fieldName)` - Validates content and returns user-friendly error messages

### Protected Content Areas

#### 1. Posts

- **Title**: Validated for inappropriate content
- **Content**: Validated for inappropriate content
- Actions: `createPostAction`, `updatePostAction`

#### 2. Comments

- **Content**: Validated for inappropriate content
- Actions: `createCommentAction`, `updateCommentAction`

#### 3. Direct Messages

- **Content**: Validated for inappropriate content
- Actions: `sendMessageAction`

#### 4. User Profiles

- **Biography**: Validated for inappropriate content
- **Interests**: Validated for inappropriate content
- **Intended Major**: Validated for inappropriate content
- **Hometown**: Validated for inappropriate content
- Actions: `updateProfileAction`

## How It Works

### Validation Process

1. User submits content (post, comment, message, or profile update)
2. Content is checked against the bad words list
3. If inappropriate content is detected:
   - The action is rejected
   - User receives a clear error message: "[Field] contains inappropriate language. Please remove offensive words and try again."
4. If content is clean:
   - The action proceeds normally

### Technical Implementation

```javascript
// Example usage in an action
const contentValidation = validateContent(content, "Post Content");
if (!contentValidation.valid) {
  return { success: false, message: contentValidation.error };
}
```

### Pattern Matching

- Uses regex to match whole words and word parts
- Case-insensitive matching
- Catches variations like "badword", "bad-word", "bad_word", etc.

## Performance

- Bad words list is loaded once and cached in memory
- Subsequent validations use the cached list
- Minimal performance impact on user actions

## User Experience

- Clear, non-specific error messages (doesn't reveal which word was flagged)
- Prevents submission rather than post-moderation
- Immediate feedback to users

## Maintenance

To update the bad words list:

1. Edit `src/assets/bad_words.txt`
2. Add one word per line
3. Restart the application to reload the cache

## Files Modified

- `src/app/utils/moderation.js` (new)
- `src/app/actions/postActions.js`
- `src/app/actions/commentActions.js`
- `src/app/actions/messageActions.js`
- `src/app/actions/profileActions.js`

## Testing

To test the moderation:

1. Try creating a post with inappropriate language
2. Try commenting with inappropriate language
3. Try sending a message with inappropriate language
4. Try updating your profile bio with inappropriate language

All attempts should be rejected with an appropriate error message.
