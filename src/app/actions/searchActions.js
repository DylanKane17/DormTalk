"use server";

import { searchProfiles, searchPosts } from "../utils/supabase/crud";

export async function searchProfilesAction(searchTerm, limit = 20) {
  const { data, error } = await searchProfiles(searchTerm, limit);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

export async function searchPostsAction(searchTerm, limit = 50) {
  const { data, error } = await searchPosts(searchTerm, limit);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}
