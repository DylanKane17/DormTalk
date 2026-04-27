"use client";

import { useState, useEffect } from "react";
import Button from "../components/Button";
import PostCard from "../components/PostCard";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Alert from "../components/Alert";
import {
  getPostsAction,
  createPostAction,
  deletePostAction,
} from "../actions/postActions";
import { flagPostAction } from "../actions/moderationActions";
import { getCurrentUserProfileAction } from "../actions/profileActions";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userType, setUserType] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // Load user profile to get user type
      const profileResult = await getCurrentUserProfileAction();
      if (profileResult.success && profileResult.data) {
        setUserType(profileResult.data.user_type);
      }

      // Load posts
      const postsResult = await getPostsAction(50, 0);
      if (postsResult.success) {
        setPosts(postsResult.data || []);
      } else {
        setAlert({ type: "error", message: postsResult.message });
      }

      setLoading(false);
    };

    loadData();
  }, []);

  const loadPosts = async () => {
    const result = await getPostsAction(50, 0);
    if (result.success) {
      setPosts(result.data || []);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("userType", userType);

    const result = await createPostAction(formData);
    if (result.success) {
      setAlert({ type: "success", message: result.message });
      setIsModalOpen(false);
      setTitle("");
      setContent("");
      loadPosts();
    } else {
      setAlert({ type: "error", message: result.message });
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const result = await deletePostAction(postId);
    if (result.success) {
      setAlert({ type: "success", message: result.message });
      loadPosts();
    } else {
      setAlert({ type: "error", message: result.message });
    }
  };

  const handleFlagPost = async (postId) => {
    const reason = prompt(
      "Please provide a reason for flagging this post:",
      "inappropriate",
    );
    if (!reason) return;

    const result = await flagPostAction(postId, reason);
    if (result.success) {
      setAlert({ type: "success", message: result.message });
      loadPosts();
    } else {
      setAlert({ type: "error", message: result.message });
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            All Posts
          </h1>
          <Button onClick={() => setIsModalOpen(true)}>Create Post</Button>
        </div>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {loading ? (
          <p className="text-center text-[var(--text-tertiary)]">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-[var(--text-tertiary)]">
            No posts yet. Create the first one!
          </p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                showComments={true}
                showFlag={true}
                onFlag={handleFlagPost}
              />
            ))}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Post"
        >
          <form onSubmit={handleCreatePost} className="space-y-4">
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              required
            />
            <Textarea
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content..."
              rows={6}
              required
            />

            {/* Info message for high school students */}
            {userType === "high_school" && (
              <div className="p-3 rounded-xl border border-[color-mix(in_oklch,var(--brand-blue)_40%,var(--border))] bg-[color-mix(in_oklch,var(--brand-blue)_16%,transparent)]">
                <p className="text-sm text-[var(--brand-blue-strong)]">
                  ℹ️ Your posts will be anonymous to protect your privacy.
                </p>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Post</Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
