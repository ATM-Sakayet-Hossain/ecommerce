"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { API, apiPath, clientPath, publicRoutes } from "@/lib/routes";
import { formatDate, formatVariantSize } from "@/components/UI/helper";
import ReviewFormModal from "@/components/ecommerce/ReviewFormModal";

const TABS = {
  pending: "pending",
  history: "history",
};

export default function AccountReviewsPanel() {
  const [activeTab, setActiveTab] = useState(TABS.pending);
  const [reviews, setReviews] = useState([]);
  const [pending, setPending] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewTarget, setReviewTarget] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [reviewsPayload, pendingPayload] = await Promise.all([
        apiClient.get(apiPath(API.review.mine)),
        apiClient.get(apiPath(API.review.pending)),
      ]);
      setReviews(reviewsPayload?.data?.reviews ?? []);
      setPending(pendingPayload?.data?.pending ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load reviews");
      setReviews([]);
      setPending([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleReviewSuccess = () => {
    loadData();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">My Reviews</h2>
        <p className="mt-1 text-sm text-slate-600">
          Review products you have purchased, or view your review history.
        </p>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab(TABS.pending)}
          className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition ${
            activeTab === TABS.pending
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          To Be Reviewed
          {pending.length > 0 ? (
            <span className="ml-1.5 rounded-full bg-teal-100 px-2 py-0.5 text-xs text-teal-800">
              {pending.length}
            </span>
          ) : null}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab(TABS.history)}
          className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition ${
            activeTab === TABS.history
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          History
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <p className="px-5 py-10 text-center text-sm text-slate-500">
            Loading reviews...
          </p>
        ) : error ? (
          <p className="px-5 py-10 text-center text-sm text-rose-600">
            {error}
          </p>
        ) : activeTab === TABS.pending ? (
          !pending.length ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-slate-600">
                No products waiting for a review.
              </p>
              <Link
                href={publicRoutes.orders.path}
                className="mt-3 inline-block text-sm font-semibold text-teal-600"
              >
                View your orders
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {pending.map((entry) => {
                const product = entry.product;
                const slug = product?.slug;
                const sizeLabel = formatVariantSize(entry.size);
                return (
                  <li
                    key={`${product?._id}-${entry.orderNumber}`}
                    className="flex gap-4 px-5 py-4"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {product?.thumbnail ? (
                        <Image
                          src={product.thumbnail}
                          alt={product.title || "Product"}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      {slug ? (
                        <Link
                          href={clientPath(publicRoutes.shopDetail, { slug })}
                          className="font-semibold text-slate-900 hover:text-teal-700"
                        >
                          {product?.title || "Product"}
                        </Link>
                      ) : (
                        <p className="font-semibold text-slate-900">
                          {product?.title || "Product"}
                        </p>
                      )}
                      {sizeLabel ? (
                        <p className="mt-1 text-sm text-slate-500">
                          Size: {sizeLabel}
                        </p>
                      ) : null}
                      <p className="mt-1 text-xs text-slate-500">
                        Order {entry.orderNumber} ·{" "}
                        {formatDate(entry.purchasedAt)}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setReviewTarget({
                            slug,
                            title: product?.title,
                          })
                        }
                        className="mt-2 text-sm font-semibold uppercase tracking-wide text-teal-600 hover:text-teal-700"
                      >
                        Write a review
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )
        ) : !reviews.length ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-slate-600">
              You have not written any reviews yet.
            </p>
            <Link
              href={publicRoutes.shop.path}
              className="mt-3 inline-block text-sm font-semibold text-teal-600"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {reviews.map((review) => {
              const slug = review?.product?.slug;
              const productName =
                review?.product?.name || review?.product?.title || "Product";
              return (
                <li key={review._id} className="px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      {slug ? (
                        <Link
                          href={clientPath(publicRoutes.shopDetail, { slug })}
                          className="font-semibold text-slate-900 hover:text-teal-700"
                        >
                          {productName}
                        </Link>
                      ) : (
                        <p className="font-semibold text-slate-900">
                          {productName}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-slate-600 line-clamp-3">
                        {review.comment || review.review || "—"}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        review.isApproved
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {review.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  {review.rating != null ? (
                    <p className="mt-2 text-sm text-amber-600">
                      {"★".repeat(Math.min(5, Math.max(0, review.rating)))}
                      {"☆".repeat(5 - Math.min(5, Math.max(0, review.rating)))}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <ReviewFormModal
        open={Boolean(reviewTarget)}
        onClose={() => setReviewTarget(null)}
        slug={reviewTarget?.slug}
        productTitle={reviewTarget?.title}
        onSuccess={handleReviewSuccess}
      />
    </div>
  );
}
