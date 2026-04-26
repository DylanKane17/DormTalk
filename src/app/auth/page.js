"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client"; // Verify this path!
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Button from "../components/Button";
import Card from "../components/Card";
import Alert from "../components/Alert";
import SchoolAutocomplete from "../components/SchoolAutocomplete";
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
  const [userType, setUserType] = useState("high_school");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  // High school specific fields
  const [interests, setInterests] = useState("");
  const [intendedMajor, setIntendedMajor] = useState("");
  const [hometown, setHometown] = useState("");
  const [bio, setBio] = useState("");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      // Redirect authenticated users to home page
      if (user) {
        router.push("/");
      }
    };
    checkUser();
  }, [supabase.auth, router]);

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
      formData.append("userType", userType);
      formData.append("ageConfirmed", ageConfirmed.toString());
      // High school specific fields
      if (userType === "high_school") {
        formData.append("interests", interests);
        formData.append("intendedMajor", intendedMajor);
        formData.append("hometown", hometown);
        formData.append("bio", bio);
      }
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
          // Use window.location for full page reload to update navbar
          window.location.href = "/";
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

  // Don't render anything if user is authenticated (they'll be redirected)
  if (user) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 flex items-center justify-center">
        <p className="text-gray-400">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">
          DormTalk Authentication
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
              className="w-full"
            >
              Forgot Password?
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
            {/* User Type Selection - only visible during sign up */}
            {mode === "signup" && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    I am a:
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value="high_school"
                        checked={userType === "high_school"}
                        onChange={(e) => setUserType(e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">High School Student</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value="college"
                        checked={userType === "college"}
                        onChange={(e) => setUserType(e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">College Student</span>
                    </label>
                  </div>
                </div>

                <Input
                  label="Anonymous Username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. SleeplessInFreshmanDorm"
                  required
                />

                {/* High school specific fields */}
                {userType === "high_school" && (
                  <>
                    <Input
                      label="Hometown"
                      type="text"
                      value={hometown}
                      onChange={(e) => setHometown(e.target.value)}
                      placeholder="e.g. Boston, MA"
                    />

                    <Input
                      label="Interests"
                      type="text"
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      placeholder="e.g. Basketball, Music, Coding"
                    />

                    <Input
                      label="Intended Major"
                      type="text"
                      value={intendedMajor}
                      onChange={(e) => setIntendedMajor(e.target.value)}
                      placeholder="e.g. Computer Science"
                    />

                    <Textarea
                      label="Bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us a bit about yourself..."
                      rows={3}
                    />
                  </>
                )}

                {/* College students must select school */}
                {userType === "college" && (
                  <SchoolAutocomplete
                    value={school}
                    onChange={setSchool}
                    placeholder="Search for your college..."
                    required
                  />
                )}
              </>
            )}

            {mode !== "update" && (
              <div className="space-y-2">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    mode === "signup" && userType === "college"
                      ? "your@school.edu"
                      : "your@email.com"
                  }
                  required
                />
                {mode === "signup" && userType === "college" && (
                  <p className="text-xs text-yellow-400">
                    ⚠️ College students must use their official .edu email that
                    matches their school
                  </p>
                )}
              </div>
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

            {/* Age Confirmation for High School Students */}
            {mode === "signup" && userType === "high_school" && (
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="ageConfirmed"
                  checked={ageConfirmed}
                  onChange={(e) => setAgeConfirmed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  required
                />
                <label
                  htmlFor="ageConfirmed"
                  className="text-sm text-gray-300 cursor-pointer"
                >
                  I confirm that I am at least 16 years old
                </label>
              </div>
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
    signup: "Create Anonymous Account",
    reset: "Send Reset Link",
    update: "Update My Password",
  };
  return texts[mode] || "Submit";
}
