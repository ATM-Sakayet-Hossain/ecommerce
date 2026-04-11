import Image from "next/image";
import Link from "next/link";
import HeroProductCard from "../../../../components/public/HeroProductCard";
import {
  BadgeCheck,
  ChevronRight,
  Clock3,
  Heart,
  RefreshCcw,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";

const API_BASE_URL = (
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:1993"
).replace(/\/$/, "");

async function getProduct(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/product/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const payload = await res.json();
    return payload?.data || payload;
  } catch {
    return null;
  }
}

async function getCatalogProducts() {
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

const starCount = (rating) => Math.max(0, Math.min(5, Math.round(rating)));

export default async function Page({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  const catalogProducts = await getCatalogProducts();

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="card border border-emerald-100 text-center">
          <p className="text-lg font-bold text-slate-900">Product not found</p>
          <p className="mt-2 text-sm text-slate-500">
            The requested item is unavailable right now.
          </p>
          <Link
            href="/shop/products"
            className="mt-5 inline-flex rounded-full bg-linear-to-r from-emerald-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const galleryImages = [product?.thumbnail, ...(product?.images || [])].filter(
    Boolean,
  );
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const reviews = Array.isArray(product?.reviews) ? product.reviews : [];
  const reviewCount = reviews.length || 128;
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + Number(review?.rating || 0), 0) /
      reviews.length
    : 4.8;

  const relatedProducts = catalogProducts
    .filter((item) => {
      const currentId = String(
        product?._id || product?.id || product?.slug || "",
      );
      const itemId = String(item?._id || item?.id || item?.slug || "");
      if (itemId && currentId && itemId === currentId) return false;

      const currentCategory = String(
        product?.brand || product?.category?.name || product?.category || "",
      ).toLowerCase();
      const itemCategory = String(
        item?.brand || item?.category?.name || item?.category || "",
      ).toLowerCase();

      if (currentCategory && itemCategory) {
        return currentCategory === itemCategory;
      }

      return true;
    })
    .slice(0, 4)
    .map((item) => ({
      title: item?.title || "Related product",
      category: item?.brand || item?.category?.name || "Premium",
      price: formatCurrency(item?.price),
      badge: "Related product",
      image: item?.thumbnail || "/placeholder.png",
      href: `/shop/products/${item?.slug || item?._id}`,
      description:
        item?.description ||
        "Recommended because it matches the current collection.",
    }));

  const fallbackRelatedProducts = [
    {
      title: "Premium Audio",
      category: "Sound",
      price: "$149",
      badge: "Related product",
      image:
        "https://images.unsplash.com/photo-1518441902117-f0a0bde2f9e0?w=1200",
      href: "/shop/products",
      description: "Immersive sound and daily comfort.",
    },
    {
      title: "Smart Watches",
      category: "Wearables",
      price: "$199",
      badge: "Related product",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200",
      href: "/shop/products",
      description: "Connected, refined, and always ready.",
    },
    {
      title: "Gaming Setup",
      category: "Desk Gear",
      price: "$89",
      badge: "Related product",
      image:
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1200",
      href: "/shop/products",
      description: "Precision gear for a sharper workspace.",
    },
    {
      title: "Studio Desk Lamp",
      category: "Home Tech",
      price: "$69",
      badge: "Related product",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
      href: "/shop/products",
      description: "Warm light and a cleaner desktop silhouette.",
    },
  ];

  const displayRelatedProducts =
    relatedProducts.length > 0 ? relatedProducts : fallbackRelatedProducts;
  const displayGallery =
    galleryImages.length > 0
      ? galleryImages
      : ["/placeholder.png", "/placeholder.png", "/placeholder.png"];

  const colorVariants = variants.map((variant, index) => ({
    ...variant,
    accent: variant?.color?.toLowerCase().includes("black")
      ? "bg-slate-900"
      : variant?.color?.toLowerCase().includes("white")
        ? "bg-slate-200"
        : variant?.color?.toLowerCase().includes("silver")
          ? "bg-slate-400"
          : variant?.color?.toLowerCase().includes("blue")
            ? "bg-sky-500"
            : variant?.color?.toLowerCase().includes("red")
              ? "bg-rose-500"
              : "bg-emerald-500",
    isFeatured: index === 0,
  }));

  const productHighlights = [
    {
      title: "Fast delivery",
      text: "Optimized routing and clear fulfillment updates from cart to door.",
      icon: Truck,
    },
    {
      title: "Protected checkout",
      text: "Built for reliable payment flow and trust across every touchpoint.",
      icon: ShieldCheck,
    },
    {
      title: "Easy returns",
      text: "A simple return path keeps the purchase decision low-risk.",
      icon: RefreshCcw,
    },
  ];

  const breadcrumbLabel =
    product?.brand || product?.category?.name || "Premium";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <section className="mb-6 rounded-4xl border border-white/70 bg-white/85 px-5 py-4 shadow-lg shadow-slate-200/60 backdrop-blur md:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">
              Product detail
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {breadcrumbLabel} / {product?.title}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <BadgeCheck className="text-emerald-600" size={16} />
            In stock and ready to ship
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-6 lg:sticky lg:top-24 self-start">
          <div className="overflow-hidden rounded-4xl border border-white/70 bg-white shadow-2xl shadow-slate-200/60">
            <div className="relative aspect-4/3 bg-slate-100">
              <Image
                src={displayGallery[0]}
                alt={product.title || "Product"}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                {breadcrumbLabel}
              </div>
              <button
                type="button"
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-white"
                aria-label="Save product"
              >
                <Heart size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {displayGallery.slice(0, 5).map((image, index) => (
              <div
                key={`${image}-${index}`}
                className={`relative aspect-square overflow-hidden rounded-3xl border shadow-lg ${
                  index === 0
                    ? "border-emerald-300 ring-2 ring-emerald-200"
                    : "border-white/70"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.title} gallery ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {productHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="card border border-white/70 bg-white/90"
                >
                  <Icon className="text-emerald-600" size={18} />
                  <p className="mt-3 text-sm font-semibold text-slate-900">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card border border-emerald-100 bg-white/90">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">
              <span>{breadcrumbLabel}</span>
              <span className="text-slate-300">|</span>
              <span>
                {variants.length
                  ? `${variants.length} variants`
                  : "Premium pick"}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-black text-slate-900 md:text-5xl">
                {product.title}
              </h1>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                New season
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={16}
                    fill={
                      index < starCount(averageRating) ? "currentColor" : "none"
                    }
                  />
                ))}
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {averageRating.toFixed(1)} rating
              </p>
              <p className="text-sm text-slate-500">({reviewCount} reviews)</p>
            </div>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              {product.description}
            </p>

            <div className="mt-6 flex items-end gap-4">
              <p className="text-4xl font-black text-slate-900 md:text-5xl">
                {formatCurrency(product.price)}
              </p>
              {product.discountPrice ? (
                <p className="pb-1 text-sm text-slate-500 line-through">
                  {formatCurrency(product.discountPrice)}
                </p>
              ) : null}
              <p className="pb-1 text-sm font-semibold text-emerald-700">
                Save now
              </p>
            </div>
          </div>

          <div className="card border border-emerald-100 bg-white/90">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900">
                Choose your variant
              </h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                Swatches
              </span>
            </div>

            <div className="mt-4 grid gap-4">
              {colorVariants.length > 0 ? (
                colorVariants.map((variant) => (
                  <div
                    key={variant.sku}
                    className={`rounded-3xl border p-4 transition ${
                      variant.isFeatured
                        ? "border-emerald-300 bg-emerald-50/60"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-4 w-4 rounded-full ring-4 ring-white ${variant.accent}`}
                        />
                        <div>
                          <p className="font-semibold text-slate-900">
                            {variant.color} / {variant.size}
                          </p>
                          <p className="text-xs text-slate-500">
                            SKU: {variant.sku}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">
                          Stock {variant.stock}
                        </p>
                        <p className="text-xs text-slate-500">Ready to ship</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                  No variant data available for this product.
                </div>
              )}
            </div>
          </div>

          <div className="card border border-emerald-100 bg-linear-to-br from-slate-900 via-slate-800 to-emerald-900 text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
              <Clock3 size={14} />
              Limited release
            </div>
            <h2 className="mt-3 text-2xl font-black md:text-3xl">
              Ready to buy
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">
              Premium presentation, clear value framing, and one-step purchase
              actions are the difference between a simple detail page and a page
              that converts.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shopping-cart"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Add to cart
              </Link>
              <Link
                href="/shop/products"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Continue shopping
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Compare
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card border border-white/70 bg-white/90">
              <div className="flex items-center gap-2 text-emerald-600">
                <BadgeCheck size={18} />
                <p className="text-sm font-semibold text-slate-900">
                  Verified product
                </p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Backed by curated catalog data and premium presentation.
              </p>
            </div>
            <div className="card border border-white/70 bg-white/90">
              <div className="flex items-center gap-2 text-emerald-600">
                <ChevronRight size={18} />
                <p className="text-sm font-semibold text-slate-900">
                  Fast decision path
                </p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Structured content guides the shopper from interest to action.
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-16 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">
              Customers also bought
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900 md:text-4xl">
              More from this collection
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Cross-sells and related items keep the page useful after the first
              scroll and give the PDP a more complete retail feel.
            </p>
          </div>
          <Link
            href="/shop/products"
            className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
          >
            View all products
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {displayRelatedProducts.map((item) => (
            <div key={item.title} className="h-full">
              <HeroProductCard product={item} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
