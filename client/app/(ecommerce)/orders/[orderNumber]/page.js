"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import OrderLineItem, {
  orderIsReviewable,
} from "@/components/ecommerce/OrderLineItem";
import ReviewFormModal from "@/components/ecommerce/ReviewFormModal";
import { apiClient } from "@/lib/apiClient";
import { API, apiPath, publicRoutes } from "@/lib/routes";
import {
  enrichOrderItemsClient,
  formatDate,
  formatPrice,
} from "@/components/UI/helper";
import { ArrowLeft } from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const orderNumber = decodeURIComponent(params?.orderNumber ?? "");
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewedSlugs, setReviewedSlugs] = useState(new Set());

  const loadOrder = useCallback(async () => {
    setIsLoading(true);
    try {
      const payload = await apiClient.get(
        apiPath(API.order.detail, { orderNumber }),
      );
      const match = payload?.data ?? null;
      setOrder(match);
      if (!match) setError("Order not found");
      else setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order");
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  }, [orderNumber]);

  const loadReviewedSlugs = useCallback(async () => {
    try {
      const payload = await apiClient.get(apiPath(API.review.mine));
      const reviews = payload?.data?.reviews ?? [];
      setReviewedSlugs(
        new Set(
          reviews
            .map((r) => r?.product?.slug || r?.slug)
            .filter(Boolean),
        ),
      );
    } catch {
      setReviewedSlugs(new Set());
    }
  }, []);

  useEffect(() => {
    if (orderNumber) {
      loadOrder();
      loadReviewedSlugs();
    }
  }, [orderNumber, loadOrder, loadReviewedSlugs]);

  const items = useMemo(
    () => enrichOrderItemsClient(order),
    [order],
  );

  const handleWriteReview = (item) => {
    const slug = item.productSlug || item.product?.slug;
    if (!slug) return;
    setReviewTarget({
      slug,
      title: item.productTitle || item.product?.title || "Product",
    });
  };

  const handleReviewSuccess = () => {
    if (reviewTarget?.slug) {
      setReviewedSlugs((prev) => new Set([...prev, reviewTarget.slug]));
    }
    loadReviewedSlugs();
  };

  if (isLoading) {
    return (
      <PageContainer className="py-12">
        <p className="text-center text-slate-600">Loading order...</p>
      </PageContainer>
    );
  }

  if (error || !order) {
    return (
      <PageContainer className="py-12 space-y-4">
        <Link
          href={publicRoutes.orders.path}
          className="inline-flex items-center gap-2 text-emerald-700 font-semibold hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>
        <p className="text-rose-600">{error || "Order not found"}</p>
      </PageContainer>
    );
  }

  const showReviewActions = orderIsReviewable(order.status);

  return (
    <PageContainer className="py-8 max-w-2xl mx-auto space-y-6">
      <Link
        href={publicRoutes.orders.path}
        className="inline-flex items-center gap-2 text-emerald-700 font-semibold hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to orders
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">
              {order.orderNumber}
            </h1>
            <p className="text-sm text-slate-500">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800 capitalize">
            {order.status}
          </span>
        </div>

        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Total</dt>
            <dd className="font-semibold text-emerald-700">
              {formatPrice(order.totalPrice)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Payment</dt>
            <dd className="font-medium capitalize">
              {order.payment?.method} · {order.payment?.status || "pending"}
            </dd>
          </div>
          {order.shippingAddress ? (
            <div className="sm:col-span-2">
              <dt className="text-slate-500">Shipping address</dt>
              <dd className="font-medium text-slate-800">
                {order.shippingAddress}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>

      {items.length > 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Items</h2>
          <div className="space-y-4">
            {items.map((item) => {
              const slug = item.productSlug || item.product?.slug;
              const alreadyReviewed = slug && reviewedSlugs.has(slug);
              return (
                <OrderLineItem
                  key={`${item.sku}-${item.product?._id ?? item.product}`}
                  item={item}
                  orderStatus={order.status}
                  showReviewAction={showReviewActions && !alreadyReviewed}
                  onWriteReview={handleWriteReview}
                />
              );
            })}
          </div>
        </div>
      ) : null}

      <ReviewFormModal
        open={Boolean(reviewTarget)}
        onClose={() => setReviewTarget(null)}
        slug={reviewTarget?.slug}
        productTitle={reviewTarget?.title}
        onSuccess={handleReviewSuccess}
      />
    </PageContainer>
  );
}
