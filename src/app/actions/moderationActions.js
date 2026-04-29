"use server";

import {
  flagPost,
  unflagPost,
  getFlaggedPosts,
  getFlaggedComments,
  hidePost,
  unhidePost,
  getVisiblePosts,
} from "../utils/supabase/crud";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "../utils/adminCheck";

export async function flagPostAction(postId, reason = "inappropriate") {
  const { data, error } = await flagPost(postId, reason);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/posts");
  revalidatePath("/moderation");
  revalidatePath(`/posts/${postId}`);
  return { success: true, data, message: "Post flagged successfully!" };
}

export async function unflagPostAction(postId) {
  // Require admin access
  try {
    await requireAdmin();
  } catch (error) {
    return { success: false, message: error.message };
  }

  const { data, error } = await unflagPost(postId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/posts");
  revalidatePath("/moderation");
  revalidatePath(`/posts/${postId}`);
  return { success: true, data, message: "Post unflagged successfully!" };
}

export async function getFlaggedPostsAction(limit = 50) {
  // Require admin access
  try {
    await requireAdmin();
  } catch (error) {
    return { success: false, message: error.message };
  }

  const { data, error } = await getFlaggedPosts(limit);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

export async function hidePostAction(postId) {
  // Require admin access
  try {
    await requireAdmin();
  } catch (error) {
    return { success: false, message: error.message };
  }

  const { data, error } = await hidePost(postId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/posts");
  revalidatePath("/moderation");
  revalidatePath(`/posts/${postId}`);
  return { success: true, data, message: "Post hidden successfully!" };
}

export async function unhidePostAction(postId) {
  // Require admin access
  try {
    await requireAdmin();
  } catch (error) {
    return { success: false, message: error.message };
  }

  const { data, error } = await unhidePost(postId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/posts");
  revalidatePath("/moderation");
  revalidatePath(`/posts/${postId}`);
  return { success: true, data, message: "Post unhidden successfully!" };
}

export async function getVisiblePostsAction(limit = 50, offset = 0) {
  const { data, error } = await getVisiblePosts(limit, offset);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

export async function getFlaggedCommentsAction(limit = 50) {
  // Require admin access
  try {
    await requireAdmin();
  } catch (error) {
    return { success: false, message: error.message };
  }

  const { data, error } = await getFlaggedComments(limit);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

export async function unflagCommentAction(commentId) {
  // Require admin access
  try {
    await requireAdmin();
  } catch (error) {
    return { success: false, message: error.message };
  }

  const { unflagComment } = await import("../utils/supabase/crud");
  const { data, error } = await unflagComment(commentId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/moderation");
  return { success: true, data, message: "Comment unflagged successfully!" };
}

export async function adminDeleteCommentAction(commentId) {
  // Require admin access
  try {
    await requireAdmin();
  } catch (error) {
    return { success: false, message: error.message };
  }

  const { deleteComment } = await import("../utils/supabase/crud");
  const { data, error } = await deleteComment(commentId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/moderation");
  revalidatePath("/posts");
  return { success: true, data, message: "Comment deleted successfully!" };
}
