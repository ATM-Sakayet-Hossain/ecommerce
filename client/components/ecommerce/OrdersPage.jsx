"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { apiClient } from "@/lib/apiClient";
import {
  API,
  apiPath,
  authRoutes,
  clientPath,
  publicRoutes,
} from "@/lib/routes";
import { formatDate, formatPrice } from "@/components/UI/helper";

const statusStyles = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-800",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const payload = await apiClient.get(
          `${apiPath(API.order.get)}?page=1&limit=50`,
        );
        setOrders(payload?.data?.order ?? []);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to load orders";
        setError(message);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return (
      <PageContainer className="py-12">
        <p className="text-center text-slate-600">Loading your orders...</p>
      </PageContainer>
    );
  }

  const needsLogin =
    error.toLowerCase().includes("unauthorized") ||
    error.toLowerCase().includes("token");

  if (needsLogin) {
    return (
      <PageContainer className="py-12 text-center space-y-4">
        <p className="text-slate-700">Sign in to view your orders.</p>
        <Link
          href={authRoutes.login.path}
          className="inline-flex rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Log in
        </Link>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">My orders</h1>
        <p className="text-sm text-slate-600 mt-1">
          Track status and payment for your purchases.
        </p>
      </div>

      {error && !needsLogin ? (
        <p className="text-rose-600 text-sm">{error}</p>
      ) : null}

      {!orders.length ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <p className="text-slate-600 mb-4">You have no orders yet.</p>
          <Link
            href={publicRoutes.shop.path}
            className="inline-flex rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id || order.orderNumber}
              href={clientPath(publicRoutes.orderDetail, {
                orderNumber: order.orderNumber,
              })}
              className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-md"
            >
              <div className="flex gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {order.previewThumbnail ? (
                    <Image
                      src={order.previewThumbnail}
                      alt="Order item"
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {formatDate(order.createdAt)}
                        {order.itemCount
                          ? ` · ${order.itemCount} item${order.itemCount === 1 ? "" : "s"}`
                          : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-700">
                        {formatPrice(order.totalPrice)}
                      </p>
                      <span
                        className={`inline-block mt-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                          statusStyles[order.status] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {order.payment?.method} ·{" "}
                    {order.payment?.status || "pending"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
