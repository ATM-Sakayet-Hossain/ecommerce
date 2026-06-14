"use client";

import Image from "next/image";
import Link from "next/link";
import { clientPath, publicRoutes } from "@/lib/routes";
import { formatPrice } from "@/components/UI/helper";

const formatSizeLabel = (size) =>
  size ? String(size).toUpperCase() : null;

export default function OrderLineItem({
  item,
  orderStatus,
  showReviewAction,
  onWriteReview,
}) {
  const title = item.productTitle || item.product?.title || "Product";
  const thumbnail = item.productThumbnail || item.product?.thumbnail;
  const slug = item.productSlug || item.product?.slug;
  const sizeLabel = formatSizeLabel(item.size);
  const canReview = showReviewAction && orderIsReviewable(orderStatus);

  return (
    <article className="flex gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
            No image
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            {slug ? (
              <Link
                href={clientPath(publicRoutes.shopDetail, { slug })}
                className="font-semibold text-slate-900 hover:text-emerald-700 line-clamp-2"
              >
                {title}
              </Link>
            ) : (
              <p className="font-semibold text-slate-900 line-clamp-2">{title}</p>
            )}
            {sizeLabel ? (
              <p className="mt-1 text-sm text-slate-500">Size: {sizeLabel}</p>
            ) : null}
            <p className="mt-1 text-sm text-slate-500">
              Qty: {item.quantity ?? 1}
            </p>
          </div>
          <p className="font-semibold text-emerald-700 shrink-0">
            {formatPrice(item.subtotal)}
          </p>
        </div>
        {canReview && onWriteReview ? (
          <button
            type="button"
            onClick={() => onWriteReview(item)}
            className="mt-2 text-sm font-semibold uppercase tracking-wide text-teal-600 hover:text-teal-700"
          >
            Write a review
          </button>
        ) : null}
      </div>
    </article>
  );
}

export function orderIsReviewable(status) {
  return ["delivered", "shipped", "confirmed"].includes(status);
}
