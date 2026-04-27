"use server";

import { checkIsAdmin } from "../utils/adminCheck";

/**
 * Check if the current user is an admin (for client components)
 * @returns {Promise<{success: boolean, isAdmin: boolean}>}
 */
export async function checkIsAdminAction() {
  const { isAdmin } = await checkIsAdmin();
  return { success: true, isAdmin };
}
