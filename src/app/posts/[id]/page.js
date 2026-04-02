"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Textarea from "../../components/Textarea";
import Alert from "../../components/Alert";
import { getPostWithCommentsAction } from "../../actions/postActions";
import { createCommentAction } from "../../actions/commentActions";

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.id;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [alert, setAlert] = useState(null);

  const loadPost = async () => {
    setLoading(true);
    const result = await getPostWithCommentsAction(postId);
    if (result.success) {
      setPost(result.data);
    } else {
      setAlert({ type: "error", message: result.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPost();
  }, [postId, loadPost]);

  const handleCreateComment = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", commentContent);

    const result = await createCommentAction(postId, formData);
    if (result.success) {
      setAlert({ type: "success", message: result.message });
      setCommentContent("");
      loadPost();
    } else {
      setAlert({ type: "error", message: result.message });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-400">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-red-400">Post not found</p>
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

        <Card className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-white">{post.title}</h1>
          <p className="text-sm text-gray-400 mb-6">
            By {post.user?.email || "Unknown"} •{" "}
            {new Date(post.created_at).toLocaleDateString()}
          </p>
          <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>
        </Card>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Comments ({post.comments?.length || 0})
          </h2>

          <Card className="mb-6">
            <h3 className="font-semibold mb-3 text-white">Add a Comment</h3>
            <form onSubmit={handleCreateComment} className="space-y-4">
              <Textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write your comment..."
                rows={4}
                required
              />
              <Button type="submit">Post Comment</Button>
            </form>
          </Card>

          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-4">
              {post.comments.map((comment) => (
                <Card key={comment.id}>
                  <p className="text-gray-300 mb-3">{comment.content}</p>
                  <p className="text-sm text-gray-400">
                    By {comment.user?.email || "Unknown"} •{" "}
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
