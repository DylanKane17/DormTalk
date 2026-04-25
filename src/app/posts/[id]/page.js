"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Textarea from "../../components/Textarea";
import Alert from "../../components/Alert";
import VoteButtons from "../../components/VoteButtons";
import CommentVoteButtons from "../../components/CommentVoteButtons";
import { getPostWithCommentsAction } from "../../actions/postActions";
import { createCommentAction } from "../../actions/commentActions";

export default function PostDetailPage() {
  const params = useParams();
  const postId = params?.id; // Safely get the ID

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [alert, setAlert] = useState(null);

  // 1. Defined with useCallback to prevent infinite re-renders
  const loadPost = useCallback(async () => {
    if (!postId) return;

    setLoading(true);
    const result = await getPostWithCommentsAction(postId);

    if (result.success) {
      setPost(result.data);
    } else {
      setAlert({ type: "error", message: result.message });
    }
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    const formData = new FormData();
    formData.append("content", commentContent);

    const result = await createCommentAction(postId, formData);

    if (result.success) {
      setAlert({ type: "success", message: "Comment posted!" });
      setCommentContent("");
      loadPost(); // Refresh the comments list
    } else {
      setAlert({ type: "error", message: result.message });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 px-4 flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Loading post details...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-400 mb-4">Post not found</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
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

        {/* POST SECTION */}
        <Card className="mb-8 border-l-4 border-blue-500">
          <h1 className="text-3xl font-bold mb-2 text-white">{post.title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            {post.author?.id ? (
              <Link
                href={`/profile/${post.author.id}`}
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                @{post.author.username}
              </Link>
            ) : (
              <span className="text-blue-400 font-semibold">@anonymous</span>
            )}
            <span>•</span>
            <span className="bg-gray-800 px-2 py-0.5 rounded text-xs">
              {post.author?.school || "Unknown School"}
            </span>
            <span>•</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap mb-4">
            {post.content}
          </p>

          {/* Voting buttons for the post */}
          <div className="pt-4 border-t border-gray-700">
            <VoteButtons postId={post.id} initialScore={0} />
          </div>
        </Card>

        {/* COMMENTS SECTION */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
            Comments
            <span className="text-sm bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
              {post.comments?.length || 0}
            </span>
          </h2>

          <Card className="mb-8 bg-gray-800/50 border-gray-700">
            <h3 className="font-semibold mb-3 text-white">
              Join the conversation
            </h3>
            <form onSubmit={handleCreateComment} className="space-y-4">
              <Textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Remember to be respectful..."
                rows={3}
                required
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={!commentContent.trim()}>
                  Post Comment
                </Button>
              </div>
            </form>
          </Card>

          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-4">
              {post.comments.map((comment) => (
                <Card
                  key={comment.id}
                  className="bg-gray-800/30 border-gray-800"
                >
                  <div className="flex justify-between items-start mb-2">
                    {comment.author?.id ? (
                      <Link
                        href={`/profile/${comment.author.id}`}
                        className="text-sm font-medium text-blue-400 hover:text-blue-300"
                      >
                        @{comment.author.username}
                      </Link>
                    ) : (
                      <span className="text-sm font-medium text-blue-400">
                        @anonymous
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-3">{comment.content}</p>

                  {/* Voting buttons for comments */}
                  <div className="pt-2 border-t border-gray-700/50">
                    <CommentVoteButtons
                      commentId={comment.id}
                      initialScore={0}
                    />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-lg">
              <p className="text-gray-500">No comments yet. Start the talk!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
