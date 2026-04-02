"use server";

import { signUp, signIn, resetPass, updatePass } from "../utils/supabase/auth";
import { redirect } from "next/navigation";

export async function signUpAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    await signUp(email, password);
    return {
      success: true,
      message: "Sign up successful! Check your email for verification.",
    };
  } catch (error) {
    return { success: false, message: error.message || "Sign up failed" };
  }
}

export async function signInAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    await signIn(email, password);
    redirect("/posts");
  } catch (error) {
    return { success: false, message: error.message || "Sign in failed" };
  }
}

export async function resetPasswordAction(formData) {
  const email = formData.get("email");

  try {
    await resetPass(email);
    return {
      success: true,
      message: "Password reset email sent! Check your inbox.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Password reset failed",
    };
  }
}

export async function updatePasswordAction(formData) {
  const password = formData.get("password");

  try {
    await updatePass(password);
    return { success: true, message: "Password updated successfully!" };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Password update failed",
    };
  }
}
