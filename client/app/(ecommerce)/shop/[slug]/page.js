import Image from "next/image";
import React from "react";
import { notFound } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import { Box, Rating } from "@mui/material";
import PageContainer from "@/components/layout/PageContainer";

export default async function Page({ params }) {
  const rawSlug = (await params)?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  if (!slug) {
    notFound();
  }
  const payload = await apiClient.get(`/product/${slug}`, {
    revalidate: 60 * 5,
  });
  const data = payload?.data;
  console.log(data?.images);
  if (!data) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 max-w-6xl mx-auto">
        <div className="flex flex-col items-center">
          <Image
            width={150}
            height={150}
            src={data?.thumbnail}
            alt={data?.title || "Product image"}
            className="rounded-2xl shadow-lg w-130 h-120 object-cover"
          />

          <div className="flex gap-3 mt-4">
            {(data?.images ?? []).map((img, i) => (
              <Image
                width={100}
                height={100}
                key={i}
                src={img}
                alt="thumbnail"
                className="w-30 h-30 object-cover border rounded-xl cursor-pointer hover:border-green-500"
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <span
            className={`px-3 py-1 rounded-full w-max text-sm ${data?.variants.stock ? "bg-pink-100 text-pink-600" : "bg-green-100 text-green-600"}`}
          >
            {data?.variants.stock ? "stock Out" : "in Stock"}
          </span>
          <div>
            <h4 className="text-xs font-normal text-secondary">
              {data?.category?.name || "Product"}
            </h4>
            <h1 className="text-2xl font-bold">{data?.title || "Product"}</h1>
          </div>
          {/* Ratings */}
          <div className="flex items-center gap-2">
            <Box>
              <Rating
                className="text-sm"
                name="simple-controlled"
                value={data?.rating || 0}
              />
            </Box>
            <span className="text-gray-600 text-sm">
              {/* {(data?.reviews ?? []).length > 0
                ? (data?.reviews ?? []).length
                : "0"}{" "} */}
              Reviews
            </span>
          </div>
          {/* Price */}
          <div className="flex items-baseline mb-3">
            <span className="text-green-600 text-2xl font-bold mr-2">৳</span>
            <span className="text-green-600 text-2xl font-bold mr-2">
              {data?.price - data?.discountPercentage ||
                data?.discountPrice ||
                null}
            </span>
            <span className="text-gray-400 line-through text-base mr-3">
              {data?.price}
            </span>
            {data?.discountPercentage || data?.discountPrice ? (
              <span className="text-gray-700 text-base font-semibold bg-amber-300 px-1 rounded-sm">
                {data?.discountPercentage + "%" ||
                  data?.discountPrice + "TK" ||
                  null}
                Off
              </span>
            ) : (
              ""
            )}
          </div>
          <p className="text-sm font-normal text-secondary">
            By <span className="text-brand">{data?.brand || "Brand"}</span>
          </p>
          <p className="text-gray-600">{data?.description || ""}</p>
          <div className="flex items-center gap-2">
            <h3 className="font-medium mb-2">Size / Weight:</h3>
            <div className="flex gap-2">
              <button className="px-4 rounded-lg border bg-green-600 text-white border-green-600">
                {data?.variants?.[0]?.size || "N/A"}
              </button>
            </div>
          </div>

          {/* Quantity + Add to Cart */}
          {/* <Counter /> */}

          {/* Meta Info */}
          <div className="p-4 mt-6 text-sm text-gray-600">
            <div className="flex gap-4 mb-4">
              <p className="w-60  font-medium">Delivery: Standard shipping</p>
              <p className="w-60 font-medium">
                SKU: {data?.variants?.[0]?.sku || "N/A"}
              </p>
            </div>
            <div className="flex gap-4 mb-4">
              <p className="w-60 font-medium">
                Tags: {Array.isArray(data?.tags) ? data.tags.join(", ") : ""}
              </p>
              <p className="w-60 font-medium">
                Stock: {data?.variants?.[0]?.stock ?? 0}
              </p>
            </div>
            <div className="flex gap-4 mb-4">
              <p className="w-60 font-medium">Return: Standard return policy</p>
              <p className="w-60 font-medium">Warranty: Standard warranty</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full p-6 border border-gray-400 rounded-lg shadow-md">
        {/* <ProductDetails data={data} /> */}
      </div>
      <div className="my-10">
        <h2 className="text-2xl font-bold text-start mb-6">Related Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 md:pt-5 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {/* {relatedProducts.products.map((item) => (
            <RelatedProducts key={item.id} data={item} />
          ))} */}
        </div>
      </div>
    </PageContainer>
  );
}
