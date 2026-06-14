"use client";

import {
  useGetOrderByNumberQuery,
  useUpdateOrderMutation,
} from "@/app/(admin)/services/api";
import { adminRoutes } from "@/lib/routes";
import { formatDate, formatPrice } from "@/components/UI/helper";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { ArrowLeft, Loader2 } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "", label: "No change" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "", label: "No change" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderNumber = decodeURIComponent(params?.orderNumber ?? "");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [note, setNote] = useState("");

  const { data, isLoading, isError, refetch } =
    useGetOrderByNumberQuery(orderNumber);

  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const order = useMemo(() => data?.data ?? null, [data]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!order?._id) {
      toast.error("Order id missing");
      return;
    }
    if (!status && !paymentStatus) {
      toast.error("Select a status or payment status to update");
      return;
    }
    try {
      await updateOrder({
        orderId: order._id,
        body: {
          status: status || undefined,
          paymentStatus: paymentStatus || undefined,
          note: note || undefined,
        },
      }).unwrap();
      toast.success("Order updated");
      setStatus("");
      setPaymentStatus("");
      setNote("");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  if (isLoading) {
    return (
      <p className="flex items-center gap-2 text-slate-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading order...
      </p>
    );
  }

  if (isError || !order) {
    return (
      <div className="space-y-4">
        <Link
          href={adminRoutes.orders.list.path}
          className="inline-flex items-center gap-2 text-emerald-700 font-semibold hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>
        <p className="text-rose-600">Order not found.</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <Link
        href={adminRoutes.orders.list.path}
        className="inline-flex items-center gap-2 text-emerald-700 font-semibold hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to orders
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {order.orderNumber}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800 capitalize">
            {order.status}
          </span>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2 text-sm">
          <div>
            <dt className="text-slate-500">Customer</dt>
            <dd className="font-medium">
              {order.user?.fullName || order.user?.name} ({order.user?.email})
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Total</dt>
            <dd className="font-medium">{formatPrice(order.totalPrice)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Payment method</dt>
            <dd className="font-medium">{order.payment?.method || "-"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Payment status</dt>
            <dd className="font-medium capitalize">
              {order.payment?.status || "pending"}
            </dd>
          </div>
        </dl>
      </div>

      <form
        onSubmit={handleUpdate}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 max-w-xl"
      >
        <h2 className="text-lg font-bold text-slate-900">Update order</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-slate-600">Order status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value || "none"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-slate-600">Payment status</span>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
            >
              {PAYMENT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value || "none"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block text-sm">
          <span className="text-slate-600">Note (optional)</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
          />
        </label>
        <button
          type="submit"
          disabled={isUpdating}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {isUpdating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </form>
    </section>
  );
}
