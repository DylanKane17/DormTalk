/**
 * Admin Configuration
 *
 * IMPORTANT: Replace this email with your actual admin email address
 * This user will have special permissions including:
 * - Access to the moderation dashboard
 * - Ability to delete any post or comment
 * - View flagged content
 * - Hide/unhide posts
 */

// TODO: Replace with your admin email address
export const ADMIN_EMAIL = "kanedg24@wfu.edu";

/**
 * Check if an email is an admin
 * @param {string} email - The email to check
 * @returns {boolean} - True if the email is an admin
 */
export function isAdminEmail(email) {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
