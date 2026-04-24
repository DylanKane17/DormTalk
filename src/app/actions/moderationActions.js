"use server";

import {
  flagPost,
  unflagPost,
  getFlaggedPosts,
  hidePost,
  unhidePost,
  getVisiblePosts,
} from "../utils/supabase/crud";
import { revalidatePath } from "next/cache";

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
  const { data, error } = await getFlaggedPosts(limit);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

export async function hidePostAction(postId) {
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
