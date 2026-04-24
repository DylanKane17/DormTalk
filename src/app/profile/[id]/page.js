"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Alert from "../../components/Alert";
import { getProfileWithStatsAction } from "../../actions/profileActions";
import { getCurrentUserProfileAction } from "../../actions/profileActions";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadProfile();
    loadCurrentUser();
  }, [params.id]);

  const loadProfile = async () => {
    setLoading(true);
    const result = await getProfileWithStatsAction(params.id);
    if (result.success) {
      setProfile(result.data);
    } else {
      setAlert({ type: "error", message: result.message });
    }
    setLoading(false);
  };

  const loadCurrentUser = async () => {
    const result = await getCurrentUserProfileAction();
    if (result.success) {
      setCurrentUser(result.data);
    }
  };

  const isOwnProfile = currentUser && profile && currentUser.id === profile.id;

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
            <p className="text-center text-gray-400">Profile not found</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <Card className="mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                @{profile.username}
              </h1>
              {profile.school && (
                <p className="text-xl text-cyan-400">{profile.school}</p>
              )}
            </div>
            {isOwnProfile && (
              <Button onClick={() => router.push("/profile/edit")}>
                Edit Profile
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                Major
              </h3>
              <p className="text-white">{profile.major || "Not specified"}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                Hometown
              </h3>
              <p className="text-white">
                {profile.hometown || "Not specified"}
              </p>
            </div>
          </div>

          {profile.activities && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                On Campus Activities
              </h3>
              <p className="text-white">{profile.activities}</p>
            </div>
          )}

          {profile.bio && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                Bio
              </h3>
              <p className="text-white">{profile.bio}</p>
            </div>
          )}

          <div className="border-t border-gray-700 pt-6 mt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-cyan-400">
                  {profile.post_count || 0}
                </p>
                <p className="text-sm text-gray-400">Posts</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-cyan-400">
                  {profile.comment_count || 0}
                </p>
                <p className="text-sm text-gray-400">Comments</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-cyan-400">
                  {(profile.post_count || 0) + (profile.comment_count || 0)}
                </p>
                <p className="text-sm text-gray-400">Total Activity</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4 mt-6">
            <p className="text-sm text-gray-500">
              Member since {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
