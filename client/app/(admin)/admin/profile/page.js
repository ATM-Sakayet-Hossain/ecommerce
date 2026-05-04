"use client";

import {
  useGetAllUsersQuery,
  useUserStatusMutation,
} from "@/app/(admin)/services/api";
import Input from "@/components/UI/Input";
import Select from "@/components/UI/Select";
import {
  AlertTriangle,
  BadgeCheck,
  Ban,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Search,
  Shield,
  Users,
  X,
} from "lucide-react";
import { decodeJwt } from "jose";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const getStatusStyles = (status) => {
  if (status === "active") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "banned") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-600";
};

const getRoleStyles = (role) => {
  if (role === "admin") {
    return "border-indigo-200 bg-indigo-50 text-indigo-700";
  }

  if (role === "editor") {
    return "border-cyan-200 bg-cyan-50 text-cyan-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-600";
};

const authCookieName = "X-AS-Token";

const getCookieValue = (name) => {
  if (typeof document === "undefined") {
    return "";
  }

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));

  return cookie ? cookie.slice(name.length + 1) : "";
};

const getCurrentRole = () => {
  const token = getCookieValue(authCookieName);

  if (!token) return "";

  try {
    const decodedToken = decodeJwt(token);
    return decodedToken?.role || "";
  } catch {
    return "";
  }
};

const getCurrentUser = () => {
  const token = getCookieValue(authCookieName);

  if (!token) return { role: "", email: "" };

  try {
    const decodedToken = decodeJwt(token);
    return {
      role: decodedToken?.role || "",
      email: decodedToken?.email || "",
    };
  } catch {
    return { role: "", email: "" };
  }
};

