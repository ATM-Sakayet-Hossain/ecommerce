import React from "react";
import ProductGrid from "../../../components/admin/product/ProductGrid";
import fallbackProducts from "./ecommerce.products.json";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:1993";

async function getProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/product/get`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    return json?.data?.product || [];
  } catch {
    return [];
  }
}
const Page = async () => {
  const data = await getProducts();
  const products =
    Array.isArray(data) && data.length > 0 ? data : fallbackProducts;

  return (
    <div className="space-y-6 p-4 bg-green-50 rounded-xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="text-gray-600">Manage your product catalog</p>
      </div>
      <ProductGrid initialProducts={products} />
    </div>
  );
};

export default Page;
