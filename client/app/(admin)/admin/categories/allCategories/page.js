"use client";

import {
  useGetCategoriesAdminQuery,
  useGetCategoriesQuery,
} from "@/app/(admin)/services/api";
import Input from "@/components/UI/Input";
import Select from "@/components/UI/Select";
import { Edit, Eye, Plus, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: categoryResponse } = useGetCategoriesQuery();
  const parentCategories = useMemo(
    () =>
      categoryResponse?.data?.categories || categoryResponse?.categories || [],
    [categoryResponse],
  );

  const activeFilter =
    statusFilter === "all" || statusFilter === ""
      ? undefined
      : statusFilter === "true";

  const {
    data: categoryResponseAdmin,
    isLoading,
    isError,
  } = useGetCategoriesAdminQuery({
    page: currentPage,
    limit: pageSize,
    search: searchTerm || undefined,
    isActive: activeFilter,
  });

  const categoryList = categoryResponseAdmin?.data?.categories ?? [];
  const totalCategories = categoryResponseAdmin?.data?.total ?? 0;
  const totalPages =
    categoryResponseAdmin?.data?.totalPage ??
    categoryResponseAdmin?.data?.totalPages ??
    1;
  const hasPrevPage = Boolean(
    categoryResponseAdmin?.data?.hasPrev ??
    categoryResponseAdmin?.data?.hasPrevPage,
  );
  const hasNextPage = Boolean(
    categoryResponseAdmin?.data?.hasNext ??
    categoryResponseAdmin?.data?.hasNextPage,
  );

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
  const getParentCategoryName = (parent) => {
    if (!parent) {
      return "-";
    }

    if (typeof parent === "object") {
      return parent?.name || "-";
    }

    return (
      parentCategories.find((item) => String(item?._id) === String(parent))
        ?.name || "-"
    );
  };

  const getUsername = (user) => {
    if (!user) {
      return "-";
    }

    if (typeof user === "object") {
      return user?.fullName || user?.email || user?.role || "-";
    }

    return String(user);
  };

  return (
    <div className="space-y-4 rounded-xl bg-green-50 p-4">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage your category catalog</p>
        </div>
        <Link
          href="/admin/categories/createCategories"
          className="sm:col-span-2 xl:col-span-1"
        >
          <span className="inline-flex w-full cursor-pointer items-center justify-center rounded-xl bg-linear-to-r from-emerald-600 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-emerald-700 hover:to-cyan-700 hover:shadow-md">
            <Plus className="mr-2 h-4 w-4" />
            Add Categories
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-8">
        <div className="relative sm:col-span-2 xl:col-span-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search categories by name or slug..."
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
            { label: "Active", value: "true" },
            { label: "Inactive", value: "false" },
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
          className=" xl:col-span-2 inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 sm:col-span-1"
        >
          Reset
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center text-sm text-slate-600">
          Loading categories...
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-12 text-center text-sm text-red-700">
          Unable to load categories right now.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="h-[calc(100vh-20rem)] overflow-y-auto scrollbar-hidden">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-gray-700">
                  <th className="sticky top-0 z-20 border-r border-blue-400 bg-green-50 px-4 py-3 font-semibold shadow-2xl">
                    Image
                  </th>
                  <th className="sticky top-0 z-20 border-r border-blue-400 bg-green-50 px-4 py-3 font-semibold shadow-2xl ">
                    Name
                  </th>
                  <th className="sticky top-0 z-20 border-r border-blue-400 bg-green-50 px-4 py-3 font-semibold shadow-2xl">
                    Parent
                  </th>
                  <th className="sticky top-0 z-20 border-r border-blue-400 bg-green-50 px-4 py-3 font-semibold shadow-2xl">
                    Description
                  </th>
                  <th className="sticky top-0 z-20 border-r border-blue-400 bg-green-50 px-4 py-3 font-semibold shadow-2xl">
                    Sort Order
                  </th>
                  <th className="sticky top-0 z-20 border-r border-blue-400 bg-green-50 px-4 py-3 font-semibold shadow-2xl">
                    Status
                  </th>
                  <th className="sticky top-0 z-20 border-r border-blue-400 bg-green-50 px-4 py-3 font-semibold shadow-2xl">
                    Created By Username
                  </th>
                  <th className="sticky top-0 z-20 border-r border-blue-400 bg-green-50 px-4 py-3 font-semibold shadow-2xl">
                    Updated By Username
                  </th>
                  <th className="sticky top-0 z-20 bg-green-50 px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {categoryList.length > 0 ? (
                  categoryList.map((category) => (
                    <tr
                      key={category?._id || category?.slug || category?.name}
                      className="border-b border-blue-400 hover:bg-gray-50"
                    >
                      <td className="px-4 py-1">
                        {category?.thumbnail ? (
                          <Image
                            src={category.thumbnail}
                            alt={category?.name || "category image"}
                            width={56}
                            height={56}
                            className="h-14 w-14 rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-gray-100 text-xs text-gray-400">
                            No image
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-1">
                        <div className="flex flex-col">
                          <p className="text-xl font-bold">
                            {category?.name || "Untitled"}
                          </p>
                          <p className="text-base text-gray-600">
                            {category?.slug || "Untitled"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-1">
                        {getParentCategoryName(category?.parent)}
                      </td>
                      <td className="px-4 py-1">
                        {category?.description || "-"}
                      </td>
                      <td className="px-4 py-1">{category?.sortOrder ?? 0}</td>
                      <td className="px-4 py-1">
                        {category?.isActive ? "Active" : "Inactive"}
                      </td>
                      <td className="px-4 py-1">
                        {getUsername(category?.createdBy)}
                      </td>
                      <td className="px-4 py-1">
                        {getUsername(category?.updatedBy)}
                      </td>
                      <td className="px-4 py-1 font-semibold">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/categories/${category?.slug}`}
                            className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-100"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Link>
                          <Link
                            href={`/admin/categories/${category?.slug}`}
                            className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-100"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="px-4 py-8 text-center text-gray-500"
                      colSpan={9}
                    >
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-1 text-sm">
        <p className="text-gray-600">
          Showing {categoryList.length} of {totalCategories}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={!hasPrevPage}
            className="rounded-md border border-gray-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-700">
            Page {categoryResponseAdmin?.data?.page || currentPage} /{" "}
            {totalPages}
          </span>
          <button
            type="button"
            onClick={handleNextPage}
            disabled={!hasNextPage}
            className="rounded-md border border-gray-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
