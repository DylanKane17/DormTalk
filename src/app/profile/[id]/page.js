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

  useEffect(() => {
    loadProfile();
    loadCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

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
            <div className="flex gap-2">
              {isOwnProfile ? (
                <Button onClick={() => router.push("/profile/edit")}>
                  Edit Profile
                </Button>
              ) : (
                currentUser && (
                  <Button
                    onClick={() => router.push(`/messages/${profile.id}`)}
                  >
                    Message
                  </Button>
                )
              )}
            </div>
          </div>

          {/* High School Student Fields */}
          {profile.user_type === "high_school" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {profile.hometown && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                      Hometown
                    </h3>
                    <p className="text-white">{profile.hometown}</p>
                  </div>
                )}

                {profile.intended_major && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                      Intended Major
                    </h3>
                    <p className="text-white">{profile.intended_major}</p>
                  </div>
                )}
              </div>

              {profile.interests && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                    Interests
                  </h3>
                  <p className="text-white">{profile.interests}</p>
                </div>
              )}

              {profile.bio && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                    Bio
                  </h3>
                  <p className="text-white whitespace-pre-wrap">
                    {profile.bio}
                  </p>
                </div>
              )}
            </>
          )}

          {/* College Student Fields */}
          {profile.user_type === "college" && profile.school && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                University
              </h3>
              <p className="text-white">{profile.school}</p>
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

          {profile.created_at && (
            <div className="border-t border-gray-700 pt-4 mt-6">
              <p className="text-sm text-gray-500">
                Member since {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
