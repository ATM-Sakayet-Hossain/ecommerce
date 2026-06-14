"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { API, apiPath, publicRoutes } from "@/lib/routes";
import { formatPrice } from "@/components/UI/helper";

export default function AccountCartPanel() {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const payload = await apiClient.get(apiPath(API.cart.get));
        const carts = payload?.data ?? [];
        setCart(Array.isArray(carts) ? carts[0] : null);
      } catch {
        setCart(null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const items = cart?.items?.filter((item) => item?.product) ?? [];
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item?.subtotal ?? 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">My Cart</h2>
          <p className="mt-1 text-sm text-slate-600">
            Items currently in your shopping cart.
          </p>
        </div>
        <Link
          href={publicRoutes.cart.path}
          className="text-sm font-semibold text-teal-600 hover:text-teal-800"
        >
          Open full cart →
        </Link>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <p className="px-5 py-10 text-center text-sm text-slate-500">
            Loading cart...
          </p>
        ) : !items.length ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-slate-600">Your cart is empty.</p>
            <Link
              href={publicRoutes.shop.path}
              className="mt-3 inline-block text-sm font-semibold text-teal-600"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-slate-100">
              {items.map((item) => {
                const product = item.product;
                const image =
                  product?.images?.[0] ||
                  product?.image ||
                  product?.thumbnail;
                return (
                  <li
                    key={item.sku || item._id}
                    className="flex gap-4 px-5 py-4"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                      {image ? (
                        <Image
                          src={image}
                          alt={product?.name || "Product"}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-xs text-slate-400">
                          —
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900">
                        {product?.name || "Product"}
                      </p>
                      <p className="text-sm text-slate-500">
                        Qty {item.quantity} · {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
              <span className="font-semibold text-slate-900">Subtotal</span>
              <span className="font-bold text-teal-700">
                {formatPrice(subtotal)}
              </span>
            </div>
            <div className="border-t border-slate-100 px-5 py-4">
              <Link
                href={publicRoutes.checkout.path}
                className="inline-flex rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
              >
                Proceed to checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
