import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import {
  currency,
  findProductBySlug,
  getCategoryBySlug,
  getCategoryPath,
  products,
  reviews,
} from "@/components/ecommerce/data";
import { FiArrowRight, FiPackage, FiStar, FiTag } from "react-icons/fi";

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = findProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found | SakkhorMart",
    };
  }

  return {
    title: `${product.name} | SakkhorMart`,
    description: product.description,
  };
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

export default async function Page({ params }) {
  const { slug } = await params;
  const product = findProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const category = getCategoryBySlug(product.categorySlug);
  const categoryTrail = category ? getCategoryPath(category.slug) : [];
  const relatedProducts = products
    .filter(
      (item) =>
        item.slug !== product.slug &&
        item.categorySlug === product.categorySlug,
    )
    .sort(
      (left, right) =>
        right.rating - left.rating || right.createdAt - left.createdAt,
    )
    .slice(0, 3);
  const productReviews = reviews.filter(
    (review) => review.productSlug === product.slug,
  );
  const averageRating = productReviews.length
    ? Number(
        (
          productReviews.reduce((sum, review) => sum + review.rating, 0) /
          productReviews.length
        ).toFixed(1),
      )
    : product.rating;
  const reviewCount = productReviews.length || 1;
  const stockLabel =
    product.stock > 0 ? `${product.stock} in stock` : "Out of stock";

  return (
    <PageContainer className="py-6 sm:py-8 lg:py-12">
      <section className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          <Link
            href="/shop"
            className="text-emerald-700 transition hover:text-emerald-600"
          >
            Shop
          </Link>
          <FiArrowRight size={12} />
          {categoryTrail.length ? (
            <>
              {categoryTrail.map((item, index) => (
                <span key={item.slug} className="flex items-center gap-2">
                  <Link
                    href={`/categories/${item.slug}`}
                    className="text-emerald-700 transition hover:text-emerald-600"
                  >
                    {item.name}
                  </Link>
                  {index < categoryTrail.length - 1 ? (
                    <FiArrowRight size={12} />
                  ) : null}
                </span>
              ))}
              <FiArrowRight size={12} />
            </>
          ) : null}
          <span className="text-slate-500">{product.name}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm">
            <div className="relative aspect-4/3 bg-slate-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 52vw"
                priority
              />
              <div className="absolute left-4 top-4 rounded-full bg-slate-950/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {product.slug}
              </div>
              <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 backdrop-blur-sm">
                {stockLabel}
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                Product slug route
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                {product.description}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Price
                </div>
                <div className="mt-1 text-2xl font-semibold text-slate-950">
                  {currency(product.price)}
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Rating
                </div>
                <div className="mt-1 text-2xl font-semibold text-slate-950">
                  {averageRating}
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  SKU
                </div>
                <div className="mt-1 text-2xl font-semibold text-slate-950">
                  {product.sku}
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Reviews
                </div>
                <div className="mt-1 text-2xl font-semibold text-slate-950">
                  {reviewCount}
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FiPackage className="text-emerald-700" />
                  Inventory
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {product.stock > 0
                    ? "Available for immediate purchase."
                    : "Temporarily unavailable."}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FiStar className="text-emerald-700" />
                  Community rating
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {productReviews.length
                    ? `${productReviews.length} verified reviews with an average of ${averageRating} stars.`
                    : `${product.rating} average stars from the catalog.`}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                <FiTag className="text-emerald-700" />
                Highlights
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Open cart
                <FiArrowRight size={14} />
              </Link>
              <Link
                href={category ? `/categories/${category.slug}` : "/categories"}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
              >
                View category
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
              Details
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Built from the same ecommerce data source
            </h2>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                <span>Brand</span>
                <span className="font-semibold text-slate-950">
                  {product.brand}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                <span>Category</span>
                <span className="font-semibold text-slate-950">
                  {category?.name ?? product.categorySlug}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                <span>Slug</span>
                <span className="font-semibold text-slate-950">
                  /{product.slug}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                <span>Availability</span>
                <span className="font-semibold text-slate-950">
                  {stockLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                  Reviews
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  What shoppers said
                </h2>
              </div>
              <div className="rounded-full bg-slate-950 px-3 py-1.5 text-sm font-semibold text-white">
                {averageRating} / 5
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {productReviews.length ? (
                productReviews.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-slate-950">
                          {review.user.name}
                        </div>
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          {formatDate(review.createdAt)}
                        </div>
                      </div>
                      <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                        {review.rating} stars
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {review.comment}
                    </p>
                  </article>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                  This product does not have reviews yet, but the catalog rating
                  is already populated.
                </div>
              )}
            </div>
          </div>
        </div>

        {relatedProducts.length ? (
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                  Related products
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  More in this category
                </h2>
              </div>
              <Link
                href={category ? `/categories/${category.slug}` : "/categories"}
                className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-600"
              >
                View all
              </Link>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {relatedProducts.map((item) => (
                <Link
                  key={item.slug}
                  href={`/products/${item.slug}`}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 transition hover:-translate-y-1 hover:border-emerald-200"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="space-y-2 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950">
                          {item.name}
                        </h3>
                        <p className="text-sm text-slate-500">{item.brand}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white">
                        {currency(item.price)}
                      </div>
                    </div>
                    <p className="text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition group-hover:text-emerald-600">
                      View details
                      <FiArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </PageContainer>
  );
}
