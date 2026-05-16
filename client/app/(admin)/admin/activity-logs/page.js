"use client";

import {
  useGetActivityLogsQuery,
} from "@/app/(admin)/services/api";
import { Activity, ArrowLeftRight, Filter, ShieldAlert, UserRound } from "lucide-react";
import { useMemo, useState } from "react";

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
};

const getBadgeStyles = (action) => {
  const normalized = String(action || "").toUpperCase();

  if (normalized.includes("DELETE") || normalized.includes("BAN")) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  if (normalized.includes("LOGIN") || normalized.includes("REGISTER")) {
    return "bg-cyan-50 text-cyan-700 border-cyan-200";
  }

  if (normalized.includes("UPDATE") || normalized.includes("CHANGE")) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  return "bg-emerald-50 text-emerald-700 border-emerald-200";
};

const ActivityLogsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [entityTypeFilter, setEntityTypeFilter] = useState("all");
  const [actorRoleFilter, setActorRoleFilter] = useState("all");

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      search: searchTerm || undefined,
      action: actionFilter === "all" ? undefined : actionFilter,
      entityType: entityTypeFilter === "all" ? undefined : entityTypeFilter,
      actorRole: actorRoleFilter === "all" ? undefined : actorRoleFilter,
    }),
    [actionFilter, actorRoleFilter, currentPage, entityTypeFilter, pageSize, searchTerm],
  );

  const {
    data: activityResponse,
    isLoading,
    isError,
  } = useGetActivityLogsQuery(queryParams);

  const logs = activityResponse?.data?.logs ?? [];
  const totalLogs = activityResponse?.data?.total ?? 0;
  const totalPages = activityResponse?.data?.totalPage ?? 1;
  const hasPrevPage = Boolean(activityResponse?.data?.hasPrev);
  const hasNextPage = Boolean(activityResponse?.data?.hasNext);

  const actorCount = new Set(
    logs.map((item) => item?.actor?.email || item?.actorEmail || item?.actorName),
  ).size;
  const adminActionCount = logs.filter((item) => item?.actorRole === "admin").length;

  const handlePrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleResetFilters = () => {
    setCurrentPage(1);
    setPageSize(10);
    setSearchTerm("");
    setActionFilter("all");
    setEntityTypeFilter("all");
    setActorRoleFilter("all");
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-linear-to-r from-slate-950 via-slate-900 to-emerald-900 p-6 text-white shadow-xl shadow-slate-200/40">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
              Audit Trail
            </p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Activity logs for every meaningful admin action.
            </h1>
            <p className="text-sm leading-6 text-slate-200/90">
              Review authentication events, catalog edits, and moderation changes from one place.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-slate-200/80">Total</p>
              <p className="mt-1 text-2xl font-black">{totalLogs}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-slate-200/80">Admins</p>
              <p className="mt-1 text-2xl font-black">{adminActionCount}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-slate-200/80">Actors</p>
              <p className="mt-1 text-2xl font-black">{actorCount}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-slate-200/80">Page</p>
              <p className="mt-1 text-2xl font-black">{activityResponse?.data?.page || currentPage}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm xl:grid-cols-4">
        <div className="relative xl:col-span-2">
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search actor, action, entity, or route"
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(event) => {
            setActionFilter(event.target.value);
            setCurrentPage(1);
          }}
          className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        >
          <option value="all">All actions</option>
          <option value="LOGIN">Login</option>
          <option value="REGISTER">Register</option>
          <option value="CREATE_PRODUCT">Create product</option>
          <option value="UPDATE_PRODUCT">Update product</option>
          <option value="CREATE_CATEGORY">Create category</option>
          <option value="UPDATE_CATEGORY">Update category</option>
          <option value="CREATE_BANNER">Create banner</option>
          <option value="UPDATE_BANNER">Update banner</option>
          <option value="DELETE_BANNER">Delete banner</option>
          <option value="PLACE_ORDER">Place order</option>
          <option value="UPDATE_ORDER">Update order</option>
          <option value="UPDATE_USER_STATUS">Update user status</option>
        </select>

        <select
          value={entityTypeFilter}
          onChange={(event) => {
            setEntityTypeFilter(event.target.value);
            setCurrentPage(1);
          }}
          className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        >
          <option value="all">All entities</option>
          <option value="Authentication">Authentication</option>
          <option value="User">User</option>
          <option value="Product">Product</option>
          <option value="Category">Category</option>
          <option value="Banner">Banner</option>
          <option value="Order">Order</option>
        </select>

        <select
          value={actorRoleFilter}
          onChange={(event) => {
            setActorRoleFilter(event.target.value);
            setCurrentPage(1);
          }}
          className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        >
          <option value="all">All roles</option>
          <option value="guest">Guest</option>
          <option value="user">User</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>

        <select
          value={String(pageSize)}
          onChange={(event) => {
            setPageSize(Number(event.target.value));
            setCurrentPage(1);
          }}
          className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        >
          <option value="10">10 / page</option>
          <option value="20">20 / page</option>
          <option value="30">30 / page</option>
          <option value="50">50 / page</option>
        </select>

        <button
          type="button"
          onClick={handleResetFilters}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 xl:col-span-4"
        >
          Reset filters
        </button>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent activity</h2>
            <p className="text-sm text-slate-500">Latest entries from the audit trail.</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {logs.length} records
          </span>
        </div>

        {isLoading ? (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            Loading activity logs...
          </div>
        ) : isError ? (
          <div className="px-6 py-12 text-center text-sm text-rose-600">
            Unable to load activity logs.
          </div>
        ) : logs.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            No activity logs match the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-275 text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-6 py-3 font-semibold">Time</th>
                  <th className="px-6 py-3 font-semibold">Actor</th>
                  <th className="px-6 py-3 font-semibold">Action</th>
                  <th className="px-6 py-3 font-semibold">Entity</th>
                  <th className="px-6 py-3 font-semibold">Route</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const actorLabel =
                    log?.actor?.fullName ||
                    log?.actor?.email ||
                    log?.actorName ||
                    "System";

                  return (
                    <tr
                      key={log?._id}
                      className="border-b border-slate-100 hover:bg-emerald-50/40"
                    >
                      <td className="px-6 py-4 text-slate-600">
                        {formatDateTime(log?.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-900">{actorLabel}</p>
                          <p className="text-xs text-slate-500">
                            {log?.actor?.role || log?.actorRole || "guest"}
                            {log?.actorEmail ? ` · ${log.actorEmail}` : ""}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${getBadgeStyles(log?.action)}`}
                        >
                          <Activity className="h-3.5 w-3.5" />
                          {log?.action || "UNKNOWN"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="space-y-1">
                          <p className="font-medium text-slate-900">
                            {log?.entityType || "General"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {log?.entityName || log?.entityId || "-"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {log?.path || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                            Number(log?.statusCode || 0) >= 400
                              ? "bg-rose-50 text-rose-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          <ArrowLeftRight className="h-3.5 w-3.5" />
                          {log?.statusCode || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="space-y-1">
                          <p>{log?.ip || "-"}</p>
                          <p className="max-w-70 truncate text-xs text-slate-500">
                            {typeof log?.details === "object"
                              ? JSON.stringify(log.details)
                              : log?.details || "-"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
        <p className="text-slate-600">
          Showing {logs.length} of {totalLogs}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={!hasPrevPage}
            className="rounded-xl border border-slate-300 px-3 py-2 font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-slate-700">
            Page {activityResponse?.data?.page || currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={handleNextPage}
            disabled={!hasNextPage}
            className="rounded-xl border border-slate-300 px-3 py-2 font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default ActivityLogsPage;