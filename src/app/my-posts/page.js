"use client";

import { useState, useEffect } from "react";
import Button from "../components/Button";
import PostCard from "../components/PostCard";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Alert from "../components/Alert";
import {
  getPostsByUserAction,
  createPostAction,
  updatePostAction,
  deletePostAction,
} from "../actions/postActions";

export default function MyPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [alert, setAlert] = useState(null);

  const loadPosts = async () => {
    setLoading(true);
    const result = await getPostsByUserAction();
    if (result.success) {
      setPosts(result.data || []);
    } else {
      setAlert({ type: "error", message: result.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

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

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    const result = await updatePostAction(editingPost.id, formData);
    if (result.success) {
      setAlert({ type: "success", message: result.message });
      setIsModalOpen(false);
      setEditingPost(null);
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

  const openEditModal = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingPost(null);
    setTitle("");
    setContent("");
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Posts</h1>
          <Button onClick={openCreateModal}>Create Post</Button>
        </div>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {loading ? (
          <p className="text-center text-gray-400">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-400">
            You haven&apos;t created any posts yet.
          </p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                showActions={true}
                showComments={true}
                onEdit={openEditModal}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPost(null);
          }}
          title={editingPost ? "Edit Post" : "Create New Post"}
        >
          <form
            onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
            className="space-y-4"
          >
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
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingPost(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingPost ? "Update Post" : "Create Post"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
