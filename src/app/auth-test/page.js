"use client";

import { useState } from "react";
import {
  handleSignUp,
  handleSignIn,
  handleResetPassword,
  handleUpdatePassword,
} from "./actions";

export default function AuthTestPage() {
  const [activeTab, setActiveTab] = useState("signup");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (action, formData) => {
    setLoading(true);
    setMessage("");
    const result = await action(formData);
    setMessage(result.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Supabase Auth Testing
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Test your authentication functions
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === "signup"
                  ? "bg-blue-50 text-blue-700 border-b-2 border-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setActiveTab("signin")}
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === "signin"
                  ? "bg-blue-50 text-blue-700 border-b-2 border-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("reset")}
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === "reset"
                  ? "bg-blue-50 text-blue-700 border-b-2 border-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Reset
            </button>
            <button
              onClick={() => setActiveTab("update")}
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === "update"
                  ? "bg-blue-50 text-blue-700 border-b-2 border-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Update
            </button>
          </div>

          <div className="p-6">
            {/* Message Display */}
            {message && (
              <div
                className={`mb-4 p-3 rounded-md ${
                  message.includes("successful")
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                {message}
              </div>
            )}

            {/* Sign Up Form */}
            {activeTab === "signup" && (
              <form
                action={async (formData) => {
                  await handleSubmit(handleSignUp, formData);
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="signup-email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      id="signup-email"
                      name="email"
                      type="email"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="signup-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <input
                      id="signup-password"
                      name="password"
                      type="password"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Sign Up"}
                  </button>
                </div>
              </form>
            )}

            {/* Sign In Form */}
            {activeTab === "signin" && (
              <form
                action={async (formData) => {
                  await handleSubmit(handleSignIn, formData);
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="signin-email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      id="signin-email"
                      name="email"
                      type="email"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="signin-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <input
                      id="signin-password"
                      name="password"
                      type="password"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Sign In"}
                  </button>
                </div>
              </form>
            )}

            {/* Reset Password Form */}
            {activeTab === "reset" && (
              <form
                action={async (formData) => {
                  await handleSubmit(handleResetPassword, formData);
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="reset-email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      id="reset-email"
                      name="email"
                      type="email"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="you@example.com"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Send Reset Email"}
                  </button>
                </div>
              </form>
            )}

            {/* Update Password Form */}
            {activeTab === "update" && (
              <form
                action={async (formData) => {
                  await handleSubmit(handleUpdatePassword, formData);
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="update-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>
                    <input
                      id="update-password"
                      name="password"
                      type="password"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Update Password"}
                  </button>
                  <p className="text-xs text-gray-500">
                    Note: You must be signed in to update your password
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Testing Instructions
          </h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <strong>Sign Up:</strong> Create a new account. Check your email
              for verification.
            </li>
            <li>
              <strong>Sign In:</strong> Log in with existing credentials.
            </li>
            <li>
              <strong>Reset:</strong> Request a password reset email.
            </li>
            <li>
              <strong>Update:</strong> Change password (requires active
              session).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
