"use client";
import { Box, Rating } from "@mui/material";
import React from "react";

const ProductDetails = ({ data }) => {
  const [activeTab, setActiveTab] = React.useState("Description");

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
            )
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
              Category: {data?.category || "N/A"}
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
            {data?.reviews && data.reviews.length > 0 ? (
              data.reviews.map((review, index) => (
                <div key={index} className="mb-4 border border-gray-400 px-5 py-3 rounded-lg">
                  <p className="text-gray-700">{review.comment}</p>
                  <div className="flex items-center gap-2">
                    <Box>
                      <Rating
                        className="text-sm"
                        name="simple-controlled"
                        value={review?.rating}
                      />
                    </Box>
                  </div>
                  <p className="text-gray-800 font-medium">
                    Name: {review.reviewerName}
                  </p>
                  <p className="text-gray-800 font-medium">
                    Email. {review.reviewerEmail}
                  </p>
                  <p className="text-gray-700">{review.date}</p>
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
