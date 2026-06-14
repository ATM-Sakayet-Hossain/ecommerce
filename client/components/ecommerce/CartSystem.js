"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiAlertCircle, FiMinus, FiPlus, FiRefreshCw, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import { cloneCartItem, currency, currentUser, findProductBySku, getDefaultCart, products } from "./data";

const STORAGE_KEY = "sakkhor-cart-v1";

function formatWarning(message) {
  return message.replace(/\s+/g, " ");
}

function CartSystem() {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [syncState, setSyncState] = useState("idle");
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const lastSyncedSignature = useRef("");

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.subtotal, 0), [items]);
  const shipping = subtotal > 0 ? (subtotal > 300 ? 0 : 12) : 0;
  const tax = subtotal > 0 ? Math.round(subtotal * 0.08) : 0;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    setMounted(true);

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) {
          setItems(parsed.map((item) => cloneCartItem(item, findProductBySku(item.sku))));
          return;
        }
      }
    } catch {
      // Fall back to seed data if storage is unavailable or invalid.
    }

    setItems(getDefaultCart());
  }, []);

  useEffect(() => {
    if (!mounted) {
      return undefined;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

    const currentSignature = JSON.stringify(items.map((item) => ({ sku: item.sku, quantity: item.quantity, subtotal: item.subtotal, unitPrice: item.unitPrice })));

    if (currentSignature === lastSyncedSignature.current) {
      return undefined;
    }

    if (!items.length) {
      setWarnings([]);
      lastSyncedSignature.current = currentSignature;
      return undefined;
    }

    setSyncState("syncing");
    const handle = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/cart/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, userId: currentUser.id }),
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error ?? "Unable to sync cart");
        }

        setItems(payload.items.map((item) => cloneCartItem(item, findProductBySku(item.sku))));
        setWarnings(payload.warnings ?? []);
        setSyncState("synced");
        setLastSyncedAt(new Date());
        lastSyncedSignature.current = JSON.stringify(
          payload.items.map((item) => ({ sku: item.sku, quantity: item.quantity, subtotal: item.subtotal, unitPrice: item.unitPrice })),
        );
      } catch (error) {
        setWarnings([error instanceof Error ? error.message : "Cart sync failed"]);
        setSyncState("offline");
      }
    }, 450);

    return () => window.clearTimeout(handle);
  }, [items, mounted]);

  const adjustQuantity = (sku, quantity) => {
    const product = findProductBySku(sku);
    if (!product) {
      setWarnings([`Invalid SKU ${sku} could not be matched to inventory.`]);
      return;
    }

    const normalizedQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
    if (!product.stock) {
      setWarnings([`${product.name} is currently out of stock.`]);
      return;
    }

    setItems((current) =>
      current.map((item) => {
        if (item.sku !== sku) {
          return item;
        }

        const nextQuantity = Math.min(normalizedQuantity, product.stock);
        return cloneCartItem({ ...item, quantity: nextQuantity, unitPrice: product.price, subtotal: nextQuantity * product.price }, product);
      }),
    );
  };

  const updateFromIncrement = (sku, delta) => {
    const item = items.find((entry) => entry.sku === sku);
    if (!item) {
      return;
    }

    adjustQuantity(sku, item.quantity + delta);
  };

  const removeItem = (sku) => {
    setItems((current) => current.filter((item) => item.sku !== sku));
  };

  const addItem = (product) => {
    const existing = items.find((item) => item.sku === product.sku);
    if (!product.stock) {
      setWarnings([`${product.name} is out of stock and cannot be added.`]);
      return;
    }

    if (existing) {
      adjustQuantity(product.sku, existing.quantity + 1);
      return;
    }

    setItems((current) => [
      ...current,
      cloneCartItem({ product, sku: product.sku, quantity: 1, subtotal: product.price }, product),
    ]);
  };

  if (!mounted) {
    return <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">Loading cart...</div>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
      <section className="space-y-4">
        <div className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Persistent cart</p>
              <h2 className="text-2xl font-semibold text-slate-950">SKU-validated items with live totals</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600">
              <FiRefreshCw className={syncState === "syncing" ? "animate-spin" : ""} size={14} />
              {syncState === "synced" ? "Synced" : syncState === "offline" ? "Offline sync" : "Saving"}
            </div>
          </div>

          {warnings.length ? (
            <div className="mt-4 space-y-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              {warnings.map((warning) => (
                <div key={warning} className="flex items-start gap-2">
                  <FiAlertCircle className="mt-0.5 shrink-0" size={16} />
                  <span>{formatWarning(warning)}</span>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-5 space-y-4">
            {items.length ? (
              items.map((item) => {
                const product = findProductBySku(item.sku);
                const currentPrice = product?.price ?? item.unitPrice;
                const priceChanged = currentPrice !== item.unitPrice;
                const stockLimit = product?.stock ?? item.quantity;
                const outOfStock = product ? product.stock <= 0 : false;

                return (
                  <article key={item.sku} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="relative h-24 w-full overflow-hidden rounded-2xl bg-slate-200 sm:h-24 sm:w-24">
                        <Image
                          src={item.product?.image ?? product?.image ?? products[0].image}
                          alt={item.product?.name ?? product?.name ?? "Product"}
                          fill
                          className="object-cover"
                          sizes="96px"
                          loading="lazy"
                        />
                      </div>

                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-950">
                              {item.product?.name ?? product?.name ?? "Unknown product"}
                            </h3>
                            <p className="text-sm text-slate-500">SKU {item.sku}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.sku)}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:border-red-200 hover:text-red-600"
                          >
                            <FiTrash2 size={14} />
                            Remove
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                          <span>{currency(currentPrice)} each</span>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <span>Subtotal {currency(item.subtotal)}</span>
                          {priceChanged ? (
                            <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                              Price updated from {currency(item.unitPrice)}
                            </span>
                          ) : null}
                          {outOfStock ? (
                            <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700">
                              Out of stock
                            </span>
                          ) : null}
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white">
                            <button
                              type="button"
                              onClick={() => updateFromIncrement(item.sku, -1)}
                              className="h-10 w-10 text-slate-600 transition hover:text-emerald-700"
                              disabled={item.quantity <= 1}
                            >
                              <FiMinus className="mx-auto" size={14} />
                            </button>
                            <input
                              type="number"
                              min={1}
                              max={stockLimit}
                              value={item.quantity}
                              onChange={(event) => adjustQuantity(item.sku, event.target.value)}
                              className="h-10 w-16 border-x border-slate-200 text-center text-sm outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => updateFromIncrement(item.sku, 1)}
                              className="h-10 w-10 text-slate-600 transition hover:text-emerald-700"
                              disabled={item.quantity >= stockLimit}
                            >
                              <FiPlus className="mx-auto" size={14} />
                            </button>
                          </div>
                          <p className="text-xs text-slate-500">Available stock {stockLimit}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <FiShoppingBag className="mx-auto text-slate-400" size={32} />
                <h3 className="mt-4 text-xl font-semibold text-slate-950">Your cart is empty</h3>
                <p className="mt-2 text-sm text-slate-600">Add items from the catalog below or continue browsing products.</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Catalog quick add</p>
              <h3 className="text-lg font-semibold text-slate-950">Add items to keep testing the flow</h3>
            </div>
            <Link href="/shop" className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-600">
              Browse shop
            </Link>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {products.slice(0, 6).map((product) => (
              <button
                key={product.sku}
                type="button"
                onClick={() => addItem(product)}
                className="group rounded-3xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-emerald-200 hover:bg-white"
              >
                <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-slate-200">
                  <Image src={product.image} alt={product.name} fill className="object-cover transition group-hover:scale-105" sizes="220px" loading="lazy" />
                </div>
                <div className="mt-3 flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-slate-950">{product.name}</h4>
                    <p className="text-sm text-slate-500">{product.brand}</p>
                  </div>
                  <div className="rounded-full bg-slate-950 px-3 py-1.5 text-sm font-semibold text-white">{currency(product.price)}</div>
                </div>
                <p className="mt-2 text-xs text-slate-500">SKU {product.sku}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-4xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-200">Order summary</p>
          <h3 className="mt-2 text-2xl font-semibold">Auto recalculated totals</h3>

          <dl className="mt-5 space-y-3 text-sm text-slate-300">
            <div className="flex items-center justify-between">
              <dt>Subtotal</dt>
              <dd>{currency(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Shipping</dt>
              <dd>{shipping ? currency(shipping) : "Free"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Tax</dt>
              <dd>{currency(tax)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold text-white">
              <dt>Total</dt>
              <dd>{currency(total)}</dd>
            </div>
          </dl>

          <div className="mt-5 space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
            <div className="flex items-center justify-between">
              <span>Sync status</span>
              <span>{syncState}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Saved user</span>
              <span>{currentUser.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Last sync</span>
              <span>{lastSyncedAt ? lastSyncedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "pending"}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-50"
          >
            Continue to checkout pipeline
          </Link>
        </div>
      </aside>
    </div>
  );
}

export default CartSystem;
