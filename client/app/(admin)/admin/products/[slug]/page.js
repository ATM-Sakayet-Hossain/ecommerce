"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  useGetProductBySlugQuery,
  useGetCategoriesQuery,
  useUpdateProductMutation,
} from "@/app/(admin)/services/api";
import BasicInfo from "@/components/admin/BasicInfo";
import ProductImages from "@/components/admin/ProductImages";
import ProductVariants from "@/components/admin/ProductVariants";
import Button from "@/components/UI/Button";
import { ArrowLeft, Loader2 } from "lucide-react";

const toSlug = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const initialVariants = [
  {
    sku: "",
    color: "",
    size: "",
    stock: 0,
  },
];

const buildFormData = (product) => ({
  title: product?.title || "",
  slug: product?.slug || "",
  description: product?.description || "",
  category: product?.category?._id || product?.category || "",
  brand: product?.brand || "",
  discountType:
    Number(product?.discountPercentage || 0) > 0 ? "percentage" : "amount",
  discountPrice: Number(product?.discountPrice || 0),
  discountPercentage: Number(product?.discountPercentage || 0),
  price: product?.price != null ? String(product.price) : "",
  tags: Array.isArray(product?.tags)
    ? product.tags.join(", ")
    : String(product?.tags || ""),
  thumbnail: null,
  images: [],
  isActive: Boolean(product?.isActive),
});

const buildVariants = (product) =>
  Array.isArray(product?.variants) && product.variants.length > 0
    ? product.variants.map((variant) => ({
        ...variant,
        stock: Number(variant?.stock || 0),
      }))
    : initialVariants;

const ProductEditor = ({ product, categories, router, productSlug }) => {
  const [formData, setFormData] = useState(() => buildFormData(product));
  const [variants, setVariants] = useState(() => buildVariants(product));
  const [existingImages, setExistingImages] = useState(() =>
    Array.isArray(product?.images) ? product.images : [],
  );
  const [removedImages, setRemovedImages] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(
    () => product?.thumbnail || "",
  );
  const [updateProduct, { isLoading: isSaving }] = useUpdateProductMutation();

  const handleRemoveExistingImage = (imageUrl) => {
    setExistingImages((prev) => prev.filter((item) => item !== imageUrl));
    setRemovedImages((prev) =>
      prev.includes(imageUrl) ? prev : [...prev, imageUrl],
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const finalSlug = formData.slug.trim() || toSlug(formData.title);

    if (!formData.title.trim()) {
      toast.error("Product title is required.");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Product description is required.");
      return;
    }

    if (!formData.category) {
      toast.error("Product category is required.");
      return;
    }

    if (!formData.price) {
      toast.error("Product price is required.");
      return;
    }

    if (!formData.thumbnail && !thumbnailPreview) {
      toast.error("Product thumbnail is required.");
      return;
    }

    if (existingImages.length + formData.images.length < 1) {
      toast.error("At least one product image is required.");
      return;
    }

    if (!finalSlug) {
      toast.error("Product slug is required.");
      return;
    }

    const normalizedVariants = variants.map((variant) => ({
      ...variant,
      stock: Number(variant.stock || 0),
    }));

    const hasValidVariant = normalizedVariants.some(
      (variant) =>
        variant.sku && variant.color && variant.size && variant.stock >= 0,
    );

    if (!hasValidVariant) {
      toast.error(
        "Fill in at least one complete variant: sku, color, size, and stock.",
      );
      return;
    }

    if (normalizedVariants.length === 0) {
      toast.error("At least one variant is required.");
      return;
    }

    if (existingImages.length + formData.images.length > 4) {
      toast.error("You can upload maximum 4 images.");
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title.trim());
    payload.append("slug", finalSlug);
    payload.append("description", formData.description.trim());
    payload.append("category", formData.category);
    payload.append("brand", formData.brand);
    payload.append("price", String(Number(formData.price || 0)));
    payload.append(
      "discountPrice",
      String(Number(formData.discountPrice || 0)),
    );
    payload.append(
      "discountPercentage",
      String(Number(formData.discountPercentage || 0)),
    );
    payload.append("isActive", String(formData.isActive));
    payload.append("variants", JSON.stringify(normalizedVariants));
    payload.append(
      "tags",
      JSON.stringify(
        String(formData.tags || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    );

    if (formData.thumbnail) {
      payload.append("thumbnail", formData.thumbnail);
    }

    if (removedImages.length > 0) {
      payload.append("destroyImages", JSON.stringify(removedImages));
    }

    formData.images.slice(0, 4).forEach((image) => {
      payload.append("images", image);
    });

    try {
      await updateProduct({ slug: productSlug, body: payload }).unwrap();
      toast.success("Product updated successfully.");
      router.push("/admin/products/allProducts");
    } catch (error) {
      toast.error(
        error?.data?.message || error?.error || "Unable to update product.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="h-[calc(100vh-7rem)] overflow-y-auto bg-gray-50 px-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
            <p className="text-sm text-gray-500">
              Update the existing product details, images, and variants.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          loading={false}
          className="min-w-40"
          disabled={isSaving}
        >
          {isSaving ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Updating
            </span>
          ) : (
            "Update Product"
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <BasicInfo
            formData={formData}
            setFormData={setFormData}
            categories={categories}
          />
          <ProductImages
            formData={formData}
            setFormData={setFormData}
            existingImages={existingImages}
            onRemoveExistingImage={handleRemoveExistingImage}
            thumbnailPreview={thumbnailPreview}
          />
        </div>
        <ProductVariants variants={variants} setVariants={setVariants} />
      </div>
    </form>
  );
};

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const { data: categoryResponse } = useGetCategoriesQuery();
  const rawSlug = params?.slug;
  const productSlug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  const {
    data: productResponse,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useGetProductBySlugQuery(productSlug, {
    skip: !productSlug,
  });

  const categories = useMemo(
    () =>
      categoryResponse?.data?.categories || categoryResponse?.categories || [],
    [categoryResponse],
  );

  const product = productResponse?.data || productResponse || null;

  if (isProductLoading && !product) {
    return (
      <div className="flex h-[calc(100vh-7rem)] items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-500">
        Loading product details...
      </div>
    );
  }

  if (isProductError && !product) {
    return (
      <div className="flex h-[calc(100vh-7rem)] items-center justify-center rounded-xl bg-gray-50 text-sm text-red-600">
        Unable to load this product.
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <ProductEditor
      key={productSlug}
      product={product}
      categories={categories}
      router={router}
      productSlug={productSlug}
    />
  );
};

export default Page;
