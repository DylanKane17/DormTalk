"use server";

import {
  getProfileById,
  getCurrentUserProfile,
  updateProfile,
  getProfileWithStats,
} from "../utils/supabase/crud";
import { revalidatePath } from "next/cache";

export async function getProfileByIdAction(userId) {
  const { data, error } = await getProfileById(userId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

export async function getCurrentUserProfileAction() {
  const { data, error } = await getCurrentUserProfile();

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

export async function updateProfileAction(formData) {
  const updates = {};

  const school = formData.get("school");
  const major = formData.get("major");
  const activities = formData.get("activities");
  const bio = formData.get("bio");
  const hometown = formData.get("hometown");

  if (school) updates.school = school;
  if (major) updates.major = major;
  if (activities) updates.activities = activities;
  if (bio) updates.bio = bio.slice(0, 100); // Enforce 100 char limit
  if (hometown) updates.hometown = hometown;

  const { data, error } = await updateProfile(updates);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/profile/edit");
  revalidatePath("/profile/[id]", "page");
  return { success: true, data, message: "Profile updated successfully!" };
}

export async function getProfileWithStatsAction(userId) {
  const { data, error } = await getProfileWithStats(userId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}
