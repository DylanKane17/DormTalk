"use client";

import { useState } from "react";
import Button from "../components/Button";
import PostCard from "../components/PostCard";
import Card from "../components/Card";
import Input from "../components/Input";
import Alert from "../components/Alert";
import Link from "next/link";
import {
  searchProfilesAction,
  searchPostsAction,
} from "../actions/searchActions";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("posts"); // 'posts' or 'profiles'
  const [posts, setPosts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setAlert({ type: "error", message: "Please enter a search term" });
      return;
    }

    setLoading(true);
    setHasSearched(true);

    if (searchType === "posts") {
      const result = await searchPostsAction(searchTerm, 50);
      if (result.success) {
        setPosts(result.data || []);
        setProfiles([]);
      } else {
        setAlert({ type: "error", message: result.message });
      }
    } else {
      const result = await searchProfilesAction(searchTerm, 20);
      if (result.success) {
        setProfiles(result.data || []);
        setPosts([]);
      } else {
        setAlert({ type: "error", message: result.message });
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Search</h1>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <Card className="mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setSearchType("posts")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  searchType === "posts"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Search Posts
              </button>
              <button
                type="button"
                onClick={() => setSearchType("profiles")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  searchType === "profiles"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Search Profiles
              </button>
            </div>

            <div className="flex gap-2">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  searchType === "posts"
                    ? "Search by title or content..."
                    : "Search by username or school..."
                }
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </form>
        </Card>

        {loading ? (
          <p className="text-center text-gray-400">Searching...</p>
        ) : hasSearched ? (
          <>
            {searchType === "posts" ? (
              posts.length === 0 ? (
                <p className="text-center text-gray-400">
                  No posts found matching "{searchTerm}"
                </p>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white">
                    Found {posts.length} post{posts.length !== 1 ? "s" : ""}
                  </h2>
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} showComments={true} />
                  ))}
                </div>
              )
            ) : profiles.length === 0 ? (
              <p className="text-center text-gray-400">
                No profiles found matching "{searchTerm}"
              </p>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">
                  Found {profiles.length} profile
                  {profiles.length !== 1 ? "s" : ""}
                </h2>
                {profiles.map((profile) => (
                  <Card
                    key={profile.id}
                    className="hover:shadow-lg hover:shadow-cyan-900/30 transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link href={`/profile/${profile.id}`}>
                          <h3 className="text-lg font-semibold text-cyan-400 hover:text-cyan-300 mb-1 cursor-pointer">
                            @{profile.username}
                          </h3>
                        </Link>
                        <p className="text-gray-400 mb-2">{profile.school}</p>
                        {profile.major && (
                          <p className="text-sm text-gray-400 mb-1">
                            <span className="font-medium">Major:</span>{" "}
                            {profile.major}
                          </p>
                        )}
                        {profile.bio && (
                          <p className="text-gray-300 mt-2 italic">
                            &quot;{profile.bio}&quot;
                          </p>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        Joined{" "}
                        {new Date(profile.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-400">
            Enter a search term to find {searchType}
          </p>
        )}
      </div>
    </div>
  );
}
