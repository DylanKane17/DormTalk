"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import PostCard from "../components/PostCard";
import Card from "../components/Card";
import Modal from "../components/Modal";
import Alert from "../components/Alert";
import {
  getFlaggedPostsAction,
  getFlaggedCommentsAction,
  unflagPostAction,
  unflagCommentAction,
  adminDeleteCommentAction,
  hidePostAction,
  unhidePostAction,
} from "../actions/moderationActions";
import { adminDeletePostAction } from "../actions/adminPostActions";
import { checkIsAdmin } from "../utils/adminCheck";

export default function ModerationPage() {
  const [flaggedPosts, setFlaggedPosts] = useState([]);
  const [flaggedComments, setFlaggedComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadFlaggedPosts = async () => {
    setLoading(true);
    const result = await getFlaggedPostsAction(50);
    if (result.success) {
      setFlaggedPosts(result.data || []);
    } else {
      setAlert({ type: "error", message: result.message });
    }
    setLoading(false);
  };

  const loadFlaggedComments = async () => {
    const result = await getFlaggedCommentsAction(50);
    if (result.success) {
      setFlaggedComments(result.data || []);
    } else {
      setAlert({ type: "error", message: result.message });
    }
  };

  useEffect(() => {
    loadFlaggedPosts();
    loadFlaggedComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUnflag = async (postId) => {
    const result = await unflagPostAction(postId);
    if (result.success) {
      setAlert({ type: "success", message: result.message });
      loadFlaggedPosts();
    } else {
      setAlert({ type: "error", message: result.message });
    }
  };

  const handleHide = async (postId) => {
    if (!confirm("Are you sure you want to hide this post?")) return;

    const result = await hidePostAction(postId);
    if (result.success) {
      setAlert({ type: "success", message: result.message });
      loadFlaggedPosts();
    } else {
      setAlert({ type: "error", message: result.message });
    }
  };

  const handleUnhide = async (postId) => {
    const result = await unhidePostAction(postId);
    if (result.success) {
      setAlert({ type: "success", message: result.message });
      loadFlaggedPosts();
    } else {
      setAlert({ type: "error", message: result.message });
    }
  };

  const handleDelete = async (postId) => {
    if (!confirm("Are you sure you want to permanently delete this post?"))
      return;

    const result = await adminDeletePostAction(postId);
    if (result.success) {
      setAlert({ type: "success", message: result.message });
      loadFlaggedPosts();
    } else {
      setAlert({ type: "error", message: result.message });
    }
  };

  const handleUnflagComment = async (commentId) => {
    const result = await unflagCommentAction(commentId);
    if (result.success) {
      setAlert({ type: "success", message: result.message });
      loadFlaggedComments();
    } else {
      setAlert({ type: "error", message: result.message });
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to permanently delete this comment?"))
      return;

    const result = await adminDeleteCommentAction(commentId);
    if (result.success) {
      setAlert({ type: "success", message: result.message });
      loadFlaggedComments();
    } else {
      setAlert({ type: "error", message: result.message });
    }
  };

  const openPostDetails = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Moderation Dashboard
          </h1>
          <Button
            onClick={() => {
              loadFlaggedPosts();
              loadFlaggedComments();
            }}
            variant="secondary"
          >
            Refresh All
          </Button>
        </div>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {loading ? (
          <p className="text-center text-gray-400">Loading flagged posts...</p>
        ) : flaggedPosts.length === 0 ? (
          <Card>
            <p className="text-center text-gray-400">
              No flagged posts at this time. Great job keeping the community
              clean!
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4 mb-4">
              <p className="text-yellow-400 font-medium">
                ⚠️ {flaggedPosts.length} flagged post
                {flaggedPosts.length !== 1 ? "s" : ""} requiring review
              </p>
            </div>

            {flaggedPosts.map((post) => (
              <Card key={post.id} className="border-l-4 border-yellow-500">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-300 mb-2 line-clamp-3">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>By {post.author?.username || "Unknown"}</span>
                        <span>•</span>
                        <span>
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-900/20 border border-red-600 rounded p-3">
                    <p className="text-red-400 text-sm">
                      <strong>Flag Reason:</strong> {post.flag_reason}
                    </p>
                    <p className="text-red-400 text-sm mt-1">
                      <strong>Flagged by:</strong>{" "}
                      {post.flagger?.username || "Unknown"}
                    </p>
                    <p className="text-red-400 text-sm mt-1">
                      <strong>Flagged at:</strong>{" "}
                      {new Date(post.flagged_at).toLocaleString()}
                    </p>
                  </div>

                  {post.is_hidden && (
                    <div className="bg-gray-800 border border-gray-600 rounded p-2">
                      <p className="text-gray-400 text-sm">
                        🔒 This post is currently hidden from public view
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={() => openPostDetails(post)}
                      variant="secondary"
                      size="sm"
                    >
                      View Full Post
                    </Button>
                    <Button
                      onClick={() => handleUnflag(post.id)}
                      variant="success"
                      size="sm"
                    >
                      Unflag (Approve)
                    </Button>
                    {post.is_hidden ? (
                      <Button
                        onClick={() => handleUnhide(post.id)}
                        variant="secondary"
                        size="sm"
                      >
                        Unhide Post
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleHide(post.id)}
                        variant="secondary"
                        size="sm"
                      >
                        Hide Post
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDelete(post.id)}
                      variant="danger"
                      size="sm"
                    >
                      Delete Post
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* FLAGGED COMMENTS SECTION */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Flagged Comments
          </h2>
          {flaggedComments.length === 0 ? (
            <Card>
              <p className="text-center text-gray-400">
                No flagged comments at this time.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4 mb-4">
                <p className="text-yellow-400 font-medium">
                  ⚠️ {flaggedComments.length} flagged comment
                  {flaggedComments.length !== 1 ? "s" : ""} requiring review
                </p>
              </div>

              {flaggedComments.map((comment) => (
                <Card key={comment.id} className="border-l-4 border-orange-500">
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-300 mb-2">{comment.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>By {comment.author?.username || "Unknown"}</span>
                        <span>•</span>
                        <span>
                          On post: {comment.post?.title || "Unknown Post"}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="bg-red-900/20 border border-red-600 rounded p-3">
                      <p className="text-red-400 text-sm">
                        <strong>Flag Reason:</strong> {comment.flag_reason}
                      </p>
                      <p className="text-red-400 text-sm mt-1">
                        <strong>Flagged at:</strong>{" "}
                        {new Date(comment.flagged_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Button
                        onClick={() => handleUnflagComment(comment.id)}
                        variant="success"
                        size="sm"
                      >
                        Unflag (Approve)
                      </Button>
                      <Button
                        onClick={() => handleDeleteComment(comment.id)}
                        variant="danger"
                        size="sm"
                      >
                        Delete Comment
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Post Details"
        >
          {selectedPost && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {selectedPost.title}
                </h3>
                <p className="text-gray-300 whitespace-pre-wrap">
                  {selectedPost.content}
                </p>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <p className="text-sm text-gray-400">
                  <strong>Author:</strong>{" "}
                  {selectedPost.author?.username || "Unknown"}
                </p>
                <p className="text-sm text-gray-400">
                  <strong>School:</strong>{" "}
                  {selectedPost.author?.school || "Unknown"}
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Posted:</strong>{" "}
                  {new Date(selectedPost.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
