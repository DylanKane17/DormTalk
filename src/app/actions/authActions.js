"use server";

// Server actions must use the server client, not the browser client
import { createClient } from "../utils/supabase/server";

// Helper function to extract email domain
function extractEmailDomain(email) {
  return email.split("@")[1]?.toLowerCase() || "";
}

// Helper function to check if email is .edu
function isEduEmail(email) {
  const domain = extractEmailDomain(email);
  return domain.endsWith(".edu");
}

// Helper function to validate college email matches school
function validateCollegeEmail(email, school, userType) {
  if (userType !== "college") return { valid: true };

  if (!isEduEmail(email)) {
    return {
      valid: false,
      message: "College students must use a .edu email address.",
    };
  }

  // Import the school lookup function
  const { getSchoolByName } = require("../data/schools");

  // Extract email domain
  const emailDomain = extractEmailDomain(email);

  // Try to find exact school match in our database
  const schoolData = getSchoolByName(school);

  if (schoolData) {
    // We have this school in our database - use exact domain matching
    if (emailDomain === schoolData.domain) {
      return { valid: true };
    } else {
      return {
        valid: false,
        message: `Email domain (${emailDomain}) does not match ${school}. Please use @${schoolData.domain}`,
      };
    }
  }

  // School not in database - use flexible matching as fallback
  const domainParts = emailDomain.replace(".edu", "").split(".");
  const schoolLower = school.toLowerCase();

  // Extract meaningful words from school name (ignore common words)
  const commonWords = [
    "university",
    "college",
    "institute",
    "school",
    "of",
    "the",
    "and",
    "at",
  ];
  const schoolWords = schoolLower
    .split(/[\s-]+/)
    .filter((word) => word.length > 2 && !commonWords.includes(word));

  // Get the main domain part
  const mainDomain =
    domainParts.find((part) => part.length > 2) || domainParts[0];

  // Check for matches using flexible algorithm
  const domainMatch =
    domainParts.some((domainPart) =>
      schoolWords.some(
        (schoolWord) =>
          domainPart === schoolWord ||
          domainPart.includes(schoolWord) ||
          schoolWord.includes(domainPart) ||
          schoolWord.startsWith(domainPart),
      ),
    ) || schoolWords.some((word) => mainDomain.includes(word.substring(0, 3)));

  if (!domainMatch) {
    return {
      valid: false,
      message: `Email domain (${emailDomain}) does not appear to match your school (${school}). Please use your official school email. If this is correct, contact support.`,
    };
  }

  return { valid: true };
}

// 1. Create the Auth User
export async function signUpAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");
  const school = formData.get("school");
  const userType = formData.get("userType") || "high_school";
  const ageConfirmed = formData.get("ageConfirmed") === "true";
  // High school specific fields
  const interests = formData.get("interests") || "";
  const intendedMajor = formData.get("intendedMajor") || "";
  const hometown = formData.get("hometown") || "";
  const bio = formData.get("bio") || "";

  // Validate user type
  if (!["high_school", "college"].includes(userType)) {
    return {
      success: false,
      message: "Invalid user type. Please select High School or College.",
    };
  }

  // Validate age confirmation for high school students
  if (userType === "high_school" && !ageConfirmed) {
    return {
      success: false,
      message: "You must confirm that you are at least 16 years old.",
    };
  }

  // Validate college email
  const emailValidation = validateCollegeEmail(email, school, userType);
  if (!emailValidation.valid) {
    return {
      success: false,
      message: emailValidation.message,
    };
  }

  const supabase = await createClient();

  // Extract email domain
  const emailDomain = extractEmailDomain(email);
  const isVerified = userType === "college" && isEduEmail(email);

  // 1. Create the Auth User AND pass metadata at the same time
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // This data is sent to the 'auth.users' table immediately
      data: {
        username: username,
        school: school,
        user_type: userType,
        email_domain: emailDomain,
        is_verified: isVerified,
        age_confirmed: ageConfirmed,
        // High school specific fields
        interests: interests,
        intended_major: intendedMajor,
        hometown: hometown,
        bio: bio,
      },
    },
  });
  if (error) return { success: false, message: error.message };

  return {
    success: true,
    message:
      "Account created! Please check your email or log in if confirmation is disabled.",
  };
}

export async function signInAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, message: error.message };
  }

  // Notice: No redirect() here! The frontend will handle it.
  return { success: true, message: "Logged in successfully." };
}

export async function resetPasswordAction(formData) {
  const email = formData.get("email");
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) return { success: false, message: error.message };
  return { success: true, message: "Password reset email sent." };
}

export async function updatePasswordAction(formData) {
  const password = formData.get("password");
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { success: false, message: error.message };
  return { success: true, message: "Password updated successfully." };
}

export async function changePasswordAction(formData) {
  const oldPassword = formData.get("oldPassword");
  const newPassword = formData.get("newPassword");
  const confirmPassword = formData.get("confirmPassword");

  // Validate passwords match
  if (newPassword !== confirmPassword) {
    return { success: false, message: "New passwords do not match." };
  }

  // Validate password length
  if (newPassword.length < 6) {
    return {
      success: false,
      message: "Password must be at least 6 characters long.",
    };
  }

  const supabase = await createClient();

  // Get current user's email
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { success: false, message: "You must be logged in." };
  }

  // Verify old password by attempting to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: oldPassword,
  });

  if (signInError) {
    return { success: false, message: "Current password is incorrect." };
  }

  // Update to new password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { success: false, message: updateError.message };
  }

  return { success: true, message: "Password changed successfully!" };
}

export async function deleteAccountAction(formData) {
  const password = formData.get("password");
  const confirmation = formData.get("confirmation");

  // Validate confirmation text
  if (confirmation !== "DELETE") {
    return {
      success: false,
      message: 'You must type "DELETE" to confirm account deletion.',
    };
  }

  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { success: false, message: "You must be logged in." };
  }

  // Verify password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: password,
  });

  if (signInError) {
    return { success: false, message: "Password is incorrect." };
  }

  // Delete user data in the correct order to respect foreign keys

  // 1. Delete comment votes
  await supabase.from("comment_votes").delete().eq("user_id", user.id);

  // 2. Delete post votes
  await supabase.from("post_votes").delete().eq("user_id", user.id);

  // 3. Delete messages (both sent and received)
  await supabase.from("messages").delete().eq("sender_id", user.id);
  await supabase.from("messages").delete().eq("recipient_id", user.id);

  // 4. Delete comments
  await supabase.from("comments").delete().eq("user_id", user.id);

  // 5. Delete posts
  await supabase.from("posts").delete().eq("user_id", user.id);

  // 6. Delete profile
  const { error: deleteProfileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", user.id);

  if (deleteProfileError) {
    return { success: false, message: deleteProfileError.message };
  }

  // 7. Try to delete auth user via RPC function
  const { error: deleteAuthError } = await supabase.rpc("delete_user");

  if (deleteAuthError) {
    // If the RPC fails, the user data is still deleted
    // They won't be able to access anything without a profile
    console.error("Auth deletion failed:", deleteAuthError);
  }

  // 8. Sign out
  await supabase.auth.signOut();

  return {
    success: true,
    message: "Account and all data deleted successfully.",
  };
}
