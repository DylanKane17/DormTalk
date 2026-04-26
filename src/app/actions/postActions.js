"use server";

import {
  createPost,
  getPosts,
  getPostById,
  getPostsByUser,
  updatePost,
  deletePost,
  getPostWithComments,
  getPostsWithComments,
  deletePostWithComments,
} from "../utils/supabase/crud";
import { revalidatePath } from "next/cache";

export async function createPostAction(formData) {
  const title = formData.get("title");
  const content = formData.get("content");
  const isAnonymous = formData.get("isAnonymous") === "true";

  const { data, error } = await createPost(title, content, isAnonymous);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/posts");
  revalidatePath("/my-posts");
  return { success: true, data, message: "Post created successfully!" };
}

export async function getPostsAction(limit = 50, offset = 0) {
  const { data, error } = await getPosts(limit, offset);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

export async function getPostByIdAction(postId) {
  const { data, error } = await getPostById(postId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

export async function getPostsByUserAction() {
  const { data, error } = await getPostsByUser();

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

export async function updatePostAction(postId, formData) {
  const title = formData.get("title");
  const content = formData.get("content");

  const updates = {};
  if (title) updates.title = title;
  if (content) updates.content = content;

  const { data, error } = await updatePost(postId, updates);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/posts");
  revalidatePath("/my-posts");
  revalidatePath(`/posts/${postId}`);
  return { success: true, data, message: "Post updated successfully!" };
}

export async function deletePostAction(postId) {
  const { data, error } = await deletePost(postId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/posts");
  revalidatePath("/my-posts");
  return { success: true, message: "Post deleted successfully!" };
}

export async function getPostWithCommentsAction(postId) {
  const { data, error } = await getPostWithComments(postId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

export async function getPostsWithCommentsAction(limit = 20, offset = 0) {
  const { data, error } = await getPostsWithComments(limit, offset);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

export async function deletePostWithCommentsAction(postId) {
  const { data, error } = await deletePostWithComments(postId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/posts");
  revalidatePath("/my-posts");
  return { success: true, message: "Post and comments deleted successfully!" };
}
