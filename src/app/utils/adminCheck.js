"use server";

import { createClient } from "./supabase/server";
import { isAdminEmail } from "../config/admin";

/**
 * Check if the current user is an admin
 * @returns {Promise<{isAdmin: boolean, user: object|null}>}
 */
export async function checkIsAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isAdmin: false, user: null };
  }

  const isAdmin = isAdminEmail(user.email);

  return { isAdmin, user };
}

/**
 * Require admin access - throws error if not admin
 * @returns {Promise<object>} - Returns user object if admin
 * @throws {Error} - Throws if not admin
 */
export async function requireAdmin() {
  const { isAdmin, user } = await checkIsAdmin();

  if (!isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }

  return user;
}
