"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  useCreateProductMutation,
  useGetCategoriesQuery,
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

const initialFormData = {
  title: "",
  slug: "",
  description: "",
  category: "",
  brand: "",
  discountType: "amount",
  discountPrice: 0,
  discountPercentage: 0,
  price: "",
  tags: "",
  thumbnail: null,
  images: [],
  isActive: true,
};

const initialVariants = [
  {
    sku: "",
    color: "",
    size: "",
    stock: 0,
  },
];

const Page = () => {
  const router = useRouter();
  const { data: categoryResponse } = useGetCategoriesQuery();
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [formData, setFormData] = useState(initialFormData);
  const [variants, setVariants] = useState(initialVariants);

  const categories = useMemo(
    () =>
      categoryResponse?.data?.categories || categoryResponse?.categories || [],
    [categoryResponse],
  );

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

    if (!formData.thumbnail) {
      toast.error("Product thumbnail is required.");
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
      (variant) => variant.sku && variant.color && variant.size && variant.stock >= 0,
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
    payload.append("thumbnail", formData.thumbnail);

    formData.images.slice(0, 4).forEach((image) => {
      payload.append("images", image);
    });

    try {
      await createProduct(payload).unwrap();
      toast.success("Product created successfully.");
      router.push("/admin/products/allProducts");
    } catch (error) {
      toast.error(error?.data?.message || error?.error || "Unable to create product.");
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
            <h1 className="text-2xl font-bold text-gray-800">
              Add New Product
            </h1>
            <p className="text-sm text-gray-500">
              Create a product that matches the schema requirements.
            </p>
          </div>
        </div>

        <Button type="submit" loading={isLoading} className="min-w-40">
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving
            </span>
          ) : (
            "Save Product"
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
          <ProductImages formData={formData} setFormData={setFormData} />
        </div>
        <ProductVariants variants={variants} setVariants={setVariants} />
      </div>
    </form>
  );
};

export default Page;
