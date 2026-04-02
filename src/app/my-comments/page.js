"use client";

import { useState, useEffect } from "react";
import CommentCard from "../components/CommentCard";
import Modal from "../components/Modal";
import Textarea from "../components/Textarea";
import Button from "../components/Button";
import Alert from "../components/Alert";
import {
  getCommentsByUserAction,
  updateCommentAction,
  deleteCommentAction,
} from "../actions/commentActions";

export default function MyCommentsPage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [content, setContent] = useState("");
  const [alert, setAlert] = useState(null);

  const loadComments = async () => {
    setLoading(true);
    const result = await getCommentsByUserAction();
    if (result.success) {
      setComments(result.data || []);
    } else {
      setAlert({ type: "error", message: result.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleUpdateComment = async (e) => {
    e.preventDefault();

    // 1. Safety check: If for some reason editingComment became null, stop immediately
    if (!editingComment || !editingComment.id) {
      setAlert({ type: "error", message: "No comment selected for editing." });
      return;
    }

    // Store the ID in a local variable so it doesn't matter if state changes later
    const currentId = editingComment.id;

    const formData = new FormData();
    formData.append("content", content);

    // Use the local variable currentId instead of editingComment.id
    const result = await updateCommentAction(currentId, formData);

    if (result.success) {
      setAlert({ type: "success", message: result.message });
      setIsModalOpen(false);
      setEditingComment(null); // Now it's safe to clear this
      setContent("");
      loadComments();
    } else {
      setAlert({ type: "error", message: result.message });
    }
  };
  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    const result = await deleteCommentAction(commentId);
    if (result.success) {
      setAlert({ type: "success", message: result.message });
      loadComments();
    } else {
      setAlert({ type: "error", message: result.message });
    }
  };

  const openEditModal = (comment) => {
    setEditingComment(comment);
    setContent(comment.content);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">My Comments</h1>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {loading ? (
          <p className="text-center text-gray-400">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-400">
            You haven&apos;t made any comments yet.
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                showActions={true}
                showPost={true}
                onEdit={openEditModal}
                onDelete={handleDeleteComment}
              />
            ))}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingComment(null);
          }}
          title="Edit Comment"
        >
          <form onSubmit={handleUpdateComment} className="space-y-4">
            <Textarea
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Edit your comment..."
              rows={6}
              required
            />
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingComment(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Update Comment</Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
