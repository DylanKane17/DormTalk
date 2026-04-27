"use server";

import { adminDeletePost } from "../utils/supabase/crud";
import { revalidatePath } from "next/cache";

/**
 * Admin action to delete any post
 * The SQL function handles admin verification
 */
export async function adminDeletePostAction(postId) {
  const { data, error } = await adminDeletePost(postId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/posts");
  revalidatePath("/moderation");
  revalidatePath("/my-posts");
  revalidatePath("/");
  return { success: true, message: "Post deleted successfully!" };
}
