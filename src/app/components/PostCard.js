"use client";

import Card from "./Card";
import Button from "./Button";
import Link from "next/link";
import VoteButtons from "./VoteButtons";

export default function PostCard({
  post,
  onEdit,
  onDelete,
  onFlag,
  showActions = false,
  showComments = false,
  showFlag = false,
  showVoting = true,
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
            By{" "}
            {post.is_anonymous ? (
              <span className="text-gray-500 italic">Anonymous</span>
            ) : post.author?.id ? (
              <Link
                href={`/profile/${post.author.id}`}
                className="text-cyan-400 hover:text-cyan-300"
              >
                @{post.author.username}
              </Link>
            ) : (
              <span>@Unknown</span>
            )}{" "}
            • {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <p className="text-gray-300 mb-4 line-clamp-3">{post.content}</p>

      {showVoting && (
        <div className="mb-4">
          <VoteButtons postId={post.id} initialScore={0} />
        </div>
      )}

      {showComments && post.comments && (
        <p className="text-sm text-cyan-400 mb-3">
          💬{" "}
          {Array.isArray(post.comments) && post.comments[0]?.count !== undefined
            ? post.comments[0].count
            : Array.isArray(post.comments)
              ? post.comments.length
              : 0}{" "}
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

      {showFlag && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
          <Button
            variant="secondary"
            onClick={() => onFlag && onFlag(post.id)}
            size="sm"
          >
            🚩 Flag Post
          </Button>
        </div>
      )}
    </Card>
  );
}
