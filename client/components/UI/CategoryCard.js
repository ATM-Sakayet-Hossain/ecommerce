import Image from "next/image";
import React from "react";

const CategoryCard = ({ data }) => {
  return (
    <div className="relative aspect-4/3 rounded-2xl overflow-hidden">
      <Image
        src={data?.thumbnail}
        alt={data?.name}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        loading="lazy"
        width={200}
        height={200}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0.68))]" />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
          {data?.count || "0"} products
        </div>
        <h2 className="mt-1 text-xl font-semibold">{data?.name}</h2>
      </div>
    </div>
  );
};

export default CategoryCard;
