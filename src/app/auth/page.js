"use client";

import { useState, useEffect } from "react";
import { isRedirectError } from "next/dist/client/components/redirect-error"; // Needed to fix the red tab error
import { createClient } from "../utils/supabase/client"; // You'll need your client helper
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import Alert from "../components/Alert";
import {
  signUpAction,
  signInAction,
  resetPasswordAction,
  updatePasswordAction,
} from "../actions/authActions";

export default function AuthPage() {
  const [user, setUser] = useState(null); // Track login status
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  // Check if user is logged in on load
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      // If logged in, default mode to 'update'
      if (user) setMode("update");
    };
    checkUser();
  }, []);

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      setAlert({ type: "error", message: error.message });
    } else {
      setUser(null); // Clear the user state so buttons reappear
      setMode("signin"); // Reset the form to Sign In mode
      setAlert({ type: "success", message: "Signed out successfully!" });
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      let result;
      if (mode === "signup") result = await signUpAction(formData);
      if (mode === "signin") result = await signInAction(formData);
      if (mode === "reset") result = await resetPasswordAction(formData);
      if (mode === "update") result = await updatePasswordAction(formData);

      if (result?.success) {
        setAlert({ type: "success", message: result.message });
        setEmail("");
        setPassword("");
      } else if (result) {
        setAlert({ type: "error", message: result.message });
      }
    } catch (error) {
      // FIX FOR "NEXT REDIRECT" ERROR:
      if (isRedirectError(error)) {
        throw error; // Let Next.js handle the redirect
      }

      setAlert({
        type: "error",
        message: error.message || "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">
          {user ? "Account Settings" : "Authentication"}
        </h1>

        <Card>
          {/* LOGGED OUT VIEW: Only show Sign In / Sign Up */}
          {user ? (
            /* LOGGED IN VIEW */
            <div className="space-y-4">
              <div className="p-4 bg-gray-800 rounded-md border border-gray-700">
                <p className="text-sm text-gray-400">Logged in as:</p>
                <p className="text-white font-medium">{user.email}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={mode === "update" ? "primary" : "secondary"}
                  onClick={() => setMode("update")}
                  className="flex-1"
                >
                  Settings
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleSignOut}
                  className="flex-1 border-red-900 text-red-400 hover:bg-red-900/20"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            /* LOGGED OUT VIEW (Your existing Sign In / Sign Up buttons) */
            <div className="flex gap-2 mb-6">
              <Button
                variant={mode === "signin" ? "primary" : "secondary"}
                onClick={() => setMode("signin")}
                className="flex-1"
              >
                Sign In
              </Button>
              <Button
                variant={mode === "signup" ? "primary" : "secondary"}
                onClick={() => setMode("signup")}
                className="flex-1"
              >
                Sign Up
              </Button>
            </div>
          )}

          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            {/* Fields logic remains same... */}
            {mode !== "update" && (
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            )}

            {mode !== "reset" && (
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Processing..." : getButtonText(mode)}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

function getButtonText(mode) {
  const texts = {
    signin: "Sign In",
    signup: "Create Account",
    reset: "Send Reset Link",
    update: "Update My Password",
  };
  return texts[mode] || "Submit";
}
