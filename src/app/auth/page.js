"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client"; // Verify this path!
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
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [school, setSchool] = useState("");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) setMode("update");
    };
    checkUser();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setMode("signin");
    setAlert({ type: "success", message: "Signed out successfully!" });
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    if (mode === "signup") {
      formData.append("username", username);
      formData.append("school", school);
    }

    try {
      let result;
      if (mode === "signup") result = await signUpAction(formData);
      if (mode === "signin") result = await signInAction(formData);
      if (mode === "reset") result = await resetPasswordAction(formData);
      if (mode === "update") result = await updatePasswordAction(formData);

      if (result?.success) {
        setAlert({ type: "success", message: result.message });

        // Handle successful routing directly on the client! No more "NEXT REDIRECT" bug.
        if (mode === "signin") {
          router.push("/");
          router.refresh();
        } else if (mode === "signup") {
          setMode("signin");
          setPassword("");
        } else {
          setEmail("");
          setPassword("");
        }
      } else if (result) {
        setAlert({ type: "error", message: result.message });
      }
    } catch (error) {
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
          {user ? "Account Settings" : "DormTalk Authentication"}
        </h1>

        <Card>
          {!user ? (
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
          ) : (
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-800 rounded-md border border-gray-700">
                <p className="text-sm text-gray-400">Authenticated as:</p>
                <p className="text-white font-medium">{user.email}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={mode === "update" ? "primary" : "secondary"}
                  onClick={() => setMode("update")}
                  className="flex-1"
                >
                  Change Password
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
          )}

          {!user && (
            <div className="flex gap-2 mb-6">
              <Button
                variant={mode === "reset" ? "primary" : "secondary"}
                onClick={() => setMode("reset")}
                className="w-full"
              >
                Forgot Password?
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

          {/* Only show the form if we aren't signed in, OR if we are signed in and specifically updating password */}
          {(!user || mode === "update") && (
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              {/* Anonymous Data only visible during sign up */}
              {mode === "signup" && (
                <>
                  <Input
                    label="Anonymous Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. SleeplessInFreshmanDorm"
                    required
                  />
                  <Input
                    label="Your School"
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="e.g. Wake Forest University"
                    required
                  />
                </>
              )}

              {mode !== "update" && (
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.edu"
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
          )}
        </Card>
      </div>
    </div>
  );
}

function getButtonText(mode) {
  const texts = {
    signin: "Sign In",
    signup: "Create Anonymous Account",
    reset: "Send Reset Link",
    update: "Update My Password",
  };
  return texts[mode] || "Submit";
}
