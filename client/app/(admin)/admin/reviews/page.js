"use client";

import { useGetReviewsQuery } from "@/app/(admin)/services/api";
import { apiClient } from "@/lib/apiClient";
import { API, apiPath } from "@/lib/routes";
import { formatDate } from "@/components/UI/helper";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MessageSquare, Star, CheckCircle2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminReviewsPage() {
  const [limit, setLimit] = useState(50);
  const [status, setStatus] = useState("pending");
  const [approvingId, setApprovingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const { data, isLoading, isError, refetch } = useGetReviewsQuery({
    limit,
    status,
  });
  const reviews = data?.data?.reviews ?? [];

  const handleApprove = async (reviewId) => {
    if (!reviewId) return;
    setApprovingId(reviewId);
    try {
      await apiClient.patch(apiPath(API.review.adminApprove, { reviewId }));
      toast.success("Review approved");
      refetch();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to approve review",
      );
    } finally {
      setApprovingId("");
    }
  };

  const handleSoftDelete = async (reviewId) => {
    if (!reviewId) return;
    const confirmed = window.confirm(
      "Soft delete this review? It will be hidden from public views but kept in the database.",
    );
    if (!confirmed) return;

    setDeletingId(reviewId);
    try {
      await apiClient.delete(apiPath(API.review.adminDeleteSoft, { reviewId }));
      toast.success("Review deleted");
      refetch();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete review",
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-linear-to-r from-slate-950 via-slate-900 to-emerald-900 p-6 text-white shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
          Reviews
        </p>
        <h1 className="mt-2 text-3xl font-black">Product reviews</h1>
        <p className="mt-2 text-sm text-slate-200/90">
          Fetched from{" "}
          <code className="rounded bg-white/10 px-1.5 text-xs">
            GET /review/admin/get
          </code>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-slate-600">Limit</label>
        <select
          value={String(limit)}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>

        <label className="text-sm text-slate-600">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="all">All</option>
        </select>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading reviews...</p>
      ) : isError ? (
        <p className="text-sm text-rose-600">Unable to load reviews.</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-slate-500">No reviews yet.</p>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <article
              key={review._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {review.product?.thumbnail ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                      <Image
                        src={review.product.thumbnail}
                        alt={review.product.title || "Product"}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  ) : null}
                  <div>
                    <Link
                      href={`/shop/${review.product?.slug || review.slug}`}
                      className="font-semibold text-slate-900 hover:text-emerald-700"
                    >
                      {review.product?.title || review.slug}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {review.user?.fullName || review.user?.email || "User"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-600">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-semibold">{review.rating}/5</span>
                </div>
              </div>
              {review.comment ? (
                <p className="mt-3 text-sm text-slate-700 flex gap-2">
                  <MessageSquare className="h-4 w-4 shrink-0 text-slate-400" />
                  {review.comment}
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-400">
                  {formatDate(review.createdAt)}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {review.isDeleted ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      Deleted
                    </span>
                  ) : !review.isApproved ? (
                    <button
                      type="button"
                      onClick={() => handleApprove(review._id)}
                      disabled={approvingId === review._id}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {approvingId === review._id ? "Approving..." : "Approve"}
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                      Approved
                    </span>
                  )}
                  {!review.isApproved && !review.isDeleted ? (
                    <button
                      type="button"
                      onClick={() => handleSoftDelete(review._id)}
                      disabled={deletingId === review._id}
                      className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingId === review._id
                        ? "Deleting..."
                        : "Soft delete"}
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
