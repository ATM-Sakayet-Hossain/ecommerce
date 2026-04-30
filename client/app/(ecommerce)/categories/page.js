import Image from "next/image";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";

export const metadata = {
  title: "Categories | SakkhorMart",
  description:
    "Browse nested ecommerce categories with slug-based navigation and product counts.",
};

function getFeaturedCategories(categories, limit = 6) {
  return [...categories]
    .sort((left, right) => {
      const orderDelta = (left.sortOrder || 0) - (right.sortOrder || 0);
      return orderDelta !== 0
        ? orderDelta
        : left.name.localeCompare(right.name);
    })
    .slice(0, limit)
    .map((category) => ({
      ...category,
      count: category.count ?? 0,
    }));
}

export default async function Page() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/category/get`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Unable to load categories");
  }

  const payload = await response.json();
  const categories = payload?.data?.categories || payload?.categories || [];
  const featuredCategories = getFeaturedCategories(categories, 9);

  return (
    <PageContainer>
      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
              Featured categories
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-950">
              Sorted by sortOrder and product depth
            </h1>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-600"
          >
            Browse products
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {featuredCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 transition hover:-translate-y-1 hover:border-emerald-200"
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <Image
                  src={category.thumbnail}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0.68))]" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <div className={`text-xs font-semibold uppercase tracking-[0.2em] ${ category.count ? "text-white/70" : "text-red-300"}`}>
                    {category.count ? `${category.count} Products` : "No items"}
                  </div>
                  <h2 className="mt-1 text-xl font-semibold">
                    {category.name}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
