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

export async function createPost(title, content, isAnonymous = false) {
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
    .insert([{ title, content, user_id, is_anonymous: isAnonymous }])
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
      author:profiles!posts_user_id_fkey (id, username, school, user_type, intended_major, interests, hometown),
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
      author:profiles!posts_user_id_fkey (id, username, school, user_type, intended_major, interests, hometown)
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

export async function adminDeletePost(post_id) {
  const supabase = await createClient();

  // Call the admin_delete_post SQL function which bypasses RLS
  const { data, error } = await supabase.rpc("admin_delete_post", {
    post_id_param: post_id,
  });

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
      author:profiles!comments_user_id_fkey (id, username, school, user_type, intended_major, interests, hometown)
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
      author:profiles!posts_user_id_fkey (id, username, school, user_type, intended_major, interests, hometown),
      comments (
        *,
        author:profiles!comments_user_id_fkey (id, username, school, user_type, intended_major, interests, hometown)
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

  // Only return college students in search results
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .or(`username.ilike.%${searchTerm}%,school.ilike.%${searchTerm}%`)
    .eq("user_type", "college")
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
      author:profiles!posts_user_id_fkey (id, username, school),
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

// ==================== VOTING OPERATIONS ====================

export async function voteOnPost(post_id, vote_type) {
  const supabase = await createClient();
  const user_id = await getUserID(supabase);

  if (!user_id) {
    return {
      data: null,
      error: { message: "You must be logged in to vote." },
    };
  }

  // Validate vote_type
  if (vote_type !== 1 && vote_type !== -1) {
    return {
      data: null,
      error: {
        message: "Invalid vote type. Must be 1 (upvote) or -1 (downvote).",
      },
    };
  }

  // Use upsert to insert or update the vote
  const { data, error } = await supabase
    .from("post_votes")
    .upsert({ post_id, user_id, vote_type }, { onConflict: "post_id,user_id" })
    .select()
    .single();

  return { data, error };
}

export async function removeVote(post_id) {
  const supabase = await createClient();
  const user_id = await getUserID(supabase);

  if (!user_id) {
    return {
      data: null,
      error: { message: "You must be logged in to remove a vote." },
    };
  }

  const { data, error } = await supabase
    .from("post_votes")
    .delete()
    .eq("post_id", post_id)
    .eq("user_id", user_id);

  return { data, error };
}

export async function getUserVoteOnPost(post_id) {
  const supabase = await createClient();
  const user_id = await getUserID(supabase);

  if (!user_id) {
    return { data: null, error: null };
  }

  const { data, error } = await supabase
    .from("post_votes")
    .select("vote_type")
    .eq("post_id", post_id)
    .eq("user_id", user_id)
    .maybeSingle();

  return { data, error };
}

export async function getPostVoteStats(post_id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("post_votes")
    .select("vote_type")
    .eq("post_id", post_id);

  if (error) {
    return { data: null, error };
  }

  const upvotes = data.filter((v) => v.vote_type === 1).length;
  const downvotes = data.filter((v) => v.vote_type === -1).length;
  const score = upvotes - downvotes;

  return {
    data: {
      upvotes,
      downvotes,
      score,
      total: data.length,
    },
    error: null,
  };
}

// ==================== COMMENT VOTING OPERATIONS ====================

export async function voteOnComment(comment_id, vote_type) {
  const supabase = await createClient();
  const user_id = await getUserID(supabase);

  if (!user_id) {
    return {
      data: null,
      error: { message: "You must be logged in to vote." },
    };
  }

  // Validate vote_type
  if (vote_type !== 1 && vote_type !== -1) {
    return {
      data: null,
      error: {
        message: "Invalid vote type. Must be 1 (upvote) or -1 (downvote).",
      },
    };
  }

  // Use upsert to insert or update the vote
  const { data, error } = await supabase
    .from("comment_votes")
    .upsert(
      { comment_id, user_id, vote_type },
      { onConflict: "comment_id,user_id" },
    )
    .select()
    .single();

  return { data, error };
}

export async function removeCommentVote(comment_id) {
  const supabase = await createClient();
  const user_id = await getUserID(supabase);

  if (!user_id) {
    return {
      data: null,
      error: { message: "You must be logged in to remove a vote." },
    };
  }

  const { data, error } = await supabase
    .from("comment_votes")
    .delete()
    .eq("comment_id", comment_id)
    .eq("user_id", user_id);

  return { data, error };
}

export async function getUserVoteOnComment(comment_id) {
  const supabase = await createClient();
  const user_id = await getUserID(supabase);

  if (!user_id) {
    return { data: null, error: null };
  }

  const { data, error } = await supabase
    .from("comment_votes")
    .select("vote_type")
    .eq("comment_id", comment_id)
    .eq("user_id", user_id)
    .maybeSingle();

  return { data, error };
}

export async function getCommentVoteStats(comment_id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("comment_votes")
    .select("vote_type")
    .eq("comment_id", comment_id);

  if (error) {
    return { data: null, error };
  }

  const upvotes = data.filter((v) => v.vote_type === 1).length;
  const downvotes = data.filter((v) => v.vote_type === -1).length;
  const score = upvotes - downvotes;

  return {
    data: {
      upvotes,
      downvotes,
      score,
      total: data.length,
    },
    error: null,
  };
}

// ==================== MESSAGING OPERATIONS ====================

export async function sendMessage(recipientId, content, isAnonymous = false) {
  const supabase = await createClient();
  const user_id = await getUserID(supabase);

  if (!user_id) {
    return {
      data: null,
      error: { message: "You must be logged in to send messages." },
    };
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: user_id,
      recipient_id: recipientId,
      content: content,
      is_anonymous: isAnonymous,
    })
    .select(
      `
      *,
      sender:profiles!messages_sender_id_fkey(id, username, user_type, intended_major, interests, hometown),
      recipient:profiles!messages_recipient_id_fkey(id, username, user_type, intended_major, interests, hometown)
    `,
    )
    .single();

  return { data, error };
}

export async function getConversation(otherUserId) {
  const supabase = await createClient();
  const user_id = await getUserID(supabase);

  if (!user_id) {
    return {
      data: null,
      error: { message: "You must be logged in to view messages." },
    };
  }

  const { data, error } = await supabase
    .from("messages")
    .select(
      `
      *,
      sender:profiles!messages_sender_id_fkey(id, username, user_type, intended_major, interests, hometown),
      recipient:profiles!messages_recipient_id_fkey(id, username, user_type, intended_major, interests, hometown)
    `,
    )
    .or(
      `and(sender_id.eq.${user_id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user_id})`,
    )
    .order("created_at", { ascending: true });

  return { data, error };
}

export async function getConversations() {
  const supabase = await createClient();
  const user_id = await getUserID(supabase);

  if (!user_id) {
    return {
      data: null,
      error: { message: "You must be logged in to view conversations." },
    };
  }

  // Get all messages involving the current user
  const { data: messages, error } = await supabase
    .from("messages")
    .select(
      `
      *,
      sender:profiles!messages_sender_id_fkey(id, username, user_type, intended_major, interests, hometown),
      recipient:profiles!messages_recipient_id_fkey(id, username, user_type, intended_major, interests, hometown)
    `,
    )
    .or(`sender_id.eq.${user_id},recipient_id.eq.${user_id}`)
    .order("created_at", { ascending: false });

  if (error) return { data: null, error };

  // Group messages by conversation partner
  const conversationsMap = new Map();

  messages.forEach((message) => {
    const partnerId =
      message.sender_id === user_id ? message.recipient_id : message.sender_id;
    const partner =
      message.sender_id === user_id ? message.recipient : message.sender;

    if (!conversationsMap.has(partnerId)) {
      conversationsMap.set(partnerId, {
        partnerId,
        partner,
        lastMessage: message,
        unreadCount: 0,
      });
    }

    // Count unread messages from partner
    if (message.recipient_id === user_id && !message.read) {
      conversationsMap.get(partnerId).unreadCount++;
    }
  });

  const conversations = Array.from(conversationsMap.values());
  return { data: conversations, error: null };
}

export async function markConversationAsRead(otherUserId) {
  const supabase = await createClient();
  const user_id = await getUserID(supabase);

  if (!user_id) {
    return {
      data: null,
      error: { message: "You must be logged in." },
    };
  }

  const { data, error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("sender_id", otherUserId)
    .eq("recipient_id", user_id)
    .eq("read", false);

  return { data, error };
}

export async function deleteMessage(messageId) {
  const supabase = await createClient();
  const user_id = await getUserID(supabase);

  if (!user_id) {
    return {
      data: null,
      error: { message: "You must be logged in to delete messages." },
    };
  }

  const { data, error } = await supabase
    .from("messages")
    .delete()
    .eq("id", messageId)
    .eq("sender_id", user_id);

  return { data, error };
}
