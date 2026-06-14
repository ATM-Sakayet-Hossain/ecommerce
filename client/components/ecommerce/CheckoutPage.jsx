"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PageContainer from "@/components/layout/PageContainer";
import { apiClient } from "@/lib/apiClient";
import { API, apiPath, clientPath, publicRoutes } from "@/lib/routes";
import { formatPrice } from "@/components/UI/helper";

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash on delivery" },
  { value: "Bkash", label: "bKash" },
  { value: "Nagad", label: "Nagad" },
  { value: "Stripe", label: "Card (Stripe)" },
  { value: "SSLCommerz", label: "SSLCommerz" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [insideDhaka, setInsideDhaka] = useState("true");
  const [paymenType, setPaymenType] = useState("cash");

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
  const deliveryCharge = insideDhaka === "true" ? 80 : 120;
  const total = subtotal + deliveryCharge;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!cart?._id) {
      toast.error("Cart not found");
      return;
    }
    if (!shippingAddress.trim()) {
      toast.error("Shipping address is required");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await apiClient.post(apiPath(API.order.checkout), {
        cartId: cart._id,
        shippingAddress: shippingAddress.trim(),
        insideDhaka: insideDhaka === "true",
        paymenType,
      });
      const checkoutUrl = result?.data?.checkoutUrl;
      const orderNumber = result?.data?.order?.orderNumber;

      if (checkoutUrl) {
        toast.info(result?.message || "Redirecting to payment...");
        window.location.href = checkoutUrl;
        return;
      }

      toast.success(result?.message || "Order placed successfully");
      if (orderNumber) {
        router.push(
          clientPath(publicRoutes.orderDetail, { orderNumber }),
        );
      } else {
        router.push(publicRoutes.orders.path);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer className="py-12">
        <p className="text-center text-slate-600">Loading checkout...</p>
      </PageContainer>
    );
  }

  if (!items.length) {
    return (
      <PageContainer className="py-12 text-center space-y-4">
        <p className="text-slate-700">Your cart is empty.</p>
        <Link
          href={publicRoutes.shop.path}
          className="inline-flex rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Continue shopping
        </Link>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Checkout</h1>
        <p className="text-sm text-slate-600 mt-1">
          Complete your order with shipping and payment details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="font-semibold text-slate-900">Shipping</h2>
          <label className="block text-sm">
            <span className="text-slate-600">Delivery address</span>
            <textarea
              required
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              rows={3}
              placeholder="House, road, area, district"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
          <fieldset className="space-y-2">
            <legend className="text-sm text-slate-600">Delivery zone</legend>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="insideDhaka"
                value="true"
                checked={insideDhaka === "true"}
                onChange={() => setInsideDhaka("true")}
              />
              Inside Dhaka (৳80)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="insideDhaka"
                value="false"
                checked={insideDhaka === "false"}
                onChange={() => setInsideDhaka("false")}
              />
              Outside Dhaka (৳120)
            </label>
          </fieldset>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="font-semibold text-slate-900">Payment</h2>
          <select
            value={paymenType}
            onChange={(e) => setPaymenType(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white space-y-2">
          <div className="flex justify-between text-sm text-slate-300">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-300">
            <span>Delivery</span>
            <span>{formatPrice(deliveryCharge)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/20">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full rounded-xl bg-white py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-50 disabled:opacity-60"
          >
            {isSubmitting ? "Placing order..." : "Place order"}
          </button>
          <Link
            href={publicRoutes.cart.path}
            className="block text-center text-sm text-slate-400 hover:text-white"
          >
            Back to cart
          </Link>
        </aside>
      </form>
    </PageContainer>
  );
}
