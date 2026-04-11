import Link from "next/link";
import { ShoppingBag, ShieldCheck, Truck, Sparkles } from "lucide-react";

const cartItems = [
  {
    title: "Premium Audio",
    qty: 1,
    price: "$149",
  },
  {
    title: "Smart Watch",
    qty: 1,
    price: "$199",
  },
];

export default function Page() {
  const subtotal = cartItems.reduce((sum, item) => {
    const value = Number(String(item.price).replace("$", ""));
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <section className="card mb-8 overflow-hidden border border-white/70 bg-linear-to-r from-slate-900 via-slate-800 to-emerald-800 text-white shadow-2xl shadow-slate-200/70">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
              Checkout
            </p>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Your cart is ready for a premium checkout flow.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-200 md:text-base">
              The cart is intentionally calm and clear, with enough hierarchy to
              feel expensive and enough structure to guide the next step.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              ["Secure", "Protected checkout"],
              ["Fast", "Low-friction flow"],
              ["Trusted", "Clear service signals"],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-100">
                  {title}
                </p>
                <p className="mt-1 text-sm text-slate-100">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-6">
          <div className="card border border-emerald-100 bg-white/90">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-emerald-600" />
              <div>
                <h2 className="text-3xl font-black text-slate-900">
                  Your cart
                </h2>
                <p className="text-sm text-slate-500">
                  Ready for secure checkout
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <article
                key={item.title}
                className="card border border-emerald-100 bg-white/90 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      {item.title}
                    </p>
                    <p className="text-sm text-slate-500">
                      Quantity: {item.qty}
                    </p>
                  </div>
                  <p className="text-lg font-extrabold text-emerald-700">
                    {item.price}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="card border border-emerald-100 bg-linear-to-br from-slate-900 via-slate-800 to-emerald-900 text-white">
            <h2 className="text-xl font-extrabold">Order summary</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Total</span>
                <span className="font-bold text-white">
                  ${subtotal.toFixed(0)}
                </span>
              </div>
            </div>
            <Link
              href="/login"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Proceed to login
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              [ShieldCheck, "Secure checkout"],
              [Truck, "Fast delivery"],
              [Sparkles, "Premium service"],
            ].map(([Icon, label]) => (
              <div
                key={label}
                className="card border border-emerald-100 bg-white/90"
              >
                <Icon className="text-emerald-600" />
                <p className="mt-3 text-sm font-semibold text-slate-700">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