const getRoleOptions = (operatorRole, targetRole) => {
  if (operatorRole === "admin") {
    if (targetRole === "admin") {
      return [
        { label: "User", value: "user" },
        { label: "Editor", value: "editor" },
      ];
    }

    if (targetRole === "editor") {
      return [
        { label: "User", value: "user" },
        { label: "Admin", value: "admin" },
      ];
    }

    return [
      { label: "Editor", value: "editor" },
      { label: "Admin", value: "admin" },
    ];
  }

  if (operatorRole === "editor") {
    if (targetRole === "admin") {
      return [];
    }

    if (targetRole === "user") {
      return [{ label: "Editor", value: "editor" }];
    }

    return [{ label: "User", value: "user" }];
  }

  return [];
};

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleDrafts, setRoleDrafts] = useState({});
  const [confirmation, setConfirmation] = useState({
    open: false,
    title: "",
    message: "",
    confirmLabel: "Confirm",
    tone: "emerald",
    onConfirm: null,
  });

  const currentOperator = useMemo(() => getCurrentUser(), []);
  const currentOperatorRole = currentOperator.role;
  const currentOperatorEmail = currentOperator.email;

  const [updateUserStatus, { isLoading: isUpdating }] = useUserStatusMutation();

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      search: searchTerm.trim() || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
    [currentPage, pageSize, searchTerm, statusFilter],
  );

  const {
    data: userResponse,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetAllUsersQuery(queryParams);

  const userList = userResponse?.data?.allUser ?? userResponse?.allUser ?? [];
  const totalUsers = userResponse?.data?.total ?? 0;
  const totalPages =
    userResponse?.data?.totalPage ?? userResponse?.data?.totalPages ?? 1;
  const hasPrevPage = Boolean(
    userResponse?.data?.hasPrev ?? userResponse?.data?.hasPrevPage,
  );
  const hasNextPage = Boolean(
    userResponse?.data?.hasNext ?? userResponse?.data?.hasNextPage,
  );
  const pageNumber = userResponse?.data?.page || currentPage;

  const openConfirmation = ({
    title,
    message,
    confirmLabel,
    tone,
    onConfirm,
  }) => {
    setConfirmation({
      open: true,
      title,
      message,
      confirmLabel,
      tone,
      onConfirm,
    });
  };

  const closeConfirmation = () => {
    setConfirmation((current) => ({
      ...current,
      open: false,
      onConfirm: null,
    }));
  };

  const runMutation = async (payload, successMessage, errorMessage) => {
    try {
      await updateUserStatus(payload).unwrap();
      toast.success(successMessage);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error?.message || errorMessage);
    }
  };

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
    setSearchTerm("");
    setStatusFilter("all");
    setPageSize(10);
    setCurrentPage(1);
  };

  const handleStatusClick = (user) => {
    if (!user?.email) return;
    if (user.email === currentOperatorEmail) return;

    const nextStatus = user.status === "active" ? "banned" : "active";
    const label = nextStatus === "active" ? "activate" : "banned";

    openConfirmation({
      title: `${label[0].toUpperCase()}${label.slice(1)} user`,
      message: `This will update ${user.email} to ${nextStatus}.`,
      confirmLabel: nextStatus === "active" ? "Activate" : "Banned",
      tone: nextStatus === "active" ? "emerald" : "rose",
      onConfirm: () =>
        runMutation(
          {
            email: user.email,
            status: nextStatus,
          },
          `User ${nextStatus === "active" ? "activated" : "banned"}.`,
          "Unable to update user status.",
        ),
    });
  };

  const handleRoleClick = (user, nextRole) => {
    if (!user?.email) return;

    if (!nextRole) return;

    openConfirmation({
      title: "Update user role",
      message: `Change ${user.email} to ${nextRole}?`,
      confirmLabel: "Update role",
      tone: "indigo",
      onConfirm: () =>
        runMutation(
          {
            email: user.email,
            role: nextRole,
          },
          `User role updated to ${nextRole}.`,
          "Unable to update user role.",
        ),
    });
  };

  return (
    <div className="space-y-4 rounded-2xl bg-linear-to-br from-slate-50 via-white to-emerald-50 p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
            User management
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-sm text-slate-600">
            Review accounts and update role or status from one screen.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
          <Users className="h-4 w-4 text-emerald-600" />
          {totalUsers} total users
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-8">
        <div className="relative sm:col-span-2 xl:col-span-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Search users by name, email, or phone..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>

        <Select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setCurrentPage(1);
          }}
          options={[
            { label: "All Status", value: "all" },
            { label: "Active", value: "active" },
            { label: "Banned", value: "banned" },
          ]}
          placeholder="All Status"
          className="sm:col-span-1"
        />

        <select
          value={String(pageSize)}
          onChange={(event) => {
            setPageSize(Number(event.target.value));
            setCurrentPage(1);
          }}
          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 sm:col-span-1"
        >
          <option value="10">10 / page</option>
          <option value="20">20 / page</option>
          <option value="30">30 / page</option>
          <option value="50">50 / page</option>
          <option value="100">100 / page</option>
        </select>

        <button
          type="button"
          onClick={handleResetFilters}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 sm:col-span-1 xl:col-span-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center text-sm text-slate-600">
          Loading users...
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-12 text-center text-sm text-red-700">
          Unable to load users right now.
        </div>
      ) : (
        <div className="min-h-[calc(100vh-40rem)] overflow-x-auto">
          <div className="h-[calc(100vh-20rem)] overflow-y-auto scrollbar-hidden">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-slate-700">
                  <th className="sticky top-0 z-20 border-r border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-center shadow-sm">
                    User
                  </th>
                  <th className="sticky top-0 z-20 border-r border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-center shadow-sm">
                    Email
                  </th>
                  <th className="sticky top-0 z-20 border-r border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-center shadow-sm">
                    Phone
                  </th>
                  <th className="sticky top-0 z-20 border-r border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-center shadow-sm">
                    Role
                  </th>
                  <th className="sticky top-0 z-20 border-r border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-center shadow-sm">
                    Status
                  </th>
                  <th className="sticky top-0 z-20 border-r border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-center shadow-sm">
                    Verified
                  </th>
                  <th className="sticky top-0 z-20 border-r border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-center shadow-sm">
                    Created At
                  </th>
                  <th className="sticky top-0 z-20 bg-slate-50 px-4 py-3 font-semibold text-center shadow-sm">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {userList.length > 0 ? (
                  userList.map((user) => {
                    const key = user?._id || user?.email;
                    const isOwnAccount =
                      currentOperatorEmail &&
                      user?.email === currentOperatorEmail;
                    const roleOptions = getRoleOptions(
                      currentOperatorRole,
                      user?.role,
                    );
                    const selectedRole =
                      roleDrafts[key] || roleOptions[0]?.value || "";

                    return (
                      <tr
                        key={key}
                        className="border-b border-slate-100 transition hover:bg-slate-100"
                      >
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900">
                              {user?.fullName || "Unnamed user"}
                            </span>
                            <span className="text-xs text-slate-500">
                              {user?.isVerified
                                ? "Verified account"
                                : "Not verified"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {user?.email || "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {user?.phone || "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getRoleStyles(
                              user?.role,
                            )}`}
                          >
                            {user?.role || "user"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusStyles(
                              user?.status,
                            )}`}
                          >
                            {user?.status || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {user?.isVerified ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              <BadgeCheck className="h-3.5 w-3.5" />
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                              <Shield className="h-3.5 w-3.5" />
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {formatDate(user?.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="grid min-w-[16rem] grid-cols-2 gap-2">
                            {isOwnAccount ? (
                              <div className="inline-flex items-center justify-center rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                                Own role locked
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                                <select
                                  value={selectedRole}
                                  onChange={(event) => {
                                    setRoleDrafts((current) => ({
                                      ...current,
                                      [key]: event.target.value,
                                    }));
                                  }}
                                  className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                >
                                  {roleOptions.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRoleClick(user, selectedRole)
                                  }
                                  disabled={isUpdating || !selectedRole}
                                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {isUpdating ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <BadgeCheck className="h-3.5 w-3.5" />
                                  )}
                                  Update Role
                                </button>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => handleStatusClick(user)}
                              disabled={isUpdating || isOwnAccount}
                              className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold ${
                                isOwnAccount
                                  ? "bg-amber-50 text-amber-700"
                                  : user?.status === "active"
                                    ? "hover:text-slate-700 hover:bg-red-200 "
                                    : "hover:text-slate-700 hover:bg-green-200 "
                              } text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-60`}
                            >
                              {isOwnAccount ? (
                                <>
                                  <Shield className="h-3.5 w-3.5" />
                                  Own account locked
                                </>
                              ) : isUpdating ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : user?.status === "active" ? (
                                <Ban className="h-3.5 w-3.5" />
                              ) : (
                                <Shield className="h-3.5 w-3.5" />
                              )}
                              {isOwnAccount
                                ? null
                                : user?.status === "active"
                                  ? "Banned User"
                                  : "Activate User"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      className="px-4 py-10 text-center text-slate-500"
                      colSpan={8}
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {userList.length} of {totalUsers} users
          {isFetching ? " - refreshing" : ""}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={!hasPrevPage}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>
          <span className="rounded-md bg-slate-100 px-3 py-1.5 font-medium text-slate-700">
            Page {pageNumber} / {totalPages}
          </span>
          <button
            type="button"
            onClick={handleNextPage}
            disabled={!hasNextPage}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {confirmation.open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 rounded-2xl p-2 ${
                    confirmation.tone === "rose"
                      ? "bg-rose-50 text-rose-600"
                      : confirmation.tone === "indigo"
                        ? "bg-indigo-50 text-indigo-600"
                        : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {confirmation.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {confirmation.message}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeConfirmation}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close popup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeConfirmation}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const action = confirmation.onConfirm;
                  closeConfirmation();
                  if (action) {
                    await action();
                  }
                }}
                className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition ${
                  confirmation.tone === "rose"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : confirmation.tone === "indigo"
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {confirmation.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Page;
