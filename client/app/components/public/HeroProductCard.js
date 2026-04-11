import Link from "next/link";
import Image from "next/image";

export default function HeroProductCard({ product }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-xl shadow-slate-200/60 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative aspect-4/3 bg-slate-100">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
          {product.badge}
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
            {product.category}
          </p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">
            {product.title}
          </h3>
          <p className="mt-2 text-sm text-slate-500">{product.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Starting at</p>
            <p className="text-2xl font-extrabold text-slate-900">
              {product.price}
            </p>
          </div>
          <Link
            href={product.href}
            className="inline-flex rounded-full bg-linear-to-r from-emerald-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
