"use client";
import { useGetProductsQuery } from "@/app/(admin)/services/api";
import Input from "@/components/UI/Input";
import Select from "@/components/UI/Select";
import { Edit, Eye, Plus, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsQuery({
    page: currentPage,
    limit: pageSize,
    search: searchTerm || undefined,
    sortBy,
    order,
    isActive: statusFilter === "all" ? undefined : statusFilter,
  });

  const productList = products?.data?.product ?? [];
  const totalProducts = products?.data?.total ?? 0;
  const totalPages = products?.data?.totalPages ?? 1;
  const hasPrevPage = Boolean(products?.data?.hasPrevPage);
  const hasNextPage = Boolean(products?.data?.hasNextPage);

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

  return (
    <>
      <div className="space-y-6 p-4 bg-green-50 rounded-xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your Product catalog</p>
        </div>
        {/* Filters */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
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
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ]}
            placeholder="All Status"
          />
          <Select
            value={sortBy}
            onChange={(event) => {
              setSortBy(event.target.value);
              setCurrentPage(1);
            }}
            options={[
              { label: "Sort: Newest", value: "createdAt" },
              { label: "Sort: Title", value: "title" },
              { label: "Sort: Slug", value: "slug" },
              { label: "Sort: Price", value: "price" },
            ]}
            placeholder="Sort"
          />
          <Select
            value={order}
            onChange={(event) => {
              setOrder(event.target.value);
              setCurrentPage(1);
            }}
            options={[
              { label: "Order: Asc", value: "asc" },
              { label: "Order: Desc", value: "desc" },
            ]}
            placeholder="Order"
          />
          <Select
            value={String(pageSize)}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setCurrentPage(1);
            }}
            options={[
              { label: "10 / page", value: "10" },
              { label: "20 / page", value: "20" },
              { label: "30 / page", value: "30" },
              { label: "50 / page", value: "50" },
              { label: "100 / page", value: "100" },
            ]}
            placeholder="Page Size"
          />

          <Link href="/admin/products/createProduct">
            <span className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-linear-to-r from-emerald-600 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-emerald-700 hover:to-cyan-700 hover:shadow-md">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </span>
          </Link>
        </div>

        {/* ptoducts list */}
        {isLoading ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center text-sm text-slate-600">
            Loading products...
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-12 text-center text-sm text-red-700">
            Unable to load products right now.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="border border-blue-400 text-gray-700">
                  <th className="px-4 py-3 font-semibold border-r border-blue-400">
                    Image
                  </th>
                  <th className="px-4 py-3 font-semibold border-r border-blue-400">
                    Title
                  </th>
                  <th className="px-4 py-3 font-semibold border-r border-blue-400">
                    Categoris
                  </th>
                  <th className="px-4 py-3 font-semibold border-r border-blue-400">
                    Price
                  </th>
                  <th className="px-4 py-3 font-semibold border-r border-blue-400">
                    stock
                  </th>
                  <th className="px-4 py-3 font-semibold border-r border-blue-400">
                    Status
                  </th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {productList.length > 0 ? (
                  productList.map((product) => {
                    const totalStock = Array.isArray(product?.variants)
                      ? product.variants.reduce(
                          (sum, variant) => sum + Number(variant?.stock || 0),
                          0,
                        )
                      : 0;
                    const categoryName =
                      product?.categoryData?.name ||
                      product?.category?.name ||
                      "-";
                    return (
                      <tr
                        key={product?._id || product?.slug || product?.title}
                        className="border-b border-blue-400 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">
                          {product?.thumbnail ? (
                            <Image
                              src={product.thumbnail}
                              alt={product?.title || "Product image"}
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
                        <td className="px-4 py-3">
                          {product?.title || "Untitled"}
                        </td>
                        <td className="px-4 py-3">{categoryName}</td>
                        <td className="px-4 py-3">
                          Tk. {Number(product?.price || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">{totalStock}</td>
                        <td className="px-4 py-3">
                          {product?.isActive ? "Active" : "Inactive"}
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-100"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-100"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      className="px-4 py-8 text-center text-gray-500"
                      colSpan={7}
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Products Table */}
        <div className="flex items-center justify-between px-1 text-sm">
          <p className="text-gray-600">
            Showing {productList.length} of {totalProducts}
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
              Page {products?.data?.page || currentPage} / {totalPages}
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
    </>
  );
};

export default Page;
