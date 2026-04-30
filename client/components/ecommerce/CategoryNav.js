import Link from "next/link";

const CategoryList = ({
  data,
  activeSlug,
  basePath = "/categories",
}) => {
  const isActive = data.slug === activeSlug;

  return (
    <li>
      <Link
        href={`${basePath}/${data.slug}`}
        className={`flex items-center justify-between rounded-2xl border px-4 py-2 transition ${
          isActive
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-slate-50"
        }`}
      >
        <span className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-current opacity-40" />
          <span className="font-medium">{data.name}</span>
        </span>
        <span
          className={`rounded-full text-white px-2.5 py-1 text-xs font-semibold ${data.count ? "bg-green-700" : "bg-red-700"}`}
        >
          {data.count || 0}
        </span>
      </Link>

      {data.children?.length ? (
        <ul className="mt-2 space-y-2">
          {data.children.map((child) => (
            <CategoryList
              key={child.slug}
              data={child}
              activeSlug={activeSlug}
              basePath={basePath}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
};

const CategoryNav = ({ data = [], activeSlug, basePath = "/categories" }) => {
  return (
    <aside className="p-5 lg:p-6">
      <div className="space-y-2 border-b border-slate-200 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
          Navigation
        </p>
        <h2 className="text-xl font-semibold text-slate-950">Category List</h2>
      </div>

      <ul className="mt-4 space-y-1">
        {data.map((data) => (
          <CategoryList
            key={data.slug}
            data={data}
            activeSlug={activeSlug}
            basePath={basePath}
          />
        ))}
      </ul>
    </aside>
  );
};

export default CategoryNav;
