import React from "react";
import Image from "next/image";
import { formatCurrency } from "./ui/helper";

// Server-side fetch (SSR)
// async function getProducts() {
//   const res = await fetch("http://localhost:3000/api/products", {
//     cache: "no-store", // 🔥 always SSR (no caching)
//   });
//   if (!res.ok) {
//     throw new Error("Failed to fetch products");
//   }
//   return res.json();
// }

const RecentlyAddProducts = async () => {
  //   const products = await getProducts();
  const products = [
    {
      id: "1",
      name: "ASUS Mothership X Laptop",
      description: "Intel i9-9980HK 8-Core",
      price: 50,
      currency: "USD",
      image: "/laptop.png",
    },
    {
      id: "2",
      name: "Cricket Bat",
      description: "Premium bat",
      price: 280,
      currency: "USD",
      image: "/bat.png",
    },
  ];
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <h2 className="text-lg font-semibold mb-4">Recently added products</h2>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between border-b pb-3"
          >
            {/* Left side */}
            <div className="flex items-center gap-3">
              <Image
                src={product.image}
                alt={product.name}
                width={50}
                height={50}
                className="rounded-md"
              />

              <div>
                <h3 className="font-medium text-blue-600">{product.name}</h3>

                <p className="text-sm text-gray-500">{product.description}</p>
              </div>
            </div>

            {/* Price */}
            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
              {formatCurrency(product.price, product.currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyAddProducts;
