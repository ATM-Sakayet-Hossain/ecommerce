"use client";

import Link from "next/link";
import {
  Plus,
  PencilLine,
  CalendarDays,
  Image as ImageIcon,
} from "lucide-react";
import { useGetBannerQuery } from "@/app/(admin)/services/api";
import { formatDateTimeLocalValue } from "@/lib/dateTime";

const formatDate = (value) => {
  if (!value) {
    return "-";
  }
  const localValue = formatDateTimeLocalValue(value);
  if (!localValue) {
    return "-";
  }
  const date = new Date(`${localValue}:00+06:00`);
  return Number.isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Dhaka",
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
};

const Page = () => {
  const {
    data: bannerResponse,
    isLoading,
    isError,
  } = useGetBannerQuery({
    page: 1,
    limit: 50,
  });

  const banners =
    bannerResponse?.data?.banners || bannerResponse?.banners || [];
  const activeCount = banners.filter(
    (banner) => banner?.isActive !== false,
  ).length;
  const inactiveCount = banners.filter(
    (banner) => banner?.isActive === false,
  ).length;

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-emerald-100 bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 text-white shadow-lg shadow-emerald-100/50">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100">
              Banner Manager
            </p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Control homepage campaigns from one place.
            </h1>
            <p className="text-sm leading-6 text-emerald-50">
              Create timed promotions, review current placements, and edit any
              banner by slug.
            </p>
          </div>

          <Link
            href="/admin/banner/createBanner"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-emerald-700 shadow transition hover:bg-emerald-50"
          >
            <Plus size={16} />
            Create Banner
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Total
          </p>
          <p className="mt-1 text-3xl font-black text-slate-900">
            {banners.length}
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Active
          </p>
          <p className="mt-1 text-3xl font-black text-slate-900">
            {activeCount}
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Inactive
          </p>
          <p className="mt-1 text-3xl font-black text-slate-900">
            {inactiveCount}
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Scheduled
          </p>
          <p className="mt-1 text-3xl font-black text-slate-900">
            {
              banners.filter((banner) => banner?.startDate || banner?.endDate)
                .length
            }
          </p>
        </article>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Banner Overview
            </h2>
            <p className="text-sm text-slate-500">
              Latest records from the admin endpoint.
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {banners.length} records
          </span>
        </div>

        {isLoading ? (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            Loading banners...
          </div>
        ) : isError ? (
          <div className="px-6 py-12 text-center text-sm text-red-600">
            Unable to load banner records.
          </div>
        ) : banners.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            No banners found. Create the first campaign to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-230 text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-6 py-3 font-semibold">Banner</th>
                  <th className="px-6 py-3 font-semibold">Slug</th>
                  <th className="px-6 py-3 font-semibold">Schedule</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr
                    key={banner._id || banner.slug}
                    className="border-b border-slate-100 hover:bg-emerald-50/40"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                          {banner.image ? (
                            <img
                              src={banner.image}
                              alt={banner.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {banner.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {banner.subtitle || "No subtitle"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {banner.slug || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="space-y-1">
                        <p className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatDate(banner.startDate)}
                        </p>
                        <p className="text-xs text-slate-500">
                          to {formatDate(banner.endDate)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          banner.isActive === false
                            ? "bg-slate-100 text-slate-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {banner.isActive === false ? "Inactive" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/banner/${banner.slug}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                      >
                        <PencilLine className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default Page;
