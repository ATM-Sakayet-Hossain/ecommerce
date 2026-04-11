import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  CircleDollarSign,
} from "lucide-react";

const statusClass = {
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

export default function AdminModuleDetailPage({
  title,
  basePath,
  record,
  metaFields = [],
}) {
  return (
    <section className="space-y-6">
      <div className="card border border-emerald-100 bg-linear-to-r from-slate-900 via-slate-800 to-emerald-800 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-emerald-100">
              Detail View
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight">
              {title} #{record.id}
            </h1>
            <p className="text-sm text-slate-200">
              Production-grade summary and management actions.
            </p>
          </div>
          <Link
            href={basePath}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="card border border-emerald-100">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Status
          </p>
          <p className="mt-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                statusClass[String(record.status).toLowerCase()] ||
                "bg-slate-100 text-slate-700"
              }`}
            >
              {record.status}
            </span>
          </p>
        </article>
        <article className="card border border-emerald-100">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Amount
          </p>
          <p className="mt-2 inline-flex items-center gap-2 text-2xl font-extrabold text-slate-900">
            <CircleDollarSign size={20} className="text-emerald-600" />
            {record.amount}
          </p>
        </article>
        <article className="card border border-emerald-100">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Updated
          </p>
          <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
            <CalendarClock size={16} className="text-cyan-700" />
            {record.date}
          </p>
        </article>
      </div>

      <div className="card border border-emerald-100">
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Record Information
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {metaFields.map((field) => (
            <div
              key={field.label}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {field.label}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {field.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="card border border-emerald-100 bg-emerald-50/60">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
          <BadgeCheck size={16} />
          This page is mapped to your server routes and normalized from backend
          records.
        </p>
      </div>
    </section>
  );
}
