import Image from "next/image";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import ShopControls from "@/components/ecommerce/ShopControls";
import {
  buildCategoryTree,
  currency,
  filterProducts,
  getBrands,
  getPriceRange,
  getTags,
  paginateProducts,
  parseShopFilters,
  products,
  sortProducts,
} from "@/components/ecommerce/data";
import { FiArrowLeft, FiArrowRight, FiClock, FiLayers, FiSearch, FiStar } from "react-icons/fi";

export const metadata = {
  title: "Shop | SakkhorMart",
  description: "Server-side filtered product browsing with category, brand, rating, price, and stock controls.",
};

function buildQueryString(source, overrides = {}) {
  const params = new URLSearchParams();
  const merged = { ...(source ?? {}), ...overrides };

  Object.entries(merged).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  return params.toString();
}

export default async function Page({ searchParams }) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const filters = parseShopFilters(resolvedSearchParams);
  const tree = buildCategoryTree();
  const filteredProducts = sortProducts(filterProducts(products, filters), filters.sort);
  const pagination = paginateProducts(filteredProducts, {
    cursor: filters.cursor,
    page: filters.page,
    limit: filters.limit,
  });
  const priceRange = getPriceRange(products);

  return (
    <PageContainer className="py-6 sm:py-8 lg:py-12">
      <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <ShopControls
          tree={tree}
          brands={getBrands()}
          tags={getTags()}
          filters={filters}
          priceRange={priceRange}
          totalCount={pagination.totalCount}
        />

        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
              <FiSearch className="text-emerald-600" size={20} />
              <div className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Query</div>
              <div className="mt-1 text-lg font-semibold text-slate-950">{filters.query || "All products"}</div>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
              <FiLayers className="text-emerald-600" size={20} />
              <div className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Filters</div>
              <div className="mt-1 text-lg font-semibold text-slate-950">{pagination.totalCount} matches</div>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
              <FiStar className="text-emerald-600" size={20} />
              <div className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Rating</div>
              <div className="mt-1 text-lg font-semibold text-slate-950">{filters.rating ? `${filters.rating}+` : "Any"}</div>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
              <FiClock className="text-emerald-600" size={20} />
              <div className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Page</div>
              <div className="mt-1 text-lg font-semibold text-slate-950">{pagination.currentPage} of {pagination.totalPages}</div>
            </div>
          </div>

          {pagination.totalCount ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {pagination.pageItems.map((product) => (
                <article
                  key={product.sku}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-emerald-200"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading="lazy"
                    />
                    <div className="absolute left-4 top-4 rounded-full bg-slate-950/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {product.categorySlug}
                    </div>
                    <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 backdrop-blur-sm">
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </div>
                  </div>

                  <div className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-950">{product.name}</h2>
                        <p className="mt-1 text-sm text-slate-500">{product.brand}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white">
                        {currency(product.price)}
                      </div>
                    </div>

                    <p className="text-sm leading-6 text-slate-600">{product.description}</p>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      <span className="rounded-full border border-slate-200 px-2.5 py-1">{product.rating} rating</span>
                      <span className="rounded-full border border-slate-200 px-2.5 py-1">SKU {product.sku}</span>
                      {product.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="rounded-full border border-slate-200 px-2.5 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <Link
                        href={`/categories/${product.categorySlug}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-600"
                      >
                        View category
                        <FiArrowRight size={14} />
                      </Link>
                      <Link
                        href="/cart"
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
                      >
                        Open cart
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <FiSearch className="mx-auto text-slate-400" size={32} />
              <h2 className="mt-4 text-2xl font-semibold text-slate-950">No products matched your filters</h2>
              <p className="mt-2 text-sm text-slate-600">
                Try widening the price range, clearing tags, or switching categories.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm text-slate-600">
              Showing {pagination.pageItems.length} of {pagination.totalCount} filtered products
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={pagination.hasPreviousPage ? `?${buildQueryString(resolvedSearchParams, { cursor: pagination.previousCursor ?? "", page: filters.page, sort: filters.sort })}` : "#"}
                aria-disabled={!pagination.hasPreviousPage}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-slate-700 transition ${pagination.hasPreviousPage ? "border-slate-200 hover:border-emerald-200 hover:text-emerald-700" : "pointer-events-none border-slate-100 text-slate-300"}`}
              >
                <FiArrowLeft size={16} />
              </Link>
              <Link
                href={pagination.hasNextPage ? `?${buildQueryString(resolvedSearchParams, { cursor: pagination.nextCursor ?? "", page: filters.page, sort: filters.sort })}` : "#"}
                aria-disabled={!pagination.hasNextPage}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-slate-700 transition ${pagination.hasNextPage ? "border-slate-200 hover:border-emerald-200 hover:text-emerald-700" : "pointer-events-none border-slate-100 text-slate-300"}`}
              >
                <FiArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
