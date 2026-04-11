import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Edit, Package } from "lucide-react";
import Button from "../../ui/Button";

const ProductDetails = ({ product }) => {
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const images = Array.isArray(product?.images) ? product.images : [];
  const categoryName =
    typeof product?.category === "object"
      ? product?.category?.name || product?.category?.slug || "-"
      : product?.category || "-";

  const statusClass = product?.isActive
    ? "bg-green-100 text-green-700 border-green-200"
    : "bg-red-100 text-red-700 border-red-200";

  return (
    <div className="space-y-6 p-4 bg-green-50 rounded-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/products/allProducts"
            className="inline-flex items-center rounded-md border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {product?.title || "Product Details"}
            </h1>
            <p className="text-gray-600">Product details and management</p>
          </div>
        </div>
        <Link href={`/products/updateProduct?slug=${product?.slug || ""}`}>
          <Button variant="outline" className="cursor-pointer text-sm!">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="border border-blue-400 rounded-xl p-4">
            {/* <h3 className="mb-4 text-lg font-semibold text-gray-900">Images</h3> */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Image
                src={product?.thumbnail || "/placeholder.png"}
                alt={product?.title || "Product"}
                width={700}
                height={420}
                className="w-full rounded-lg object-cover"
              />
              <div className="grid grid-cols-2 gap-3">
                {images.slice(0, 4).map((img, idx) => (
                  <Image
                    key={`${img}-${idx}`}
                    src={img}
                    alt={`${product?.title || "Product"} ${idx + 1}`}
                    width={220}
                    height={160}
                    className="w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card border border-blue-400 rounded-xl p-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Overview
            </h3>
            <div className="space-y-3 text-sm">
              <p>
                <span className="font-medium text-gray-700">Title:</span>{" "}
                {product?.title || "-"}
              </p>
              <p>
                <span className="font-medium text-gray-700">Slug:</span>{" "}
                {product?.slug || "-"}
              </p>
              <p>
                <span className="font-medium text-gray-700">Price:</span> Tk.{" "}
                {Number(product?.price || 0).toLocaleString()}
              </p>
              <p className="flex items-center gap-1">
                <Package className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-gray-700">Category:</span>
                <span>{categoryName}</span>
              </p>
              <div>
                <span className="mr-2 font-medium text-gray-700">Status:</span>
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass}`}
                >
                  {product?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
          <div className="border border-blue-400 rounded-xl p-4 overflow-x-auto">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Variants
            </h3>
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-700">
                  <th className="px-3 py-1 font-semibold">Color</th>
                  <th className="px-3 py-1 font-semibold">Size</th>
                  <th className="px-3 py-1 font-semibold">Price</th>
                  <th className="px-3 py-1 font-semibold">Stock</th>
                  <th className="px-3 py-1 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant, index) => (
                  <tr
                    key={
                      variant?._id?.$oid ||
                      (typeof variant?._id === "string" ? variant._id : "") ||
                      variant?.sku ||
                      `variant-${index}`
                    }
                    className="border-b border-gray-100"
                  >
                    <td className="px-3 py-1">{variant?.color || "-"}</td>
                    <td className="px-3 py-1">{variant?.size || "-"}</td>
                    <td className="px-3 py-1">{variant?.sku || "-"}</td>
                    <td className="px-3 py-1">{variant?.stock ?? "-"}</td>
                    <td className="px-6 py-1 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          variant?.stock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {variant?.stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="card border border-blue-400 rounded-xl p-4">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          Description
        </h3>
        <p className="text-sm text-gray-600 whitespace-pre-line">
          {product?.description || "No description available."}
        </p>
      </div>
    </div>
  );
};

export default ProductDetails;
