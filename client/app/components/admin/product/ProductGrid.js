"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye, Package } from "lucide-react";
import Image from "next/image";
import Input from "../../ui/input";
import Select from "../../ui/Select";

const ProductGrid = ({ initialProducts }) => {
  const normalizedProducts = useMemo(
    () =>
      Array.isArray(initialProducts)
        ? initialProducts.flat(Infinity).filter(Boolean)
        : [],
    [initialProducts],
  );

  const getProductId = (product) => {
    if (!product) return "";
    if (typeof product._id === "string") return product._id;
    if (product._id && typeof product._id === "object") {
      return product._id.$oid || "";
    }
    return "";
  };

  const getProductSlug = (product) => {
    if (!product) return "";
    return typeof product.slug === "string" ? product.slug : "";
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  const getStatusLabel = (isActive) => (isActive ? "Active" : "Inactive");
  const getStatusClass = (isActive) =>
    isActive
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-red-100 text-red-700 border-red-200";

  const filteredProducts = useMemo(() => {
    return normalizedProducts.filter((p) => {
      const searchValue = searchTerm.toLowerCase();
      const matchesSearch =
        (p?.title || "").toLowerCase().includes(searchValue) ||
        (p?.slug || "").toLowerCase().includes(searchValue);
      const matchesStatus =
        statusFilter === "all" || String(Boolean(p?.isActive)) === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [normalizedProducts, searchTerm, statusFilter]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      let first = a?.[sortBy];
      let second = b?.[sortBy];

      if (sortBy === "price") {
        first = Number(first || 0);
        second = Number(second || 0);
      } else if (sortBy === "createdAt") {
        first = new Date(first || 0).getTime();
        second = new Date(second || 0).getTime();
      } else {
        first = String(first || "").toLowerCase();
        second = String(second || "").toLowerCase();
      }

      if (first < second) return sortOrder === "asc" ? -1 : 1;
      if (first > second) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredProducts, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize));
  const page = Math.min(currentPage, totalPages);
  const startIndex = (page - 1) * pageSize;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + pageSize,
  );

  return (
    <>
      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
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
            onChange={(e) => {
              setSortBy(e.target.value);
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
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
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
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            options={[
              { label: "8 / page", value: "8" },
              { label: "12 / page", value: "12" },
              { label: "20 / page", value: "20" },
            ]}
            placeholder="Page Size"
          />
          <Link
            href="/products/createProduct"
            className="btn-primary flex items-center justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="border border-blue-400 text-gray-700">
              <th className="px-4 py-3 font-semibold border-r border-blue-400">
                Image
              </th>
              <th className="px-4 py-3 font-semibold border-r border-blue-400">
                Slug
              </th>
              <th className="px-4 py-3 font-semibold border-r border-blue-400">
                Title
              </th>
              <th className="px-4 py-3 font-semibold border-r border-blue-400">
                Price
              </th>
              <th className="px-4 py-3 font-semibold border-r border-blue-400">
                Status
              </th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => {
              const productId = getProductId(product);
              const productSlug = getProductSlug(product);
              return (
                <tr
                  key={String(productId || productSlug || product.title)}
                  className="border-b border-blue-400 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <Image
                      src={
                        product.thumbnail ||
                        product.mainImg ||
                        "/placeholder.png"
                      }
                      alt={product.title || "Product"}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-md object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {productSlug || "-"}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {product.title || "Untitled"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    Tk. {Number(product.price || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClass(
                        Boolean(product.isActive),
                      )}`}
                    >
                      {getStatusLabel(Boolean(product.isActive))}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {productSlug ? (
                        <Link
                          href={`/products/${productSlug}`}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-100"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Link>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-400">
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </span>
                      )}
                      {productSlug || productId ? (
                        <Link
                          href={`/products/updateProduct?slug=${productSlug || productId}`}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-100"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-400">
                          <Edit className="h-3.5 w-3.5" />
                          Edit
                        </span>
                      )}
                      <button
                        type="button"
                        aria-label="Delete product"
                        className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedProducts.length > 0 && (
        <div className="flex items-center justify-between px-1 text-sm">
          <p className="text-gray-600">
            Showing {startIndex + 1}-
            {Math.min(startIndex + pageSize, sortedProducts.length)} of{" "}
            {sortedProducts.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={page <= 1}
              className="rounded-md border border-gray-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-gray-700">
              Page {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={page >= totalPages}
              className="rounded-md border border-gray-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Empty */}
      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3>No products found</h3>
        </div>
      )}
    </>
  );
};

export default ProductGrid;
