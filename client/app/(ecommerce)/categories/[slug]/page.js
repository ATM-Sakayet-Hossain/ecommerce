import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import CategoryTreeNav from "@/components/ecommerce/CategoryTreeNav";
import {
  buildCategoryTree,
  currency,
  filterProducts,
  getCategoryBySlug,
  getCategoryPath,
  getCategoryProductCount,
  products,
  sortProducts,
} from "@/components/ecommerce/data";
import { FiArrowRight, FiStar } from "react-icons/fi";

function flattenRoutes(nodes, routes = []) {
  nodes.forEach((node) => {
    routes.push({ slug: node.slug });
    if (node.children.length) {
      flattenRoutes(node.children, routes);
    }
  });

  return routes;
}

export async function generateStaticParams() {
  return flattenRoutes(buildCategoryTree());
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category not found | SakkhorMart" };
  }

  return {
    title: `${category.name} | SakkhorMart`,
    description: `Browse ${getCategoryProductCount(slug)} products in the ${category.name} category at SakkhorMart.`,
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryPath = getCategoryPath(slug);
  const tree = buildCategoryTree();
  const filteredProducts = sortProducts(
    filterProducts(products, { category: slug }),
    "newest",
  );
  const productCount = getCategoryProductCount(slug);

  return (
    <PageContainer className="py-6 sm:py-8 lg:py-12">
      <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <CategoryTreeNav tree={tree} activeSlug={slug} title="Category tree" />

        <div className="space-y-5">
          <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4 p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {categoryPath.map((item, index) => (
                    <span key={item.slug} className="flex items-center gap-2">
                      <Link
                        href={`/categories/${item.slug}`}
                        className="text-emerald-700 transition hover:text-emerald-600"
                      >
                        {item.name}
                      </Link>
                      {index < categoryPath.length - 1 ? (
                        <FiArrowRight size={12} />
                      ) : null}
                    </span>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                    SEO slug route
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    {category.name}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                    {productCount} products live in this category. The tree
                    remains sorted by sortOrder, and parent branches roll up the
                    total from their descendants.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Product count
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-slate-950">
                      {productCount}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Slug
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-slate-950">
                      /{slug}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Visibility
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-slate-950">
                      Indexed
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative min-h-[18rem]">
                <Image
                  src={category.thumbnail}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0.6))]" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur-sm">
                    <FiStar size={12} />
                    Category spotlight
                  </div>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-slate-100">
                    Browse products in a stable slug route that search engines
                    can index and users can share.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.sku}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-slate-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                  />
                </div>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">
                      {product.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {product.brand}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white">
                    {currency(product.price)}
                  </div>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {product.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-600"
                  >
                    View details
                    <FiArrowRight size={14} />
                  </Link>
                  <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="flex justify-end">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Explore the full shop
              <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
