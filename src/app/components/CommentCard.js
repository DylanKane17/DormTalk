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
    <Card className="ui-gradient-ring">
      {showPost && comment.post && (
        <div className="mb-3 pb-3 border-b border-[var(--border)]">
          <Link href={`/posts/${comment.post.id}`}>
            <p className="text-sm text-[var(--text-tertiary)]">
              On post:{" "}
              <span className="text-[var(--brand-blue)] hover:underline">
                {comment.post.title}
              </span>
            </p>
          </Link>
        </div>
      )}

      <p className="text-[var(--text-secondary)] mb-3">{comment.content}</p>

      <p className="text-sm text-[var(--text-tertiary)]">
        By{" "}
        {comment.author?.user_type === "high_school" ? (
          <span className="text-[var(--text-secondary)]">
            {(() => {
              const parts = [];
              if (comment.author?.intended_major) {
                parts.push(`Interested in ${comment.author.intended_major}`);
              }
              if (comment.author?.interests) {
                parts.push(comment.author.interests);
              }
              return parts.length > 0
                ? parts.join(" • ")
                : "High School Student";
            })()}
          </span>
        ) : comment.author?.id ? (
          <Link
            href={`/profile/${comment.author.id}`}
            className="text-[var(--brand-blue)] hover:text-[var(--brand-blue-strong)]"
          >
            @{comment.author.username}
          </Link>
        ) : (
          <span>@Unknown</span>
        )}{" "}
        • {new Date(comment.created_at).toLocaleDateString()}
      </p>

      {showActions && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--border)]">
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
