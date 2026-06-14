import { Box, Rating } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CiShoppingCart } from "react-icons/ci";
import {
  formatPrice,
  getCategoryName,
  getProductRating,
  getSalePrice,
  hasDiscount,
} from "@/components/UI/helper";

const RelatedProducts = ({ data }) => {
  const salePrice = getSalePrice(data);
  const showDiscount = hasDiscount(data);

  return (
    <div className="block p-2 md:p-6 border border-[#F2F3F4] rounded-2xl w-full group relative overflow-hidden">
      <div className="absolute top-0 left-0 bg-brand text-white text-xs px-2 py-1 rounded-br-xl">
        <p>{data?.isActive === false ? "Inactive" : "In stock"}</p>
      </div>
      {data?.thumbnail ? (
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={data.thumbnail}
            alt={data?.title || "Product"}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="aspect-square w-full rounded-xl bg-slate-100" />
      )}
      <h4 className="text-xs font-normal text-secondary mt-2">
        {getCategoryName(data?.categoryData) || getCategoryName(data?.category)}
      </h4>
      <Link
        href={`/shop/${data?.slug}`}
        className="text-primary font-bold text-sm md:text-base hover:text-brand transition-all line-clamp-2"
      >
        {data?.title}
      </Link>
      <div className="flex gap-3 py-2.5">
        <Box>
          <Rating
            className="text-sm"
            name="related-product-rating"
            value={getProductRating(data)}
            readOnly
          />
        </Box>
        <p className="text-xs font-normal text-secondary">
          {data?.ratings?.count ?? 0} reviews
        </p>
      </div>
      <p className="text-sm font-normal text-secondary">
        By <span className="text-brand">{data?.brand || "Brand"}</span>
      </p>
      <div className="flex flex-col md:flex-row gap-2 justify-between pt-6">
        <h4 className="text-sm md:text-lg font-bold text-brand flex gap-2 items-baseline">
          {formatPrice(salePrice)}
          {showDiscount ? (
            <span className="text-secondary text-base line-through font-normal">
              {formatPrice(data?.price)}
            </span>
          ) : null}
        </h4>
        <Link
          href={`/shop/${data?.slug}`}
          className="bg-[#DEF9EC] flex items-center justify-center gap-1 text-brand font-bold text-lg p-1 rounded-sm cursor-pointer"
        >
          <CiShoppingCart />
          <span>View</span>
        </Link>
      </div>
    </div>
  );
};

export default RelatedProducts;
