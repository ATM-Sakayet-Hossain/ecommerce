"use client";
import ProductGrid from "./ProductGrid";

const AllProducts = ({ initialProducts = [] }) => {
  return <ProductGrid initialProducts={initialProducts} />;
};

export default AllProducts;
