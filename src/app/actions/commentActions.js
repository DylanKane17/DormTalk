"use server";

import {
  createComment,
  getCommentsByPost,
  getCommentById,
  getCommentsByUser,
  updateComment,
  deleteComment,
  getCommentCount,
} from "../utils/supabase/crud";
import { revalidatePath } from "next/cache";
import { validateContent } from "../utils/moderation";

export async function createCommentAction(postId, formData) {
  const content = formData.get("content");

  // Validate content for inappropriate content
  const contentValidation = validateContent(content, "Comment");
  if (!contentValidation.valid) {
    return { success: false, message: contentValidation.error };
  }

  const { data, error } = await createComment(postId, content);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath(`/posts/${postId}`);
  revalidatePath("/posts");
  return { success: true, data, message: "Comment created successfully!" };
}

export async function getCommentsByPostAction(postId) {
  const { data, error } = await getCommentsByPost(postId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

export async function getCommentByIdAction(commentId) {
  const { data, error } = await getCommentById(commentId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

export async function getCommentsByUserAction() {
  const { data, error } = await getCommentsByUser();

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

export async function updateCommentAction(commentId, formData) {
  const content = formData.get("content");

  // Validate content for inappropriate content
  const contentValidation = validateContent(content, "Comment");
  if (!contentValidation.valid) {
    return { success: false, message: contentValidation.error };
  }

  const { data, error } = await updateComment(commentId, content);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/posts");
  revalidatePath("/my-comments");
  return { success: true, data, message: "Comment updated successfully!" };
}

export async function deleteCommentAction(commentId) {
  const { data, error } = await deleteComment(commentId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/posts");
  revalidatePath("/my-comments");
  return { success: true, message: "Comment deleted successfully!" };
}

export async function getCommentCountAction(postId) {
  const { count, error } = await getCommentCount(postId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, count };
}
