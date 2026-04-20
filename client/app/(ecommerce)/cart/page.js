import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import CartSystem from "@/components/ecommerce/CartSystem";

export const metadata = {
  title: "Cart | SakkhorMart",
  description: "Persistent, SKU-validated cart with backend sync and live recalculation.",
};

export default function Page() {
  return (
    <PageContainer className="py-6 sm:py-8 lg:py-12">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Cart to checkout</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Persistent cart with live validation</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Quantities, SKU checks, stock limits, and pricing all stay in sync with the backend route. Use this page to validate the order flow before checkout.
          </p>
        </div>
        <Link href="/dashboard" className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-emerald-600">
          Review checkout pipeline
        </Link>
      </div>

      <CartSystem />
    </PageContainer>
  );
}
