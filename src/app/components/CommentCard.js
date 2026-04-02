"use client";

import Card from "./Card";
import Button from "./Button";
import Link from "next/link";

export default function CommentCard({
  comment,
  onEdit,
  onDelete,
  showActions = false,
  showPost = false,
}) {
  return (
    <Card className="hover:shadow-lg hover:shadow-cyan-900/30 transition-shadow">
      {showPost && comment.post && (
        <div className="mb-3 pb-3 border-b border-gray-700">
          <Link href={`/posts/${comment.post.id}`}>
            <p className="text-sm text-gray-400">
              On post:{" "}
              <span className="text-cyan-400 hover:underline">
                {comment.post.title}
              </span>
            </p>
          </Link>
        </div>
      )}

      <p className="text-gray-300 mb-3">{comment.content}</p>

      <p className="text-sm text-gray-400">
        By {comment.user?.email || "Unknown"} •{" "}
        {new Date(comment.created_at).toLocaleDateString()}
      </p>

      {showActions && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
          <Button variant="secondary" onClick={() => onEdit(comment)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => onDelete(comment.id)}>
            Delete
          </Button>
        </div>
      )}
    </Card>
  );
}
