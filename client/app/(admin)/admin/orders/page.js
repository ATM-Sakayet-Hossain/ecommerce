"use client";

import { useGetOrdersQuery } from "@/app/(admin)/services/api";
import { formatDate, formatPrice } from "@/components/UI/helper";
import Link from "next/link";
import { adminRoutes, clientPath } from "@/lib/routes";
import { useMemo, useState } from "react";
import { Package, Search } from "lucide-react";

const statusStyles = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  confirmed: "bg-blue-50 text-blue-800 border-blue-200",
  shipped: "bg-indigo-50 text-indigo-800 border-indigo-200",
  delivered: "bg-emerald-50 text-emerald-800 border-emerald-200",
  cancelled: "bg-rose-50 text-rose-800 border-rose-200",
};

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      search: search || undefined,
      status: status === "all" ? undefined : status,
    }),
    [limit, page, search, status],
  );

  const { data, isLoading, isError } = useGetOrdersQuery(queryParams);
  const orders = data?.data?.order ?? [];
  const totalOrder = data?.data?.totalOrder ?? 0;
  const totalPages = data?.data?.totalPages ?? 1;

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-linear-to-r from-slate-950 via-slate-900 to-emerald-900 p-6 text-white shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
          Orders
        </p>
        <h1 className="mt-2 text-3xl font-black">Manage customer orders</h1>
        <p className="mt-2 text-sm text-slate-200/90">
          View and update order status via{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">GET /order/get</code> and{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
            PUT /order/admin/update/:orderId
          </code>
        </p>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search order number or customer"
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={String(limit)}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
        >
          <option value="10">10 / page</option>
          <option value="20">20 / page</option>
          <option value="50">50 / page</option>
        </select>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
        {isLoading ? (
          <p className="px-6 py-12 text-center text-sm text-slate-500">
            Loading orders...
          </p>
        ) : isError ? (
          <p className="px-6 py-12 text-center text-sm text-rose-600">
            Unable to load orders.
          </p>
        ) : orders.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-slate-500">
            No orders found.
          </p>
        ) : (
          <table className="w-full min-w-200 text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-6 py-3 font-semibold">Order</th>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Total</th>
                <th className="px-6 py-3 font-semibold">Payment</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id || order.orderNumber}
                  className="border-b border-slate-100 hover:bg-emerald-50/30"
                >
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <p>{order.user?.name || "-"}</p>
                    <p className="text-xs">{order.user?.email || "-"}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatPrice(order.totalPrice)}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {order.payment?.method || "-"} /{" "}
                    {order.payment?.status || "pending"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        statusStyles[order.status] ||
                        "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={clientPath(adminRoutes.orders.detail, {
                        orderNumber: order.orderNumber,
                      })}
                      className="inline-flex items-center gap-1 text-emerald-700 font-semibold hover:underline"
                    >
                      <Package className="h-4 w-4" />
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
        <p className="text-slate-600">
          Showing {orders.length} of {totalOrder}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
