"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import PageContainer from "@/components/layout/PageContainer";
import { apiClient } from "@/lib/apiClient";
import {
  API,
  apiPath,
  authRoutes,
  clientPath,
  publicRoutes,
} from "@/lib/routes";
import { formatPrice } from "@/components/UI/helper";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [draftQty, setDraftQty] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [updatingSku, setUpdatingSku] = useState(null);
  const [error, setError] = useState("");

  const syncDraftQuantities = useCallback((nextCart) => {
    const items = nextCart?.items?.filter((item) => item?.product) ?? [];
    const next = {};
    for (const item of items) {
      if (item.sku) next[item.sku] = item.quantity;
    }
    setDraftQty(next);
  }, []);

  const loadCart = async ({ silent = false } = {}) => {
    if (!silent) {
      setIsLoading(true);
      setError("");
    }
    try {
      const payload = await apiClient.get(apiPath(API.cart.get));
      const carts = payload?.data ?? [];
      const nextCart = Array.isArray(carts) ? carts[0] : null;
      setCart(nextCart);
      syncDraftQuantities(nextCart);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load cart";
      if (!silent) {
        setError(message);
        setCart(null);
        setDraftQty({});
      } else {
        toast.error(message);
      }
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (sku, quantity) => {
    const parsed = Number(quantity);
    if (!Number.isFinite(parsed) || parsed < 1) {
      toast.error("Quantity must be at least 1");
      syncDraftQuantities(cart);
      return;
    }
    setUpdatingSku(sku);
    try {
      await apiClient.put(apiPath(API.cart.update), {
        sku,
        quantity: parsed,
      });
      await loadCart({ silent: true });
      toast.success("Cart updated");
    } catch (err) {
      syncDraftQuantities(cart);
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdatingSku(null);
    }
  };

  const commitQuantity = (sku, currentQuantity) => {
    const raw = draftQty[sku];
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed < 1) {
      setDraftQty((prev) => ({ ...prev, [sku]: currentQuantity }));
      return;
    }
    if (parsed === currentQuantity) return;
    updateQuantity(sku, parsed);
  };

  const adjustQuantity = (sku, currentQuantity, delta) => {
    const next = Math.max(1, currentQuantity + delta);
    setDraftQty((prev) => ({ ...prev, [sku]: next }));
    updateQuantity(sku, next);
  };

  const removeItem = async (sku) => {
    setUpdatingSku(sku);
    try {
      await apiClient.delete(apiPath(API.cart.remove, { sku }));
      await loadCart({ silent: true });
      toast.success("Item removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Remove failed");
    } finally {
      setUpdatingSku(null);
    }
  };

  if (isLoading) {
    return (
      <PageContainer className="py-12">
        <p className="text-center text-slate-600">Loading your cart...</p>
      </PageContainer>
    );
  }

  if (error) {
    const needsLogin =
      error.toLowerCase().includes("unauthorized") ||
      error.toLowerCase().includes("token");
    return (
      <PageContainer className="py-12 text-center space-y-4">
        <p className="text-slate-700">
          {needsLogin
            ? "Sign in to view and manage your cart."
            : error}
        </p>
        {needsLogin ? (
          <Link
            href={authRoutes.login.path}
            className="inline-flex rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Log in
          </Link>
        ) : (
          <button
            type="button"
            onClick={loadCart}
            className="text-emerald-700 font-semibold hover:underline"
          >
            Try again
          </button>
        )}
      </PageContainer>
    );
  }

  const items = cart?.items?.filter((item) => item?.product) ?? [];
  const total = items.reduce(
    (sum, item) => sum + Number(item?.subtotal ?? 0),
    0,
  );

  return (
    <PageContainer className="py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Your cart</h1>
        <p className="text-sm text-slate-600 mt-1">
          {items.length} item{items.length === 1 ? "" : "s"}
        </p>
      </div>

      {!items.length ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <p className="text-slate-600 mb-4">Your cart is empty.</p>
          <Link
            href={publicRoutes.shop.path}
            className="inline-flex rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => {
              const product = item.product;
              return (
                <article
                  key={item.sku}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {product?.thumbnail ? (
                      <Image
                        src={product.thumbnail}
                        alt={product?.title || "Product"}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <Link
                      href={clientPath(publicRoutes.shopDetail, {
                        slug: product?.slug,
                      })}
                      className="font-semibold text-slate-950 hover:text-emerald-700"
                    >
                      {product?.title}
                    </Link>
                    <p className="text-sm text-slate-500">SKU: {item.sku}</p>
                    <p className="font-semibold text-emerald-700">
                      {formatPrice(item.subtotal)}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center rounded-lg border border-slate-200">
                        <button
                          type="button"
                          disabled={
                            updatingSku === item.sku || item.quantity <= 1
                          }
                          onClick={() =>
                            adjustQuantity(item.sku, item.quantity, -1)
                          }
                          className="px-2.5 py-1 text-sm disabled:opacity-50"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={draftQty[item.sku] ?? item.quantity}
                          disabled={updatingSku === item.sku}
                          onChange={(e) =>
                            setDraftQty((prev) => ({
                              ...prev,
                              [item.sku]: e.target.value,
                            }))
                          }
                          onBlur={() =>
                            commitQuantity(item.sku, item.quantity)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.currentTarget.blur();
                            }
                          }}
                          className="w-14 border-x border-slate-200 px-2 py-1 text-center text-sm disabled:opacity-60"
                        />
                        <button
                          type="button"
                          disabled={updatingSku === item.sku}
                          onClick={() =>
                            adjustQuantity(item.sku, item.quantity, 1)
                          }
                          className="px-2.5 py-1 text-sm disabled:opacity-50"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        disabled={updatingSku === item.sku}
                        onClick={() => removeItem(item.sku)}
                        className="text-sm text-red-600 hover:underline disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <aside className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white h-fit">
            <p className="text-sm text-slate-300">Order total</p>
            <p className="text-3xl font-bold mt-1">{formatPrice(total)}</p>
            <Link
              href={publicRoutes.checkout.path}
              className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-400"
            >
              Proceed to checkout
            </Link>
            <Link
              href={publicRoutes.shop.path}
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </PageContainer>
  );
}
