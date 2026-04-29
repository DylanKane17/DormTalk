"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PostCard from "../components/PostCard";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";
import Link from "next/link";
import {
  searchProfilesAction,
  searchPostsAction,
} from "../actions/searchActions";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [searchType, setSearchType] = useState("posts"); // 'posts' or 'students'
  const [schoolFilter, setSchoolFilter] = useState("");
  const [majorFilter, setMajorFilter] = useState("");
  const [posts, setPosts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Filter profiles by school and major
  const filteredProfiles = profiles.filter((profile) => {
    const matchesSchool = schoolFilter
      ? profile.school?.toLowerCase().includes(schoolFilter.toLowerCase())
      : true;
    const matchesMajor = majorFilter
      ? profile.major?.toLowerCase().includes(majorFilter.toLowerCase())
      : true;
    return matchesSchool && matchesMajor;
  });

  const performSearch = async (searchTerm) => {
    if (!searchTerm.trim()) return;

    setLoading(true);

    // Search both posts and profiles
    const [postsResult, profilesResult] = await Promise.all([
      searchPostsAction(searchTerm, 50),
      searchProfilesAction(searchTerm, 50),
    ]);

    if (postsResult.success) {
      setPosts(postsResult.data || []);
    }

    if (profilesResult.success) {
      setProfiles(profilesResult.data || []);
    }

    setLoading(false);
  };

  // Load search results when query changes
  useEffect(() => {
    if (query) {
      performSearch(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <p className="text-center text-gray-400">
              Use the search bar above to find posts and students
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Search Results</h1>
        <p className="text-gray-400 mb-8">Showing results for "{query}"</p>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSearchType("posts")}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              searchType === "posts"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Posts ({posts.length})
          </button>
          <button
            onClick={() => setSearchType("students")}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              searchType === "students"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            College Students ({profiles.length})
          </button>
        </div>

        {/* Filters for Students */}
        {searchType === "students" && profiles.length > 0 && (
          <Card className="mb-6 space-y-4">
            {/* School Filter */}
            <div className="flex items-center gap-4">
              <label className="text-gray-300 font-medium whitespace-nowrap">
                Filter by School:
              </label>
              <Input
                value={schoolFilter}
                onChange={(e) => setSchoolFilter(e.target.value)}
                placeholder="Enter school name..."
                className="flex-1"
              />
              {schoolFilter && (
                <Button
                  onClick={() => setSchoolFilter("")}
                  variant="secondary"
                  size="sm"
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Major Filter */}
            <div className="flex items-center gap-4">
              <label className="text-gray-300 font-medium whitespace-nowrap">
                Filter by Major:
              </label>
              <Input
                value={majorFilter}
                onChange={(e) => setMajorFilter(e.target.value)}
                placeholder="Enter major..."
                className="flex-1"
              />
              {majorFilter && (
                <Button
                  onClick={() => setMajorFilter("")}
                  variant="secondary"
                  size="sm"
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Results count */}
            {(schoolFilter || majorFilter) && (
              <p className="text-sm text-gray-400">
                Showing {filteredProfiles.length} of {profiles.length} students
              </p>
            )}
          </Card>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-400 mt-4">Searching...</p>
          </div>
        ) : (
          <>
            {/* Posts View */}
            {searchType === "posts" && (
              <>
                {posts.length === 0 ? (
                  <Card>
                    <p className="text-center text-gray-400 py-8">
                      No posts found matching "{query}"
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} showComments={true} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Students View */}
            {searchType === "students" && (
              <>
                {filteredProfiles.length === 0 ? (
                  <Card>
                    <p className="text-center text-gray-400 py-8">
                      {schoolFilter
                        ? `No students found at "${schoolFilter}"`
                        : `No students found matching "${query}"`}
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredProfiles.map((profile) => (
                      <Card
                        key={profile.id}
                        className="hover:shadow-lg hover:shadow-cyan-900/30 transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link href={`/profile/${profile.id}`}>
                              <h3 className="text-lg font-semibold text-cyan-400 hover:text-cyan-300 mb-2 cursor-pointer">
                                @{profile.username}
                              </h3>
                            </Link>

                            {/* School */}
                            <div className="flex items-center gap-2 mb-2">
                              <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                              </svg>
                              <p className="text-gray-300 font-medium">
                                {profile.school}
                              </p>
                            </div>

                            {/* Major */}
                            {profile.major && (
                              <div className="flex items-center gap-2 mb-2">
                                <svg
                                  className="w-4 h-4 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                  />
                                </svg>
                                <p className="text-gray-300">
                                  <span className="text-gray-400">Major:</span>{" "}
                                  {profile.major}
                                </p>
                              </div>
                            )}

                            {/* Activities */}
                            {profile.activities && (
                              <div className="flex items-start gap-2 mb-2">
                                <svg
                                  className="w-4 h-4 text-gray-400 mt-0.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                                  />
                                </svg>
                                <p className="text-gray-300">
                                  <span className="text-gray-400">
                                    Activities:
                                  </span>{" "}
                                  {profile.activities}
                                </p>
                              </div>
                            )}

                            {/* Bio */}
                            {profile.bio && (
                              <p className="text-gray-400 mt-3 italic text-sm border-l-2 border-gray-700 pl-3">
                                {profile.bio}
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
