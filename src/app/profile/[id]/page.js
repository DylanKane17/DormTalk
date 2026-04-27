"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Alert from "../../components/Alert";
import { getProfileWithStatsAction } from "../../actions/profileActions";
import { getCurrentUserProfileAction } from "../../actions/profileActions";
import { getConversationAction } from "../../actions/messageActions";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [hasExistingConversation, setHasExistingConversation] = useState(false);

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

  const checkExistingConversation = async () => {
    if (!params.id) return;
    const result = await getConversationAction(params.id);
    if (result.success && result.data && result.data.length > 0) {
      setHasExistingConversation(true);
    }
  };

  useEffect(() => {
    loadProfile();
    loadCurrentUser();
    checkExistingConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const isOwnProfile = currentUser && profile && currentUser.id === profile.id;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <p className="text-center text-gray-600">Profile not found</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Profile Header Card */}
        <Card className="mb-6">
          <div className="flex flex-col items-center text-center mb-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold text-3xl mb-4">
              {profile.username?.charAt(0).toUpperCase() || "U"}
            </div>

            {/* Username */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              @{profile.username}
            </h1>

            {/* School (for college students) */}
            {profile.user_type === "college" && profile.school && (
              <p className="text-lg text-blue-600 dark:text-blue-400 font-medium mb-4">
                {profile.school}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-4 items-center">
              {isOwnProfile ? (
                <Button onClick={() => router.push("/profile/edit")}>
                  Edit Profile
                </Button>
              ) : (
                currentUser && (
                  <>
                    {/* High school students can always message */}
                    {currentUser.user_type === "high_school" && (
                      <Button
                        onClick={() => router.push(`/messages/${profile.id}`)}
                      >
                        Message
                      </Button>
                    )}
                    {/* College students can only message if conversation exists */}
                    {currentUser.user_type === "college" &&
                      hasExistingConversation && (
                        <Button
                          onClick={() => router.push(`/messages/${profile.id}`)}
                        >
                          Message
                        </Button>
                      )}
                    {/* Show info message for college students without existing conversation */}
                    {currentUser.user_type === "college" &&
                      !hasExistingConversation && (
                        <div className="text-sm text-[var(--text-tertiary)] italic text-center">
                          College students can only reply to messages they
                          receive
                        </div>
                      )}
                  </>
                )
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile.post_count || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile.comment_count || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Comments
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(profile.post_count || 0) + (profile.comment_count || 0)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-6 space-y-4">
            {/* High School Student Fields */}
            {profile.user_type === "high_school" && (
              <>
                {profile.hometown && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                      Hometown
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {profile.hometown}
                    </p>
                  </div>
                )}

                {profile.intended_major && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                      Intended Major
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {profile.intended_major}
                    </p>
                  </div>
                )}

                {profile.interests && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                      Interests
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {profile.interests}
                    </p>
                  </div>
                )}

                {profile.bio && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                      Bio
                    </h3>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                      {profile.bio}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Member Since */}
            {profile.created_at && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Member since{" "}
                  {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
