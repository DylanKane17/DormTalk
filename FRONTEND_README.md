# DormTalk Frontend Documentation

## Overview

A comprehensive multipage React frontend built with Next.js that provides full interaction with all authentication and CRUD functions from `auth.js` and `crud.js`.

## Features

### Authentication Pages

- **Sign Up**: Create new user accounts
- **Sign In**: Log in with existing credentials
- **Reset Password**: Send password reset emails
- **Update Password**: Change password for logged-in users

### Post Management

- **View All Posts**: Browse all posts from the community with comment counts
- **Create Posts**: Create new posts with title and content
- **View Post Details**: See individual posts with all comments
- **Edit Posts**: Update your own posts
- **Delete Posts**: Remove your own posts
- **My Posts**: Manage all your posts in one place

### Comment Management

- **Add Comments**: Comment on any post
- **View Comments**: See all comments on posts with user information
- **Edit Comments**: Update your own comments
- **Delete Comments**: Remove your own comments
- **My Comments**: View and manage all your comments

## Pages Structure

```
/                    - Home page with welcome and navigation
/auth                - Authentication page (sign up, sign in, reset, update password)
/posts               - All posts listing
/posts/[id]          - Individual post detail with comments
/my-posts            - User's own posts with edit/delete actions
/my-comments         - User's own comments with edit/delete actions
```

## Reusable Components

### UI Components

- **Button**: Styled button with variants (primary, secondary, danger, success)
- **Input**: Text input with label and error handling
- **Textarea**: Multi-line text input with label
- **Card**: Container component for content sections
- **Alert**: Notification component for success/error messages
- **Modal**: Popup dialog for forms and actions

### Feature Components

- **Navigation**: Top navigation bar with route highlighting
- **PostCard**: Display post information with optional actions
- **CommentCard**: Display comment information with optional actions

## Server Actions

### Auth Actions (`/actions/authActions.js`)

- `signUpAction`: Handle user registration
- `signInAction`: Handle user login
- `resetPasswordAction`: Send password reset email
- `updatePasswordAction`: Update user password

### Post Actions (`/actions/postActions.js`)

- `createPostAction`: Create new post
- `getPostsAction`: Fetch all posts with pagination
- `getPostByIdAction`: Fetch single post
- `getPostsByUserAction`: Fetch user's posts
- `updatePostAction`: Update post
- `deletePostAction`: Delete post
- `getPostWithCommentsAction`: Fetch post with all comments
- `getPostsWithCommentsAction`: Fetch posts with comments
- `deletePostWithCommentsAction`: Delete post and all comments

### Comment Actions (`/actions/commentActions.js`)

- `createCommentAction`: Create new comment
- `getCommentsByPostAction`: Fetch comments for a post
- `getCommentByIdAction`: Fetch single comment
- `getCommentsByUserAction`: Fetch user's comments
- `updateCommentAction`: Update comment
- `deleteCommentAction`: Delete comment
- `getCommentCountAction`: Get comment count for a post

## CRUD Functions Coverage

### Auth Functions (from `auth.js`)

✅ `signUp` - Implemented in /auth page
✅ `signIn` - Implemented in /auth page
✅ `resetPass` - Implemented in /auth page
✅ `updatePass` - Implemented in /auth page

### Post Functions (from `crud.js`)

✅ `createPost` - Implemented in /posts and /my-posts
✅ `getPosts` - Implemented in /posts
✅ `getPostById` - Implemented in /posts/[id]
✅ `getPostsByUser` - Implemented in /my-posts
✅ `updatePost` - Implemented in /my-posts
✅ `deletePost` - Implemented in /posts and /my-posts
✅ `getPostWithComments` - Implemented in /posts/[id]
✅ `getPostsWithComments` - Available via actions
✅ `deletePostWithComments` - Available via actions

### Comment Functions (from `crud.js`)

✅ `createComment` - Implemented in /posts/[id]
✅ `getCommentsByPost` - Implemented in /posts/[id]
✅ `getCommentById` - Available via actions
✅ `getCommentsByUser` - Implemented in /my-comments
✅ `updateComment` - Implemented in /my-comments
✅ `deleteComment` - Implemented in /my-comments
✅ `getCommentCount` - Available via actions

## Usage

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Navigate to the application**:
   - Open http://localhost:3000 in your browser

3. **Authentication**:
   - Go to /auth to sign up or sign in
   - Use the mode buttons to switch between authentication functions

4. **Create and manage posts**:
   - Browse posts at /posts
   - Create posts from /posts or /my-posts
   - Manage your posts at /my-posts

5. **Comment on posts**:
   - Click on any post to view details and add comments
   - Manage your comments at /my-comments

## Component Reusability

The application maximizes component reuse:

- **Button** component used across all forms and actions
- **Input** and **Textarea** used in all forms
- **Card** component wraps all content sections
- **Alert** component provides consistent feedback
- **Modal** component used for all create/edit forms
- **PostCard** and **CommentCard** display content consistently
- **Navigation** provides consistent routing across all pages

## Styling

- Built with Tailwind CSS for responsive design
- Consistent color scheme and spacing
- Hover effects and transitions for better UX
- Mobile-responsive layout

## Error Handling

- All actions return success/error responses
- Alert components display user-friendly messages
- Form validation with required fields
- Confirmation dialogs for destructive actions
