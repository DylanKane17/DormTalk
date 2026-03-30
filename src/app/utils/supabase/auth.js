//NOTE: Need to implement error handling
import { createClient } from "./server.js";

export async function signUp(email, password) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "https://example.com/welcome",
    },
  });
}

export async function signIn(email, password) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function resetPass(email) {
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://example.com/account/update-password",
  });
}

export async function updatePass(password) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
}
