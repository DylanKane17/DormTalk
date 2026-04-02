"use client";

import Card from "./Card";
import Button from "./Button";
import Link from "next/link";

export default function PostCard({
  post,
  onEdit,
  onDelete,
  showActions = false,
  showComments = false,
}) {
  return (
    <Card className="hover:shadow-lg hover:shadow-cyan-900/30 transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <Link href={`/posts/${post.id}`}>
            <h3 className="text-xl font-semibold text-white hover:text-cyan-400 cursor-pointer">
              {post.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-400 mt-1">
            By {post.user?.email || "Unknown"} •{" "}
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <p className="text-gray-300 mb-4 line-clamp-3">{post.content}</p>

      {showComments && post.comments && (
        <p className="text-sm text-cyan-400 mb-3">
          💬{" "}
          {Array.isArray(post.comments)
            ? post.comments.length
            : post.comments[0]?.count || 0}{" "}
          comments
        </p>
      )}

      {showActions && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
          <Button variant="secondary" onClick={() => onEdit(post)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => onDelete(post.id)}>
            Delete
          </Button>
        </div>
      )}
    </Card>
  );
}
