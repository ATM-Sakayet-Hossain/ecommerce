"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Send,
  MessageCircle,
  Trash2,
} from "lucide-react";
import Image from "next/image";

export default function CartDetailsClient({ cart }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(value || 0));

  const getStatusBadge = (status) => {
    const map = {
      active: "bg-blue-100 text-blue-800",
      abandoned: "bg-red-100 text-red-800",
      converted: "bg-green-100 text-green-800",
    };

    const safeStatus = status || "unknown";

    return (
      <span
        className={`px-2 py-1 rounded text-xs capitalize ${map[safeStatus] || "bg-gray-100 text-gray-700"}`}
      >
        {safeStatus}
      </span>
    );
  };

  const handleSendRecoveryEmail = async () => {
    setLoading(true);
    try {
      await fetch(`/api/carts/${cart.id}/recovery-email`, {
        method: "POST",
      });

      toast.success("Recovery email sent");
      setShowRecoveryModal(false);
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleContactCustomer = async () => {
    setLoading(true);
    try {
      await fetch(`/api/carts/${cart.id}/contact`, {
        method: "POST",
      });

      toast.success("Customer contacted");
      setShowContactModal(false);
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    setLoading(true);
    try {
      await fetch(`/api/carts/${cart.id}`, {
        method: "DELETE",
      });

      toast.success("Cart cleared");
      router.push("/carts");
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-linear-to-br from-emerald-50 via-white to-cyan-50 rounded-3xl mx-auto border border-emerald-100 shadow-xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm backdrop-blur">
        <button
          onClick={() => router.push("/carts")}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-white text-gray-700 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow"
          aria-label="Go back to carts"
          type="button"
        >
          <ArrowLeft />
        </button>
        <div className="sm:text-center">
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">
            Cart #{cart.id}
          </h1>
          <p className="text-xs md:text-sm text-gray-500">
            Review customer details, items, and recovery actions
          </p>
        </div>
        {getStatusBadge(cart.status)}
      </div>
      {/* GRID */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* CUSTOMER */}
          <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold mb-5 text-2xl text-gray-900">
              Customer Details
            </h2>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition hover:border-emerald-200 hover:bg-emerald-50">
                <User size={20} className="text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-base font-semibold text-gray-900">
                    {cart.userName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition hover:border-emerald-200 hover:bg-emerald-50">
                <Mail size={20} className="text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-base font-semibold text-gray-900">
                    {cart.userEmail}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition hover:border-emerald-200 hover:bg-emerald-50">
                <Phone size={20} className="text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-base font-semibold text-gray-900">
                    {cart.userPhone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition hover:border-emerald-200 hover:bg-emerald-50">
                <Calendar size={20} className="text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-500">Created At</p>
                  <p className="text-base font-semibold text-gray-900">
                    {formatDate(cart.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* ITEMS */}
          <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4 text-xl">
              Items ({cart.totalItems})
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {cart.items?.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/70 hover:shadow-sm"
                >
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.title || "Cart item image"}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold text-emerald-700">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              ))}
              {(!cart.items || cart.items.length === 0) && (
                <p className="text-sm text-gray-500">No items in this cart.</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* SUMMARY */}
          <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Summary</h2>
            <div className="space-y-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Subtotal
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(cart.subtotal)}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Tax
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(cart.tax)}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-emerald-700">
                  Total
                </p>
                <p className="text-2xl font-extrabold text-emerald-700">
                  {formatCurrency(cart.totalPrice)}
                </p>
              </div>
            </div>
          </div>
          {/* ACTIONS */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <button
              onClick={() => setShowRecoveryModal(true)}
              disabled={loading}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={25} color="#fff" /> Recovery Email
            </button>
            <button
              onClick={() => setShowContactModal(true)}
              disabled={loading}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <MessageCircle size={25} color="#fff" /> Contact
            </button>
            <button
              onClick={() => setShowClearModal(true)}
              disabled={loading}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 size={25} color="#fff" /> Clear Cart
            </button>
          </div>
        </div>
      </div>

      {/* MODALS (keep same logic, just client-side) */}
      {showRecoveryModal && (
        <Modal
          title="Send Recovery Email"
          onClose={() => setShowRecoveryModal(false)}
          onConfirm={handleSendRecoveryEmail}
          loading={loading}
        />
      )}
      {showContactModal && (
        <Modal
          title="Contact Customer"
          onClose={() => setShowContactModal(false)}
          onConfirm={handleContactCustomer}
          loading={loading}
        />
      )}
      {showClearModal && (
        <Modal
          title="Clear Cart"
          onClose={() => setShowClearModal(false)}
          onConfirm={handleClearCart}
          loading={loading}
        />
      )}
    </div>
  );
}

/* Simple reusable modal */
function Modal({ title, onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-sm border border-gray-200 shadow-2xl">
        <h3 className="font-bold mb-3 text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">
          Are you sure you want to proceed?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            type="button"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            type="button"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Loading..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
