import { createClient } from "./server.js";

//Get authenticated uuid

async function getUserID(supabase) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }

  if (!user) {
    console.error("No authenticated user found");
    return null;
  }

  return user.id;
}

// ==================== POST OPERATIONS ====================

/**
 * Create a new post
 * @param {string} title - Post title
 * @param {string} content - Post content
 * @returns {Object} { data, error }
 */
export async function createPost(title, content) {
  const supabase = await createClient();
  const user_id = await getUserID(supabase);
  if (!user_id) {
    return {
      data: null,
      error: { message: "You must be logged in to create a post." },
    };
  }
  const { data, error } = await supabase
    .from("posts")
    .insert([{ title, content, user_id }])
    .select()
    .single();

  return { data, error };
}

/**
 * Get all posts with optional pagination
 * @param {number} limit - Number of posts to fetch (default: 50)
 * @param {number} offset - Offset for pagination (default: 0)
 * @returns {Object} { data, error }
 */
export async function getPosts(limit = 50, offset = 0) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      user:profiles!user_id (id, email),
      comments (count)
    `,
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return { data, error };
}

/**
 * Get a single post by ID
 * @param {string} post_id - Post ID
 * @returns {Object} { data, error }
 */
export async function getPostById(post_id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      user:profiles!user_id (id, email)
    `,
    )
    .eq("id", post_id)
    .single();

  return { data, error };
}

/**
 * Get posts by a specific user
 * @returns {Object} { data, error }
 */
export async function getPostsByUser() {
  const supabase = await createClient();
  const user_id = await getUserID(supabase);
  if (!user_id) {
    return { data: [], error: "You must be logged in to see your posts." };
  }
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      comments (count)
    `,
    )
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  return { data, error };
}

/**
 * Update a post
 * @param {string} post_id - Post ID
 * @param {Object} updates - Object containing fields to update (title, content)
 * @returns {Object} { data, error }
 */
export async function updatePost(post_id, updates) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", post_id)
    .select()
    .single();

  return { data, error };
}

/**
 * Delete a post
 * @param {string} post_id - Post ID
 * @returns {Object} { data, error }
 */
export async function deletePost(post_id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", post_id);

  return { data, error };
}

// ==================== COMMENT OPERATIONS ====================

/**
 * Create a new comment on a post
 * @param {string} post_id - Post ID
 * @param {string} content - Comment content
 * @returns {Object} { data, error }
 */
export async function createComment(post_id, content) {
  const supabase = await createClient();
  const user_id = await getUserID(supabase);
  if (!user_id) {
    return {
      data: null,
      error: { message: "You must be logged in to create a comment." },
    };
  }
  const { data, error } = await supabase
    .from("comments")
    .insert([{ post_id, content, user_id }])
    .select()
    .single();

  return { data, error };
}

/**
 * Get all comments for a specific post
 * @param {string} post_id - Post ID
 * @returns {Object} { data, error }
 */
export async function getCommentsByPost(post_id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      user:profiles!user_id (id, email)
    `,
    )
    .eq("post_id", post_id)
    .order("created_at", { ascending: true });

  return { data, error };
}

/**
 * Get a single comment by ID
 * @param {string} comment_id - Comment ID
 * @returns {Object} { data, error }
 */
export async function getCommentById(comment_id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      user:profiles!user_id (id, email),
      post:post_id (id, title)
    `,
    )
    .eq("id", comment_id)
    .single();

  return { data, error };
}

/**
 * Get all comments by a specific user
 * @returns {Object} { data, error }
 */
export async function getCommentsByUser() {
  const supabase = await createClient();
  const user_id = await getUserID(supabase);
  if (!user_id) {
    return { data: [], error: "You must be logged in to see your comments." };
  }
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      post:post_id (id, title)
    `,
    )
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  return { data, error };
}

/**
 * Update a comment
 * @param {string} comment_id - Comment ID
 * @param {string} content - Updated comment content
 * @returns {Object} { data, error }
 */
export async function updateComment(comment_id, content) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .update({ content })
    .eq("id", comment_id)
    .select()
    .single();

  return { data, error };
}

/**
 * Delete a comment
 * @param {string} comment_id - Comment ID
 * @returns {Object} { data, error }
 */
export async function deleteComment(comment_id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .delete()
    .eq("id", comment_id);

  return { data, error };
}

// ==================== COMBINED OPERATIONS ====================

/**
 * Get a post with all its comments
 * @param {string} post_id - Post ID
 * @returns {Object} { data, error }
 */
export async function getPostWithComments(post_id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      user:profiles!user_id (id, email),
      comments (
        *,
        user:user_id (id, email)
      )
    `,
    )
    .eq("id", post_id)
    .single();

  return { data, error };
}

/**
 * Get all posts with their comments (with pagination)
 * @param {number} limit - Number of posts to fetch (default: 20)
 * @param {number} offset - Offset for pagination (default: 0)
 * @returns {Object} { data, error }
 */
export async function getPostsWithComments(limit = 20, offset = 0) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      user:profiles!user_id (id, email),
      comments (
        *,
        user:user_id (id, email)
      )
    `,
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return { data, error };
}

/**
 * Delete a post and all its comments (cascade delete)
 * @param {string} post_id - Post ID
 * @returns {Object} { data, error }
 */
export async function deletePostWithComments(post_id) {
  const supabase = await createClient();

  // First delete all comments
  const { error: commentsError } = await supabase
    .from("comments")
    .delete()
    .eq("post_id", post_id);

  if (commentsError) {
    return { data: null, error: commentsError };
  }

  // Then delete the post
  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", post_id);

  return { data, error };
}

/**
 * Get comment count for a post
 * @param {string} post_id - Post ID
 * @returns {Object} { count, error }
 */
export async function getCommentCount(post_id) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", post_id);

  return { count, error };
}
