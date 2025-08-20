"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export default function LikeButton({
  postId,
  initialLikes,
}: {
  postId: string;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes ?? 0);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    // optimistic update
    const prev = likes;
    setLikes((n) => n + 1);

    try {
      const res = await fetch(`/api/likes/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      if (typeof data.likes === "number") {
        setLikes(data.likes);
      } else {
        // fallback in case API returns something unexpected
        setLikes(prev + 1);
      }
    } catch (e) {
      console.error("Like failed", e);
      setLikes(prev); // revert optimistic update on error
      alert("Failed to like. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
      aria-label="Like"
    >
      <Heart className="h-5 w-5 text-red-500" />
      <span>{likes}</span>
    </button>
  );
}
