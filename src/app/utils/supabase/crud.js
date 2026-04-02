import { createClient } from "./server.js"; // Note: Ensure this path points to your actual Supabase client file

// ==================== AUTH HELPER ====================
async function getUserID(supabase) {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return null; // Safely return null if logged out, preventing the 'id of null' crash
  }
  return data.user.id;
}

// ==================== POST OPERATIONS ====================

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

export async function getPosts(limit = 50, offset = 0) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      author:profiles!posts_user_id_fkey (username, school),
      comments (count)
    `,
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return { data, error };
}

export async function getPostById(post_id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      author:profiles!posts_user_id_fkey (username, school)
    `,
    )
    .eq("id", post_id)
    .single();

  return { data, error };
}

export async function getPostsByUser() {
  const supabase = await createClient();
  const user_id = await getUserID(supabase);

  if (!user_id) {
    return {
      data: [],
      error: { message: "You must be logged in to see your posts." },
    };
  }

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      author:profiles!posts_user_id_fkey (username, school),
      comments (count)
    `,
    )
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  return { data, error };
}

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

export async function deletePost(post_id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", post_id);

  return { data, error };
}

// ==================== COMMENT OPERATIONS ====================

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

export async function getCommentsByPost(post_id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      author:profiles!posts_user_id_fkey (username, school)
    `,
    )
    .eq("post_id", post_id)
    .order("created_at", { ascending: true });

  return { data, error };
}

export async function getCommentById(comment_id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      author:profiles!posts_user_id_fkey (username, school),
      post:post_id (id, title)
    `,
    )
    .eq("id", comment_id)
    .single();

  return { data, error };
}

export async function getCommentsByUser() {
  const supabase = await createClient();
  const user_id = await getUserID(supabase);

  if (!user_id) {
    return {
      data: [],
      error: { message: "You must be logged in to see your comments." },
    };
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

export async function deleteComment(comment_id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .delete()
    .eq("id", comment_id);

  return { data, error };
}

// ==================== COMBINED OPERATIONS ====================

export async function getPostWithComments(post_id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      author:profiles!posts_user_id_fkey (username, school),
      comments (
        *,
        author:profiles!comments_user_id_fkey (username, school)
      )
    `,
    )
    .eq("id", post_id)
    .single();

  return { data, error };
}

export async function getPostsWithComments(limit = 20, offset = 0) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      author:profiles!posts_user_id_fkey (username, school),
      comments (
        *,
        author:profiles!posts_user_id_fkey (username, school)
      )
    `,
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return { data, error };
}

export async function deletePostWithComments(post_id) {
  // Now that you ran the SQL cascade delete constraint,
  // you no longer need to manually delete comments first.
  // Supabase handles the cascade automatically!
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", post_id);

  return { data, error };
}

export async function getCommentCount(post_id) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", post_id);

  return { count, error };
}
