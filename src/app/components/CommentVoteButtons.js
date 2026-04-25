"use client";

import { useState, useEffect } from "react";
import {
  upvoteCommentAction,
  downvoteCommentAction,
  removeCommentVoteAction,
  getUserCommentVoteAction,
  getCommentVoteStatsAction,
} from "../actions/voteActions";

export default function CommentVoteButtons({ commentId, initialScore = 0 }) {
  const [userVote, setUserVote] = useState(null); // null, 1 (upvote), or -1 (downvote)
  const [score, setScore] = useState(initialScore);
  const [loading, setLoading] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // Load user's current vote and vote stats on mount
  useEffect(() => {
    async function loadVoteData() {
      setIsLoadingInitial(true);

      // Get user's vote
      const voteResult = await getUserCommentVoteAction(commentId);
      if (voteResult.success && voteResult.data) {
        setUserVote(voteResult.data.vote_type);
      }

      // Get vote stats
      const statsResult = await getCommentVoteStatsAction(commentId);
      if (statsResult.success && statsResult.data) {
        setScore(statsResult.data.score);
      }

      setIsLoadingInitial(false);
    }

    loadVoteData();
  }, [commentId]);

  const handleUpvote = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (userVote === 1) {
        // Remove upvote
        const result = await removeCommentVoteAction(commentId);
        if (result.success) {
          setUserVote(null);
          setScore((prev) => prev - 1);
        }
      } else if (userVote === -1) {
        // Change from downvote to upvote
        const result = await upvoteCommentAction(commentId);
        if (result.success) {
          setUserVote(1);
          setScore((prev) => prev + 2); // Remove -1 and add +1
        }
      } else {
        // Add upvote
        const result = await upvoteCommentAction(commentId);
        if (result.success) {
          setUserVote(1);
          setScore((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownvote = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (userVote === -1) {
        // Remove downvote
        const result = await removeCommentVoteAction(commentId);
        if (result.success) {
          setUserVote(null);
          setScore((prev) => prev + 1);
        }
      } else if (userVote === 1) {
        // Change from upvote to downvote
        const result = await downvoteCommentAction(commentId);
        if (result.success) {
          setUserVote(-1);
          setScore((prev) => prev - 2); // Remove +1 and add -1
        }
      } else {
        // Add downvote
        const result = await downvoteCommentAction(commentId);
        if (result.success) {
          setUserVote(-1);
          setScore((prev) => prev - 1);
        }
      }
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = () => {
    if (score > 0) return "text-green-400";
    if (score < 0) return "text-red-400";
    return "text-gray-400";
  };

  if (isLoadingInitial) {
    return (
      <div className="flex items-center gap-1">
        <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
        <div className="w-6 h-5 bg-gray-700 rounded animate-pulse"></div>
        <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleUpvote}
        disabled={loading}
        className={`p-1 rounded transition-all ${
          userVote === 1
            ? "bg-green-600 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
        } ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}`}
        title="Upvote"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <span
        className={`font-semibold text-sm min-w-[1.5rem] text-center ${getScoreColor()}`}
      >
        {score}
      </span>

      <button
        onClick={handleDownvote}
        disabled={loading}
        className={`p-1 rounded transition-all ${
          userVote === -1
            ? "bg-red-600 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
        } ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}`}
        title="Downvote"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
