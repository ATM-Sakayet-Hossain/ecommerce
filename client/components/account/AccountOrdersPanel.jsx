"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { API, apiPath, clientPath, publicRoutes } from "@/lib/routes";
import { formatDate, formatPrice } from "@/components/UI/helper";

const statusStyles = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-800",
};

export default function AccountOrdersPanel() {
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
        setError(err instanceof Error ? err.message : "Unable to load orders");
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">My Orders</h2>
        <p className="mt-1 text-sm text-slate-600">
          Track status and payment for your purchases.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <p className="px-5 py-10 text-center text-sm text-slate-500">
            Loading orders...
          </p>
        ) : error ? (
          <p className="px-5 py-10 text-center text-sm text-rose-600">
            {error}
          </p>
        ) : !orders.length ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-slate-600">You have no orders yet.</p>
            <Link
              href={publicRoutes.shop.path}
              className="mt-3 inline-block text-sm font-semibold text-teal-600"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.map((order) => (
              <Link
                key={order._id || order.orderNumber}
                href={clientPath(publicRoutes.orderDetail, {
                  orderNumber: order.orderNumber,
                })}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition hover:bg-slate-50"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {order.orderNumber}
                  </p>
                  <p className="text-sm text-slate-500">
                    {formatDate(order.createdAt)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {order.payment?.method} ·{" "}
                    {order.payment?.status || "pending"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-teal-700">
                    {formatPrice(order.totalPrice)}
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                      statusStyles[order.status] ||
                      "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
