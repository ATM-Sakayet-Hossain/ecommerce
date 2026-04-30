import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import CategoryNav from "@/components/ecommerce/CategoryNav";
import { FiArrowRight, FiStar } from "react-icons/fi";

export const dynamic = "force-dynamic";

function normalizeParent(parent) {
  if (!parent || parent === "null") {
    return null;
  }

  return typeof parent === "string"
    ? parent
    : (parent?._id ?? parent?.slug ?? null);
}

function getCategoryKey(category) {
  return category?.slug ?? null;
}

function getParentCategoryKey(category) {
  return (
    category?.parentData?.slug ??
    category?.parent?.slug ??
    category?.parent ??
    null
  );
}

function buildCategoryTree(categories) {
  const nodeMap = new Map(
    categories.map((category) => [
      getCategoryKey(category),
      {
        ...category,
        parent: getParentCategoryKey(category),
        count: 0,
        children: [],
      },
    ]),
  );

  const roots = [];

  nodeMap.forEach((node) => {
    const parentKey = normalizeParent(node.parent);

    if (parentKey && nodeMap.has(parentKey)) {
      nodeMap.get(parentKey).children.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortNodes = (nodes) => {
    nodes.sort((left, right) => {
      const orderDelta = (left.sortOrder || 0) - (right.sortOrder || 0);
      return orderDelta !== 0
        ? orderDelta
        : left.name.localeCompare(right.name);
    });

    nodes.forEach((node) => sortNodes(node.children));
  };

  sortNodes(roots);

  return roots;
}

function sortByNewest(items) {
  return [...items].sort(
    (left, right) => new Date(right.createdAt) - new Date(left.createdAt),
  );
}

function flattenRoutes(nodes, routes = []) {
  nodes.forEach((node) => {
    routes.push({ slug: node.slug });
    if (node.children.length) {
      flattenRoutes(node.children, routes);
    }
  });

  return routes;
}

function getCategoryChildrenMap(categories) {
  return categories.reduce((map, category) => {
    const parentKey = getParentCategoryKey(category);

    if (!parentKey) {
      return map;
    }

    const children = map.get(parentKey) ?? [];
    children.push(category);
    map.set(parentKey, children);
    return map;
  }, new Map());
}
function getCategoryDescendantSlugs(slug, categoryChildrenMap) {
  const branch = [];
  const stack = [slug];

  while (stack.length) {
    const current = stack.pop();
    if (!current) {
      continue;
    }

    branch.push(current);
    const children = categoryChildrenMap.get(current) ?? [];
    children.forEach((child) => stack.push(child.slug));
  }

  return branch;
}

function getProductCategorySlug(product) {
  return (
    product?.categoryData?.slug ||
    product?.category?.slug ||
    product?.categorySlug ||
    ""
  );
}

function countProductsForSlug(slug, categoryChildrenMap, products) {
  const descendantSlugs = new Set(
    getCategoryDescendantSlugs(slug, categoryChildrenMap),
  );

  return products.filter((product) =>
    descendantSlugs.has(getProductCategorySlug(product)),
  ).length;
}

function applyCategoryCounts(nodes, categoryChildrenMap, products) {
  return nodes.map((node) => ({
    ...node,
    count: countProductsForSlug(node.slug, categoryChildrenMap, products),
    children: applyCategoryCounts(node.children, categoryChildrenMap, products),
  }));
}

function getCategoryBySlug(slug, categoryMap) {
  return categoryMap.get(slug) ?? null;
}

function buildBreadcrumbFromCategory(category, categoryMap) {
  const trail = [];
  let current = category ?? null;

  while (current) {
    trail.unshift({
      slug: current.slug,
      name: current.name,
    });

    const parentSlug = getParentCategoryKey(current);

    if (!parentSlug) {
      break;
    }

    current = categoryMap.get(parentSlug) ?? current.parent ?? null;
  }

  return trail;
}

async function loadCategories() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/category/get?page=1&limit=1000&sortBy=sortOrder&order=asc`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Unable to load categories");
  }

  const payload = await response.json();

  return payload?.data?.categories || payload?.categories || [];
}

async function loadProducts() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/product/get`,
    {
      cache: "no-store",
      next: { revalidate: 0 },
    },
  );

  if (!response.ok) {
    throw new Error("Unable to load products");
  }

  const payload = await response.json();

  return (
    payload?.data?.product || payload?.data?.products || payload?.product || []
  );
}

export async function generateStaticParams() {
  const categories = await loadCategories();
  return flattenRoutes(buildCategoryTree(categories));
}

export async function generateMetadata({ params }) {
  const rawSlug = (await params)?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  const categories = await loadCategories();
  const categoryMap = new Map(
    categories.map((category) => [category.slug, category]),
  );
  const category = getCategoryBySlug(slug, categoryMap);

  if (!category) {
    return { title: "Category not found | SakkhorMart" };
  }

  return {
    title: `${category.name} | SakkhorMart`,
    description: `Browse products in the ${category.name} category at SakkhorMart.`,
  };
}

export default async function Page({ params }) {
  const rawSlug = (await params)?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  const [categories, products] = await Promise.all([
    loadCategories(),
    loadProducts(),
  ]);
  const categoryMap = new Map(
    categories.map((category) => [category.slug, category]),
  );
  const categoryChildrenMap = getCategoryChildrenMap(categories);
  const category = getCategoryBySlug(slug, categoryMap);

  if (!category) {
    notFound();
  }

  const categoryPath = buildBreadcrumbFromCategory(category, categoryMap);
  const data = applyCategoryCounts(
    buildCategoryTree(categories),
    categoryChildrenMap,
    products,
  );
  const descendantSlugs = new Set(
    getCategoryDescendantSlugs(slug, categoryChildrenMap),
  );
  const filteredProducts = sortByNewest(
    products.filter((product) => {
      const productCategorySlug = getProductCategorySlug(product);

      return descendantSlugs.has(productCategorySlug);
    }),
  );
  const productCount = filteredProducts.length;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);

  const getProductStock = (product) => {
    if (typeof product?.stock === "number") {
      return product.stock;
    }

    if (Array.isArray(product?.variants)) {
      return product.variants.reduce(
        (total, variant) => total + (Number(variant?.stock) || 0),
        0,
      );
    }

    return 0;
  };

  return (
    <PageContainer>
      <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <CategoryNav
          data={data}
          activeSlug={slug}
          activeSlugs={new Set(categoryPath.map((item) => item.slug))}
        />

        <div className="space-y-5 mt-5">
          <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4 p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {categoryPath.map((item, index) => (
                    <span
                      key={`${item.slug}-${index}`}
                      className="flex items-center gap-2"
                    >
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
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    {category.name}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                    {productCount} products live in this category. The tree
                    remains sorted by sortOrder, and parent branches roll up the
                    total from their descendants.
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xl font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Total Product
                  </div>
                  <div
                    className={`text-xl pr-5 font-bold uppercase tracking-[0.2em] ${category.count ? "text-green-700" : "text-red-300"}`}
                  >
                    {productCount || 0}
                  </div>
                </div>
              </div>

              <div className="relative min-h-72">
                <Image
                  src={category?.thumbnail}
                  alt={category?.name}
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
              <div
                key={product.slug}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-slate-100">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                  />
                </div>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">
                      {product.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {product.brand || "Brand not listed"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white">
                    {formatCurrency(product.price)}
                  </div>
                </div>
                {/* <p className="mt-2 text-sm leading-6 text-slate-600">
                  {product.description}
                </p> */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {(product.tags || []).slice(0, 3).map((tag) => (
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
                    {getProductStock(product) > 0
                      ? `${getProductStock(product)} in stock`
                      : "Out of stock"}
                  </span>
                </div>
              </div>
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
