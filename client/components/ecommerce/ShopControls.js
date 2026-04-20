"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function flattenCategories(nodes, depth = 0, result = []) {
  nodes.forEach((node) => {
    result.push({ slug: node.slug, label: `${"- ".repeat(depth)}${node.name}`, count: node.count });
    if (node.children.length) {
      flattenCategories(node.children, depth + 1, result);
    }
  });

  return result;
}

function ShopControls({ tree, brands, tags, filters, priceRange, totalCount }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [localFilters, setLocalFilters] = useState(filters);

  const categoryOptions = useMemo(() => flattenCategories(tree), [tree]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const commit = (nextFilters) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    params.delete("cursor");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    commit(localFilters);
  };

  const handleFieldChange = (field, value) => {
    setLocalFilters((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Sort</p>
          <p className="text-sm text-slate-600">{totalCount} products available after filters</p>
        </div>
        <label className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600">Order by</span>
          <select
            value={filters.sort}
            onChange={(event) => commit({ ...localFilters, sort: event.target.value })}
            className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white"
          >
            <option value="newest">Newest</option>
            <option value="rating">Rating</option>
            <option value="price_asc">Price low-high</option>
            <option value="price_desc">Price high-low</option>
          </select>
        </label>
      </div>

      <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Search</label>
            <input
              type="search"
              value={localFilters.query}
              onChange={(event) => handleFieldChange("query", event.target.value)}
              placeholder="Search products, brands, or tags"
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Category</label>
            <select
              value={localFilters.category}
              onChange={(event) => handleFieldChange("category", event.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
            >
              <option value="">All categories</option>
              {categoryOptions.map((option) => (
                <option key={option.slug} value={option.slug}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Min price</label>
              <input
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                value={localFilters.minPrice}
                onChange={(event) => handleFieldChange("minPrice", event.target.value)}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Max price</label>
              <input
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                value={localFilters.maxPrice}
                onChange={(event) => handleFieldChange("maxPrice", event.target.value)}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Brand</label>
            <select
              value={localFilters.brand}
              onChange={(event) => handleFieldChange("brand", event.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
            >
              <option value="">All brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Rating</label>
            <select
              value={localFilters.rating}
              onChange={(event) => handleFieldChange("rating", event.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
            >
              <option value="">Any rating</option>
              <option value="4">4 stars and up</option>
              <option value="4.5">4.5 stars and up</option>
              <option value="4.8">4.8 stars and up</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Tags</label>
            <input
              type="text"
              value={localFilters.tags}
              onChange={(event) => handleFieldChange("tags", event.target.value)}
              placeholder="comma-separated tags"
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
            />
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={String(localFilters.inStock).toLowerCase() === "true"}
              onChange={(event) => handleFieldChange("inStock", event.target.checked ? "true" : "")}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            In stock only
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Apply filters
            </button>
            <button
              type="button"
              onClick={() => {
                const reset = {
                  query: "",
                  category: "",
                  brand: "",
                  minPrice: "",
                  maxPrice: "",
                  rating: "",
                  tags: "",
                  inStock: "",
                  sort: "newest",
                };
                setLocalFilters(reset);
                commit(reset);
              }}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
            >
              Reset
            </button>
          </div>
        </form>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-200 pt-4">
          {tags.slice(0, 8).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => commit({ ...localFilters, tags: tag })}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700"
            >
              {tag}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}

export default ShopControls;
