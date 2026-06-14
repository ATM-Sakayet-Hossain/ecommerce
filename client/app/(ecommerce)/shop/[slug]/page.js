import Image from "next/image";
import React from "react";
import { notFound } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import { API, apiPath } from "@/lib/routes";
import { Box, Rating } from "@mui/material";
import PageContainer from "@/components/layout/PageContainer";
import ProductPurchase from "@/components/ecommerce/ProductPurchase";
import RelatedProducts from "@/components/ecommerce/RelatedProducts";
import ProductDetails from "@/components/ecommerce/ProductDetails";
import {
  formatPrice,
  getDiscountLabel,
  getProductRating,
  getSalePrice,
  hasDiscount,
  isInStock,
  getTotalStock,
} from "@/components/UI/helper";

async function fetchRelatedProducts(categoryId, currentSlug) {
  if (!categoryId) {
    return [];
  }
  try {
    const payload = await apiClient.get(
      `${apiPath(API.product.get)}?category=${categoryId}&limit=8`,
      { revalidate: 60 * 5 },
    );
    const products = payload?.data?.product ?? [];
    return products
      .filter((product) => product?.slug !== currentSlug)
      .slice(0, 5);
  } catch {
    return [];
  }
}

async function fetchProductReviews(slug) {
  if (!slug) {
    return [];
  }

  try {
    const payload = await apiClient.get(
      `${apiPath(API.review.get)}?slug=${encodeURIComponent(slug)}&limit=10`,
      { revalidate: 60 * 5 },
    );
    return payload?.data?.reviews ?? [];
  } catch {
    return [];
  }
}

export default async function Page({ params }) {
  const rawSlug = (await params)?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  if (!slug) {
    notFound();
  }

  const payload = await apiClient.get(apiPath(API.product.bySlug, { slug }), {
    revalidate: 60 * 5,
  });
  const data = payload?.data;
  if (!data) {
    notFound();
  }

  const categoryId = data?.category?._id ?? data?.category;
  const relatedProducts = await fetchRelatedProducts(categoryId, slug);
  const reviews = await fetchProductReviews(slug);
  const inStock = isInStock(data?.variants);
  const salePrice = getSalePrice(data);
  const discountLabel = getDiscountLabel(data);
  const rating = getProductRating(data);

  return (
    <PageContainer>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 max-w-6xl mx-auto">
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-md aspect-square">
            {data?.thumbnail ? (
              <Image
                src={data.thumbnail}
                alt={data?.title || "Product image"}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-2xl shadow-lg object-cover"
              />
            ) : null}
          </div>

          <div className="flex gap-3 mt-4 flex-wrap justify-center">
            {(data?.images ?? []).map((img, i) => (
              <div key={i} className="relative w-20 h-20">
                <Image
                  src={img}
                  fill
                  alt={`${data?.title || "Product"} thumbnail ${i + 1}`}
                  sizes="80px"
                  className="object-cover border rounded-xl cursor-pointer hover:border-green-500"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <span
            className={`px-3 py-1 rounded-full w-max text-sm ${
              inStock
                ? "bg-green-100 text-green-600"
                : "bg-pink-100 text-pink-600"
            }`}
          >
            {inStock ? "In stock" : "Out of stock"}
          </span>
          <div>
            <h4 className="text-xs font-normal text-secondary">
              {data?.category?.name || "Product"}
            </h4>
            <h1 className="text-2xl font-bold">{data?.title || "Product"}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Box>
              <Rating
                className="text-sm"
                name="product-rating"
                value={rating}
                readOnly
              />
            </Box>
            <span className="text-gray-600 text-sm">
              {data?.ratings?.count ?? 0} reviews
            </span>
          </div>
          <div className="flex items-baseline mb-3 flex-wrap gap-2">
            <span className="text-green-600 text-2xl font-bold">
              {formatPrice(salePrice)}
            </span>
            {hasDiscount(data) ? (
              <span className="text-gray-400 line-through text-base">
                {formatPrice(data?.price)}
              </span>
            ) : null}
            {discountLabel ? (
              <span className="text-gray-700 text-base font-semibold bg-amber-300 px-1 rounded-sm">
                {discountLabel} off
              </span>
            ) : null}
          </div>
          <p className="text-sm font-normal text-secondary">
            By <span className="text-brand">{data?.brand || "Brand"}</span>
          </p>
          <ProductPurchase
            productId={data?._id}
            variants={data?.variants ?? []}
            inStock={inStock}
          />

          <div className="p-4 mt-6 text-sm text-gray-600">
            <div className="flex gap-4 mb-4 flex-wrap">
              <p className="font-medium">Delivery: Standard shipping</p>
            </div>
            <div className="flex gap-4 mb-4 flex-wrap">
              <p className="font-medium">
                Tags: {Array.isArray(data?.tags) ? data.tags.join(", ") : "—"}
              </p>
              <p className="font-medium">
                Stock: {getTotalStock(data?.variants)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full p-6 border border-gray-400 rounded-lg shadow-md">
        <ProductDetails data={data} reviews={reviews} />
      </div>
      {relatedProducts.length > 0 ? (
        <div className="my-10 px-6">
          <h2 className="text-2xl font-bold text-start mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {relatedProducts.map((item) => (
              <RelatedProducts key={item._id || item.slug} data={item} />
            ))}
          </div>
        </div>
      ) : null}
    </PageContainer>
  );
}
