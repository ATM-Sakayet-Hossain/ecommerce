"use client";

import { useState } from "react";
import { Box, Rating } from "@mui/material";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/apiClient";
import { API, apiPath } from "@/lib/routes";

export default function ReviewFormModal({
  open,
  onClose,
  slug,
  productTitle,
  onSuccess,
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!slug) {
      toast.error("Product not found.");
      return;
    }
    if (rating < 1) {
      toast.error("Please select a rating.");
      return;
    }
    setIsSubmitting(true);
    try {
      await apiClient.post(apiPath(API.review.create, { slug }), {
        rating,
        comment: comment.trim(),
      });
      toast.success("Review submitted. It will appear after approval.");
      setRating(0);
      setComment("");
      onSuccess?.();
      onClose?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-form-title"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="review-form-title" className="text-lg font-bold text-slate-900">
          Write a review
        </h2>
        {productTitle ? (
          <p className="text-sm text-slate-600">{productTitle}</p>
        ) : null}
        <div>
          <p className="text-sm text-slate-600 mb-1">Rating</p>
          <Box>
            <Rating
              name="review-rating"
              value={rating}
              onChange={(_, value) => setRating(value ?? 0)}
            />
          </Box>
        </div>
        <label className="block text-sm">
          <span className="text-slate-600">Comment (optional)</span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
            placeholder="Share your experience with this product"
          />
        </label>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit review"}
          </button>
        </div>
      </form>
    </div>
  );
}
