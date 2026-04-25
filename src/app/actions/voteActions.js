"use server";

import {
  voteOnPost,
  removeVote,
  getUserVoteOnPost,
  getPostVoteStats,
  voteOnComment,
  removeCommentVote,
  getUserVoteOnComment,
  getCommentVoteStats,
} from "../utils/supabase/crud";
import { revalidatePath } from "next/cache";

export async function upvotePostAction(postId) {
  const { data, error } = await voteOnPost(postId, 1);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/posts");
  revalidatePath(`/posts/${postId}`);
  revalidatePath("/my-posts");
  revalidatePath("/search");
  return { success: true, data, message: "Post upvoted!" };
}

export async function downvotePostAction(postId) {
  const { data, error } = await voteOnPost(postId, -1);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/posts");
  revalidatePath(`/posts/${postId}`);
  revalidatePath("/my-posts");
  revalidatePath("/search");
  return { success: true, data, message: "Post downvoted!" };
}

export async function removeVoteAction(postId) {
  const { data, error } = await removeVote(postId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/posts");
  revalidatePath(`/posts/${postId}`);
  revalidatePath("/my-posts");
  revalidatePath("/search");
  return { success: true, data, message: "Vote removed!" };
}

export async function getUserVoteAction(postId) {
  const { data, error } = await getUserVoteOnPost(postId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

export async function getPostVoteStatsAction(postId) {
  const { data, error } = await getPostVoteStats(postId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

// ==================== COMMENT VOTING ACTIONS ====================

export async function upvoteCommentAction(commentId) {
  const { data, error } = await voteOnComment(commentId, 1);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/posts");
  return { success: true, data, message: "Comment upvoted!" };
}

export async function downvoteCommentAction(commentId) {
  const { data, error } = await voteOnComment(commentId, -1);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/posts");
  return { success: true, data, message: "Comment downvoted!" };
}

export async function removeCommentVoteAction(commentId) {
  const { data, error } = await removeCommentVote(commentId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/posts");
  return { success: true, data, message: "Vote removed!" };
}

export async function getUserCommentVoteAction(commentId) {
  const { data, error } = await getUserVoteOnComment(commentId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

export async function getCommentVoteStatsAction(commentId) {
  const { data, error } = await getCommentVoteStats(commentId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}
