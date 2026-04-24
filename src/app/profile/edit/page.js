"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Textarea from "../../components/Textarea";
import Alert from "../../components/Alert";
import {
  getCurrentUserProfileAction,
  updateProfileAction,
} from "../../actions/profileActions";

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const [school, setSchool] = useState("");
  const [major, setMajor] = useState("");
  const [activities, setActivities] = useState("");
  const [bio, setBio] = useState("");
  const [hometown, setHometown] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const result = await getCurrentUserProfileAction();
    if (result.success) {
      setProfile(result.data);
      setSchool(result.data.school || "");
      setMajor(result.data.major || "");
      setActivities(result.data.activities || "");
      setBio(result.data.bio || "");
      setHometown(result.data.hometown || "");
    } else {
      setAlert({ type: "error", message: result.message });
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append("school", school);
    formData.append("major", major);
    formData.append("activities", activities);
    formData.append("bio", bio);
    formData.append("hometown", hometown);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 px-4">
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
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
          <p className="text-gray-400 mt-2">Update your profile information</p>
        </div>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <p className="text-white bg-gray-800 px-4 py-2 rounded-lg">
                @{profile.username}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Username cannot be changed
              </p>
            </div>

            <Input
              label="School"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="e.g., MIT, Stanford, Harvard"
            />

            <Input
              label="Major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="e.g., Computer Science, Biology, English"
            />

            <Input
              label="Hometown"
              value={hometown}
              onChange={(e) => setHometown(e.target.value)}
              placeholder="e.g., New York, NY"
            />

            <Textarea
              label="On Campus Activities"
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
              placeholder="e.g., Student Government, Chess Club, Debate Team"
              rows={3}
            />

            <div>
              <Textarea
                label="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 100))}
                placeholder="Tell us about yourself (100 characters max)"
                rows={3}
                maxLength={100}
              />
              <p className="text-sm text-gray-500 mt-1 text-right">
                {bio.length}/100 characters
              </p>
            </div>

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
      </div>
    </div>
  );
}
