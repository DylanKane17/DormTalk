import { createClient } from "./server.js";

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
      author:profiles!posts_user_id_fkey (id, username, school),
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
      author:profiles!posts_user_id_fkey (id, username, school)
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
      author:profiles!posts_user_id_fkey (id, username, school),
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
      author:profiles!comments_user_id_fkey (id, username, school)
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
      author:profiles!comments_user_id_fkey (id, username, school),
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
      author:profiles!posts_user_id_fkey (id, username, school),
      comments (
        *,
        author:profiles!comments_user_id_fkey (id, username, school)
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

// ==================== SEARCH OPERATIONS ====================

export async function searchProfiles(searchTerm, limit = 20) {
  const supabase = await createClient();

  if (!searchTerm || searchTerm.trim() === "") {
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .or(`username.ilike.%${searchTerm}%,school.ilike.%${searchTerm}%`)
    .limit(limit);

  return { data, error };
}

export async function searchPosts(searchTerm, limit = 50) {
  const supabase = await createClient();

  if (!searchTerm || searchTerm.trim() === "") {
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      author:profiles!posts_user_id_fkey (id, username, school),
      comments (count)
    `,
    )
    .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
    .order("created_at", { ascending: false })
    .limit(limit);

  return { data, error };
}

// ==================== MODERATION OPERATIONS ====================

export async function flagPost(post_id, reason = "inappropriate") {
  const supabase = await createClient();
  const user_id = await getUserID(supabase);

  if (!user_id) {
    return {
      data: null,
      error: { message: "You must be logged in to flag a post." },
    };
  }

  // Update post with flagged status and reason
  const { data, error } = await supabase
    .from("posts")
    .update({
      is_flagged: true,
      flag_reason: reason,
      flagged_at: new Date().toISOString(),
      flagged_by: user_id,
    })
    .eq("id", post_id)
    .select()
    .single();

  return { data, error };
}

export async function unflagPost(post_id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .update({
      is_flagged: false,
      flag_reason: null,
      flagged_at: null,
      flagged_by: null,
    })
    .eq("id", post_id)
    .select()
    .single();

  return { data, error };
}

export async function getFlaggedPosts(limit = 50) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      author:profiles!posts_user_id_fkey (username, school),
      flagger:profiles!posts_flagged_by_fkey (username),
      comments (count)
    `,
    )
    .eq("is_flagged", true)
    .order("flagged_at", { ascending: false })
    .limit(limit);

  return { data, error };
}

export async function hidePost(post_id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .update({ is_hidden: true })
    .eq("id", post_id)
    .select()
    .single();

  return { data, error };
}

export async function unhidePost(post_id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .update({ is_hidden: false })
    .eq("id", post_id)
    .select()
    .single();

  return { data, error };
}

export async function getVisiblePosts(limit = 50, offset = 0) {
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
    .eq("is_hidden", false)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return { data, error };
}

// ==================== PROFILE OPERATIONS ====================

export async function getProfileById(user_id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user_id)
    .single();

  return { data, error };
}

export async function getCurrentUserProfile() {
  const supabase = await createClient();
  const user_id = await getUserID(supabase);

  if (!user_id) {
    return {
      data: null,
      error: { message: "You must be logged in to view your profile." },
    };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user_id)
    .single();

  return { data, error };
}

export async function updateProfile(updates) {
  const supabase = await createClient();
  const user_id = await getUserID(supabase);

  if (!user_id) {
    return {
      data: null,
      error: { message: "You must be logged in to update your profile." },
    };
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user_id)
    .select()
    .single();

  return { data, error };
}

export async function getProfileWithStats(user_id) {
  const supabase = await createClient();

  // Get profile data
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user_id)
    .single();

  if (profileError) {
    return { data: null, error: profileError };
  }

  // Get post count
  const { count: postCount, error: postError } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user_id);

  // Get comment count
  const { count: commentCount, error: commentError } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user_id);

  return {
    data: {
      ...profile,
      post_count: postCount || 0,
      comment_count: commentCount || 0,
    },
    error: null,
  };
}
