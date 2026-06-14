"use client";
import { useEffect, useState } from "react";
import { Box, Rating } from "@mui/material";
import React from "react";
import { apiClient } from "@/lib/apiClient";
import { API, apiPath } from "@/lib/routes";
import { getCategoryName } from "@/components/UI/helper";

const ProductDetails = ({ data, reviews = [] }) => {
  const [activeTab, setActiveTab] = React.useState("Description");
  const [reviewItems, setReviewItems] = useState(reviews);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  useEffect(() => {
    setReviewItems(reviews);
  }, [reviews]);

  useEffect(() => {
    const productSlug = data?.slug;
    if (activeTab !== "Reviews" || reviewItems.length > 0 || !productSlug) {
      return;
    }

    let isMounted = true;
    const loadReviews = async () => {
      setIsLoadingReviews(true);
      try {
        const payload = await apiClient.get(
          `${apiPath(API.review.get)}?slug=${encodeURIComponent(productSlug)}&limit=10`,
        );
        if (isMounted) {
          setReviewItems(payload?.data?.reviews ?? []);
        }
      } catch {
        if (isMounted) {
          setReviewItems([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingReviews(false);
        }
      }
    };

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, [activeTab, data?.slug, reviewItems.length]);

  return (
    <>
      <div>
        <ul className="flex gap-8 justify-start mt-2">
          {["Description", "Additional Info", "Vendor", "Reviews"].map(
            (tab) => (
              <li
                key={tab}
                className={`text-lg font-bold px-8 py-2 rounded-full border-1 border-gray-500 cursor-pointer ${
                  activeTab === tab ? "bg-gray-200 text-brand" : "text-gray-600"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </li>
            ),
          )}
        </ul>
      </div>
      <div className="mt-6">
        {activeTab === "Description" && (
          <>
            <p className="text-gray-700 mb-4 text-justify">
              {data?.description || "No description available."}
            </p>
            <div>
              <h2 className="text-gray-700 text-2xl mb-4 pb-2 border-b-1">
                Packaging & Delivery
              </h2>
              <p className="text-gray-700 mb-4 text-justify">
                Less lion goodness that euphemistically robin expeditiously
                bluebird smugly scratched far while thus cackled sheepishly
                rigid after due one assenting regarding censorious while
                occasional or this more crane went more as this less much amid
                overhung anathematic because much held one exuberantly sheep
                goodness so where rat wry well concomitantly.
              </p>
            </div>
          </>
        )}
        {activeTab === "Additional Info" && (
          <>
            <p className="text-gray-700 mb-4">
              Weight: {data?.weight || "N/A"}
            </p>
            <p className="text-gray-700 mb-4">Brand: {data?.brand || "N/A"}</p>
            <p className="text-gray-700 mb-4">
              Category: {getCategoryName(data?.category) || "N/A"}
            </p>
          </>
        )}
        {activeTab === "Vendor" && (
          <>
            <p className="text-gray-700 mb-4">
              Brand: {data?.brand || "No vendor information available."}
            </p>
          </>
        )}
        {activeTab === "Reviews" && (
          <>
            {isLoadingReviews ? (
              <p className="text-gray-700">Loading reviews...</p>
            ) : reviewItems.length > 0 ? (
              reviewItems.map((review) => (
                <div
                  key={review._id}
                  className="mb-4 rounded-lg border border-gray-400 px-5 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {review.user?.fullName ||
                          review.user?.email ||
                          "Verified buyer"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                    <Box>
                      <Rating
                        className="text-sm"
                        name={`review-rating-${review._id}`}
                        value={Number(review?.rating) || 0}
                        readOnly
                      />
                    </Box>
                  </div>
                  <p className="mt-3 text-gray-700">
                    {review.comment || review.review || "No comment provided."}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-700">No reviews yet.</p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
