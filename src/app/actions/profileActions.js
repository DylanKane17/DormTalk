"use server";

import {
  getProfileById,
  getCurrentUserProfile,
  updateProfile,
  getProfileWithStats,
} from "../utils/supabase/crud";
import { revalidatePath } from "next/cache";
import { validateContent } from "../utils/moderation";

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
  const username = formData.get("username");
  // High school fields
  const interests = formData.get("interests");
  const intendedMajor = formData.get("intendedMajor");
  const hometown = formData.get("hometown");
  const bio = formData.get("bio");

  // Validate bio for inappropriate content if provided
  if (bio !== null && bio.trim()) {
    const bioValidation = validateContent(bio, "Biography");
    if (!bioValidation.valid) {
      return { success: false, message: bioValidation.error };
    }
  }

  // Validate interests for inappropriate content if provided
  if (interests !== null && interests.trim()) {
    const interestsValidation = validateContent(interests, "Interests");
    if (!interestsValidation.valid) {
      return { success: false, message: interestsValidation.error };
    }
  }

  // Validate intended major for inappropriate content if provided
  if (intendedMajor !== null && intendedMajor.trim()) {
    const majorValidation = validateContent(intendedMajor, "Intended Major");
    if (!majorValidation.valid) {
      return { success: false, message: majorValidation.error };
    }
  }

  // Validate hometown for inappropriate content if provided
  if (hometown !== null && hometown.trim()) {
    const hometownValidation = validateContent(hometown, "Hometown");
    if (!hometownValidation.valid) {
      return { success: false, message: hometownValidation.error };
    }
  }

  if (school !== null) updates.school = school;
  if (username) updates.username = username;
  // High school fields
  if (interests !== null) updates.interests = interests;
  if (intendedMajor !== null) updates.intended_major = intendedMajor;
  if (hometown !== null) updates.hometown = hometown;
  if (bio !== null) updates.bio = bio;

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
