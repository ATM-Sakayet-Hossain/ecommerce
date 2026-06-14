"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/apiClient";
import { API, apiPath, authRoutes } from "@/lib/routes";

const Counter = ({
  productId,
  sku,
  maxStock = 99,
  disabled = false,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const stockLimit = Math.max(1, Number(maxStock) || 1);

  const handleAddToCart = async () => {
    if (!productId || !sku) {
      toast.error("Product variant is unavailable.");
      return;
    }
    setIsAdding(true);
    try {
      await apiClient.post(apiPath(API.cart.add), {
        productId,
        sku,
        quantity,
      });
      toast.success("Added to cart");
    } catch (error) {
      const message = error?.message || "Failed to add to cart";
      if (message.toLowerCase().includes("unauthorized")) {
        toast.error(
          <span>
            Please{" "}
            <Link href={authRoutes.login.path} className="underline font-semibold">
              log in
            </Link>{" "}
            to add items to your cart.
          </span>,
        );
      } else {
        toast.error(message);
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex items-center gap-3 mt-4">
      <div className="flex items-center border rounded-lg">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-3 py-2 disabled:opacity-50"
          disabled={disabled || quantity <= 1}
        >
          -
        </button>
        <span className="px-4">{quantity}</span>
        <button
          type="button"
          onClick={() =>
            setQuantity((q) => Math.min(stockLimit, q + 1))
          }
          className="px-3 py-2 disabled:opacity-50"
          disabled={disabled || quantity >= stockLimit}
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={disabled || isAdding || !productId || !sku}
        className="bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl"
      >
        {isAdding ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
};

export default Counter;
