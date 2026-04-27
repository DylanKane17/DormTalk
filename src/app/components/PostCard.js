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
  const commentCount =
    Array.isArray(post.comments) && post.comments[0]?.count !== undefined
      ? post.comments[0].count
      : Array.isArray(post.comments)
        ? post.comments.length
        : 0;

  return (
    <Card className="ui-gradient-ring">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-[linear-gradient(135deg,var(--brand-blue),var(--brand-green))] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-[var(--shadow-sm)]">
            {post.is_anonymous
              ? "?"
              : post.author?.username
                ? post.author.username.charAt(0).toUpperCase()
                : "U"}
          </div>

          {/* Author & Time */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {post.is_anonymous ? (
                <span className="text-sm font-medium text-[var(--text-tertiary)] italic">
                  {(() => {
                    const info = [
                      post.author?.hometown,
                      post.author?.intended_major,
                      post.author?.interests,
                    ]
                      .filter(Boolean)
                      .join(" • ");
                    return info || "High School Student";
                  })()}
                </span>
              ) : post.author?.id ? (
                <Link
                  href={`/profile/${post.author.id}`}
                  className="text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--brand-blue-strong)] transition-colors"
                >
                  @{post.author.username}
                </Link>
              ) : (
                <span className="text-sm font-medium text-[var(--text-tertiary)]">
                  @Unknown
                </span>
              )}
              <span className="text-[var(--text-tertiary)]">•</span>
              <span className="text-sm text-[var(--text-tertiary)]">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* More Options */}
          {(showActions || showFlag) && (
            <button className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] p-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <Link href={`/posts/${post.id}`} className="block mb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 hover:text-[var(--brand-blue-strong)] transition-colors cursor-pointer">
          {post.title}
        </h3>
        <p className="text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
          {post.content}
        </p>
      </Link>

      {/* Actions Bar */}
      <div className="flex items-center gap-6 pt-3 border-t border-[var(--border)]">
        {/* Voting */}
        {showVoting && (
          <div className="flex items-center">
            <VoteButtons postId={post.id} initialScore={0} />
          </div>
        )}

        {/* Comments */}
        {showComments && (
          <Link
            href={`/posts/${post.id}`}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--brand-blue-strong)] transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-sm font-medium">{commentCount}</span>
          </Link>
        )}

        {/* Share */}
        <button className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--brand-blue-strong)] transition-colors ml-auto">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </button>
      </div>

      {/* Action Buttons (Edit/Delete) */}
      {showActions && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--border)]">
          <Button
            variant="secondary"
            onClick={() => onEdit(post)}
            className="text-sm"
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={() => onDelete(post.id)}
            className="text-sm"
          >
            Delete
          </Button>
        </div>
      )}

      {/* Flag Button */}
      {showFlag && (
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <Button
            variant="outline"
            onClick={() => onFlag && onFlag(post.id)}
            className="text-sm"
          >
            🚩 Flag Post
          </Button>
        </div>
      )}
    </Card>
  );
}
