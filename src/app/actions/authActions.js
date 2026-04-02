"use server";

// Server actions must use the server client, not the browser client
import { createClient } from "../utils/supabase/server";

// 1. Create the Auth User
export async function signUpAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");
  const school = formData.get("school");

  const supabase = await createClient();

  // 1. Create the Auth User AND pass metadata at the same time
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // This data is sent to the 'auth.users' table immediately
      data: {
        username: username,
        school: school,
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
