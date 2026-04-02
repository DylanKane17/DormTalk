"use client";

import { useState } from "react";
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
  const [mode, setMode] = useState("signin"); // signin, signup, reset, update
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      let result;
      switch (mode) {
        case "signup":
          result = await signUpAction(formData);
          break;
        case "signin":
          result = await signInAction(formData);
          break;
        case "reset":
          result = await resetPasswordAction(formData);
          break;
        case "update":
          result = await updatePasswordAction(formData);
          break;
      }

      if (result) {
        setAlert({
          type: result.success ? "success" : "error",
          message: result.message,
        });
        if (result.success) {
          setEmail("");
          setPassword("");
        }
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
          Authentication
        </h1>

        <Card>
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

          <div className="flex gap-2 mb-6">
            <Button
              variant={mode === "reset" ? "primary" : "secondary"}
              onClick={() => setMode("reset")}
              className="flex-1"
            >
              Reset Password
            </Button>
            <Button
              variant={mode === "update" ? "primary" : "secondary"}
              onClick={() => setMode("update")}
              className="flex-1"
            >
              Update Password
            </Button>
          </div>

          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
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

          <div className="mt-6 text-sm text-gray-300">
            <p className="font-semibold mb-2 text-white">Mode Descriptions:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>
                <strong className="text-white">Sign In:</strong> Log in with
                existing credentials
              </li>
              <li>
                <strong className="text-white">Sign Up:</strong> Create a new
                account
              </li>
              <li>
                <strong className="text-white">Reset Password:</strong> Send
                password reset email
              </li>
              <li>
                <strong className="text-white">Update Password:</strong> Change
                password (must be logged in)
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}

function getButtonText(mode) {
  switch (mode) {
    case "signin":
      return "Sign In";
    case "signup":
      return "Sign Up";
    case "reset":
      return "Send Reset Email";
    case "update":
      return "Update Password";
    default:
      return "Submit";
  }
}
