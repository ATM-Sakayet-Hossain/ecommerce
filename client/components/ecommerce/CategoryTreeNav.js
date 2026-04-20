import Link from "next/link";

function CategoryTreeNode({ node, activeSlug, basePath = "/categories", depth = 0 }) {
  const isActive = activeSlug === node.slug;

  return (
    <li>
      <Link
        href={`${basePath}/${node.slug}`}
        className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition ${
          isActive
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-slate-50"
        }`}
        style={{ marginLeft: depth * 14 }}
      >
        <span className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-current opacity-40" />
          <span className="font-medium">{node.name}</span>
        </span>
        <span className="rounded-full bg-slate-950 px-2.5 py-1 text-xs font-semibold text-white">
          {node.count}
        </span>
      </Link>

      {node.children.length ? (
        <ul className="mt-2 space-y-2">
          {node.children.map((child) => (
            <CategoryTreeNode key={child.slug} node={child} activeSlug={activeSlug} basePath={basePath} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function CategoryTreeNav({ tree, activeSlug, basePath = "/categories", title = "Browse categories" }) {
  return (
    <aside className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
      <div className="space-y-2 border-b border-slate-200 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Navigation</p>
        <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      </div>

      <ul className="mt-4 space-y-2">
        {tree.map((node) => (
          <CategoryTreeNode key={node.slug} node={node} activeSlug={activeSlug} basePath={basePath} />
        ))}
      </ul>
    </aside>
  );
}

export default CategoryTreeNav;
