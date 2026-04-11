import Link from "next/link";
import { Plus, Eye } from "lucide-react";

const defaultStatusClass = {
  active: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  completed: "bg-sky-100 text-sky-700",
  failed: "bg-red-100 text-red-700",
  suspended: "bg-slate-200 text-slate-700",
  paid: "bg-emerald-100 text-emerald-700",
  confirmed: "bg-cyan-100 text-cyan-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
  inactive: "bg-slate-200 text-slate-700",
  banned: "bg-rose-100 text-rose-700",
};

export default function AdminModuleListPage({
  title,
  subtitle,
  actionLabel,
  actionHref,
  basePath,
  stats = [],
  rows = [],
  columns = [],
}) {
  return (
    <section className="space-y-6">
      <div className="card border border-emerald-100 bg-linear-to-r from-emerald-600 to-cyan-600 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
            <p className="text-sm text-emerald-50">{subtitle}</p>
          </div>
          {actionHref && actionLabel ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2 text-sm font-semibold text-emerald-700 shadow hover:bg-white"
            >
              <Plus size={16} />
              {actionLabel}
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="card border border-emerald-100 bg-white/95"
          >
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {stat.label}
            </p>
            <p className="mt-1 text-3xl font-extrabold text-slate-900">
              {stat.value}
            </p>
            {stat.helper ? (
              <p className="mt-1 text-xs text-slate-500">{stat.helper}</p>
            ) : null}
          </article>
        ))}
      </div>

      <div className="card border border-emerald-100 bg-white/95">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">{title} Overview</h2>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {rows.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                {columns.map((column) => (
                  <th key={column.key} className="px-3 py-2 font-semibold">
                    {column.label}
                  </th>
                ))}
                <th className="px-3 py-2 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 transition hover:bg-emerald-50/50"
                >
                  {columns.map((column) => (
                    <td
                      key={`${row.id}-${column.key}`}
                      className="px-3 py-3 text-slate-700"
                    >
                      {column.key === "status" ? (
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            defaultStatusClass[
                              String(row.status).toLowerCase()
                            ] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {row.status}
                        </span>
                      ) : (
                        row[column.key]
                      )}
                    </td>
                  ))}
                  <td className="px-3 py-3">
                    <Link
                      href={`${basePath}/${row.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                    >
                      <Eye size={14} />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-3 py-10 text-center text-sm text-slate-500"
                  >
                    No records found from the current server route.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
