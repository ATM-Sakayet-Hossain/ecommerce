import Link from "next/link";
import Image from "next/image";

const API_BASE_URL = (
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:1993"
).replace(/\/$/, "");

async function getProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/product/get?page=1&limit=12`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const payload = await res.json();
    return payload?.data?.product || [];
  } catch {
    return [];
  }
}

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));

export default async function Page() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <section className="card mb-8 overflow-hidden border border-white/70 bg-linear-to-r from-slate-900 via-slate-800 to-emerald-800 text-white shadow-2xl shadow-slate-200/70">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
              Shop
            </p>
            <h1 className="max-w-2xl text-4xl font-black tracking-tight md:text-6xl">
              Curated products for everyday upgrades
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-200 md:text-base">
              Browse premium gear, discover new arrivals, and move from
              inspiration to checkout quickly.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              ["Fast shipping", "Clear delivery windows"],
              ["Secure checkout", "Trusted payment flow"],
              ["Live support", "Quick order help"],
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

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">
            Collection
          </p>
          <p className="max-w-2xl text-slate-600">
            The list below is intentionally minimal and editorial, so the
            product images and pricing do the visual work.
          </p>
        </div>
        <div className="rounded-4xl border border-emerald-100 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Available
          </p>
          <p className="text-2xl font-extrabold text-slate-900">
            {products.length} items
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article
            key={product?._id || product?.slug}
            className="group overflow-hidden rounded-4xl border border-white/70 bg-white/90 shadow-xl shadow-slate-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="relative aspect-4/3 bg-slate-100">
              <Image
                src={product.thumbnail || "/placeholder.png"}
                alt={product.title || "Product"}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                {product.brand || product?.category?.name || "Premium"}
              </div>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {product.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                  {product.description}
                </p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xl font-extrabold text-slate-900">
                  {formatCurrency(product.price)}
                </p>
                <Link
                  href={`/shop/products/${product.slug}`}
                  className="rounded-full bg-linear-to-r from-emerald-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5"
                >
                  View
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {products.length === 0 && (
        <div className="card mt-8 border border-emerald-100 text-center">
          <p className="text-lg font-bold text-slate-900">No products found</p>
          <p className="mt-2 text-sm text-slate-500">
            The storefront is ready, but the current backend returned no items.
          </p>
        </div>
      )}
    </div>
  );
}
