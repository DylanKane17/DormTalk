"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Textarea from "../../components/Textarea";
import Alert from "../../components/Alert";
import Modal from "../../components/Modal";
import {
  getCurrentUserProfileAction,
  updateProfileAction,
} from "../../actions/profileActions";
import {
  changePasswordAction,
  deleteAccountAction,
} from "../../actions/authActions";

export default function EditProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [activeTab, setActiveTab] = useState("profile"); // profile, password, account

  // Profile fields
  const [username, setUsername] = useState("");
  const [school, setSchool] = useState("");
  // High school fields
  const [interests, setInterests] = useState("");
  const [intendedMajor, setIntendedMajor] = useState("");
  const [hometown, setHometown] = useState("");
  const [bio, setBio] = useState("");

  // Password fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Account deletion fields
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadProfile = async () => {
    setLoading(true);
    const result = await getCurrentUserProfileAction();
    if (result.success) {
      setProfile(result.data);
      setUsername(result.data.username || "");
      setSchool(result.data.school || "");
      // High school fields
      setInterests(result.data.interests || "");
      setIntendedMajor(result.data.intended_major || "");
      setHometown(result.data.hometown || "");
      setBio(result.data.bio || "");
    } else {
      setAlert({ type: "error", message: result.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append("username", username);

    // Add fields based on user type
    if (profile.user_type === "high_school") {
      formData.append("interests", interests);
      formData.append("intendedMajor", intendedMajor);
      formData.append("hometown", hometown);
      formData.append("bio", bio);
    } else if (profile.user_type === "college") {
      formData.append("school", school);
    }

    const result = await updateProfileAction(formData);
    if (result.success) {
      setAlert({ type: "success", message: result.message });
      setTimeout(() => {
        router.push(`/profile/${profile.id}`);
      }, 1500);
    } else {
      setAlert({ type: "error", message: result.message });
    }
    setSaving(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append("oldPassword", oldPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmPassword", confirmPassword);

    const result = await changePasswordAction(formData);
    if (result.success) {
      setAlert({ type: "success", message: result.message });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setAlert({ type: "error", message: result.message });
    }
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    setSaving(true);

    const formData = new FormData();
    formData.append("password", deletePassword);
    formData.append("confirmation", deleteConfirmation);

    const result = await deleteAccountAction(formData);
    if (result.success) {
      setAlert({ type: "success", message: result.message });
      setTimeout(() => {
        window.location.href = "/auth";
      }, 2000);
    } else {
      setAlert({ type: "error", message: result.message });
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    setSaving(true);
    await supabase.auth.signOut();
    setAlert({ type: "success", message: "Signed out successfully!" });
    setTimeout(() => {
      window.location.href = "/auth";
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <p className="text-center text-gray-400">
              Please log in to edit your profile
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Account Settings</h1>
          <p className="text-gray-400 mt-2">
            Manage your profile, password, and account
          </p>
        </div>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "profile"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "password"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Password
          </button>
          <button
            onClick={() => setActiveTab("account")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "account"
                ? "text-red-400 border-b-2 border-red-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Account
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <Card>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <Input
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                required
              />

              {/* High School Student Fields */}
              {profile.user_type === "high_school" && (
                <>
                  <Input
                    label="Hometown"
                    value={hometown}
                    onChange={(e) => setHometown(e.target.value)}
                    placeholder="e.g., Boston, MA"
                  />

                  <Input
                    label="Interests"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="e.g., Basketball, Music, Coding"
                  />

                  <Input
                    label="Intended Major"
                    value={intendedMajor}
                    onChange={(e) => setIntendedMajor(e.target.value)}
                    placeholder="e.g., Computer Science"
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

              {/* College Student Fields */}
              {profile.user_type === "college" && (
                <Input
                  label="School"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="e.g., MIT, Stanford, Harvard"
                  disabled
                />
              )}

              <div className="flex gap-2 justify-end pt-4 border-t border-gray-700">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push(`/profile/${profile.id}`)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <Card>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white mb-2">
                  Change Password
                </h2>
                <p className="text-sm text-gray-400">
                  Enter your current password and choose a new one
                </p>
              </div>

              <Input
                label="Current Password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter your current password"
                required
              />

              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                required
                minLength={6}
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                minLength={6}
              />

              {newPassword &&
                confirmPassword &&
                newPassword !== confirmPassword && (
                  <p className="text-sm text-red-400">Passwords do not match</p>
                )}

              <div className="flex gap-2 justify-end pt-4 border-t border-gray-700">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  disabled={saving}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  disabled={
                    saving ||
                    !oldPassword ||
                    !newPassword ||
                    !confirmPassword ||
                    newPassword !== confirmPassword
                  }
                >
                  {saving ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Account Tab */}
        {activeTab === "account" && (
          <Card>
            <div className="space-y-6">
              {/* Sign Out Section */}
              <div className="border border-gray-700 bg-gray-800/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Sign Out
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Sign out of your account on this device
                </p>
                <Button
                  variant="secondary"
                  onClick={handleSignOut}
                  disabled={saving}
                >
                  Sign Out
                </Button>
              </div>

              {/* Danger Zone */}
              <div>
                <h2 className="text-xl font-semibold text-red-400 mb-2">
                  Danger Zone
                </h2>
                <p className="text-sm text-gray-400">
                  Irreversible actions that will permanently affect your account
                </p>
              </div>

              <div className="border border-red-900/50 bg-red-900/10 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Delete Account
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Once you delete your account, there is no going back. This
                  will permanently delete:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-400 mb-4 space-y-1">
                  <li>Your profile and all personal information</li>
                  <li>All your posts and comments</li>
                  <li>All your votes on posts and comments</li>
                  <li>Your account access</li>
                </ul>
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteModal(true)}
                  disabled={saving}
                >
                  Delete My Account
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Delete Account Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => !saving && setShowDeleteModal(false)}
          title="Delete Account"
        >
          <div className="space-y-4">
            <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4">
              <p className="text-red-400 font-semibold mb-2">⚠️ Warning</p>
              <p className="text-sm text-gray-300">
                This action cannot be undone. All your data will be permanently
                deleted.
              </p>
            </div>

            <Input
              label="Enter your password to confirm"
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Your password"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type <span className="text-red-400 font-bold">DELETE</span> to
                confirm
              </label>
              <Input
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type DELETE"
                required
              />
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-gray-700">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                  setDeleteConfirmation("");
                }}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteAccount}
                disabled={
                  saving || !deletePassword || deleteConfirmation !== "DELETE"
                }
              >
                {saving ? "Deleting..." : "Delete Account"}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
