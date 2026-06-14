import Image from "next/image";
import { Box, Rating } from "@mui/material";
import {
  formatPrice,
  getDiscountLabel,
  getProductRating,
  getSalePrice,
  hasDiscount,
  isInStock,
} from "./helper";

const ProductCard = ({ data }) => {
  const salePrice = getSalePrice(data);
  const inStock = isInStock(data?.variants);
  const discountLabel = getDiscountLabel(data);

  return (
    <div className="bg-white rounded-2xl shadow-lg w-[320px] overflow-hidden">
      <div className="relative h-48 bg-yellow-200">
        {data?.thumbnail ? (
          <Image
            src={data.thumbnail}
            alt={data?.title || "Product"}
            fill
            className="object-cover"
            sizes="320px"
          />
        ) : null}
        <span
          className={`absolute top-4 left-4 text-black font-semibold text-sm px-3 py-1 rounded-md shadow ${
            inStock ? "bg-green-400" : "bg-red-500"
          }`}
        >
          {inStock ? "In stock" : "Out of stock"}
        </span>
        <button
          type="button"
          className="absolute top-3 right-3 bg-white rounded-full p-1 shadow text-gray-500 text-xl hover:text-red-500"
          aria-label="Add to favorites"
        >
          &#9825;
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold h-15 text-xl mb-1 line-clamp-2">{data?.title}</h3>
        <p className="text-gray-500 text-sm h-6 overflow-hidden mb-2">
          {data?.brand}
        </p>
        <div className="flex items-center mb-1">
          <Box>
            <Rating
              className="text-sm"
              name="product-card-rating"
              value={getProductRating(data)}
              readOnly
            />
          </Box>
          <span className="text-gray-400 text-sm ml-2">
            ({data?.ratings?.count ?? 0} reviews)
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
        <div className="flex justify-between items-center">
          <span className="text-indigo-500 font-medium text-base">
            View Details
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
