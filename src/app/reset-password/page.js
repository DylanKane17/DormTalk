"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";
import Button from "../components/Button";
import Card from "../components/Card";
import Alert from "../components/Alert";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Check if we have a valid recovery token
    const checkRecoveryToken = async () => {
      try {
        // Get the session to see if we're in recovery mode
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setIsValidToken(true);
        } else {
          setAlert({
            type: "error",
            message:
              "Invalid or expired reset link. Please request a new password reset.",
          });
        }
      } catch (error) {
        console.error("Error checking token:", error);
        setAlert({
          type: "error",
          message: "An error occurred. Please try again.",
        });
      } finally {
        setCheckingToken(false);
      }
    };

    checkRecoveryToken();
  }, [supabase.auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setAlert({
        type: "error",
        message: "Passwords do not match.",
      });
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setAlert({
        type: "error",
        message: "Password must be at least 6 characters long.",
      });
      setLoading(false);
      return;
    }

    try {
      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setAlert({
          type: "error",
          message: error.message,
        });
      } else {
        setAlert({
          type: "success",
          message: "Password updated successfully! Redirecting to login...",
        });

        // Wait a moment then redirect to auth page
        setTimeout(() => {
          router.push("/auth");
        }, 2000);
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

  if (checkingToken) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Verifying reset link...</p>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-[var(--text-primary)]">
            Reset Password
          </h1>

          <Card>
            {alert && (
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            )}

            <div className="mt-6 text-center">
              <Button onClick={() => router.push("/auth")} className="w-full">
                Back to Login
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-[var(--text-primary)]">
          Reset Your Password
        </h1>

        <Card>
          <p className="text-gray-600 mb-6">
            Enter your new password below. Make sure it&apos;s at least 6
            characters long.
          </p>

          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                  className="w-full px-4 py-2 pr-10 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  className="w-full px-4 py-2 pr-10 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Updating Password..." : "Update Password"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/auth")}
              className="text-sm text-[var(--brand-blue)] hover:underline"
            >
              Back to Login
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
