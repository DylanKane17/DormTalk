//NOTE: Need to implement error handling
import { createClient } from "./server.js";

export async function signUp(email, password, username, school) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // We pass the anonymous info as "metadata"
      // This is what the database trigger uses to fill your 'profiles' table
      data: {
        username: username,
        school: school,
      },
      emailRedirectTo: "http://localhost:3000/auth/callback", // Update for your local dev
    },
  });

  // CRITICAL: You must return these so the frontend can see them!
  return { data, error };
}

export async function signIn(email, password) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export async function resetPass(email) {
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:3000/auth/update-password",
  });

  return { error };
}

export async function updatePass(password) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
}
