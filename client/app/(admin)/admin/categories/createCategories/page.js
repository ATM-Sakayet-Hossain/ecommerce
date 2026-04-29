"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  useCreateCategoriesMutation,
  useGetCategoriesQuery,
} from "@/app/(admin)/services/api";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import Select from "@/components/UI/Select";
import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";

const initialFormData = {
  name: "",
  description: "",
  parent: "",
  sortOrder: 0,
  thumbnail: null,
};

const Page = () => {
  const router = useRouter();
  const { data: categoryResponse } = useGetCategoriesQuery();
  const [createCategory, { isLoading }] = useCreateCategoriesMutation();
  const [formData, setFormData] = useState(initialFormData);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const categories = useMemo(
    () =>
      categoryResponse?.data?.categories || categoryResponse?.categories || [],
    [categoryResponse],
  );

  const handleChange = (event) => {
    const { name, value, files, type } = event.target;
    const nextValue = type === "file" ? files?.[0] || null : value;

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    if (name === "thumbnail" && nextValue) {
      const nextPreview = URL.createObjectURL(nextValue);
      setThumbnailPreview((currentPreview) => {
        if (currentPreview) {
          URL.revokeObjectURL(currentPreview);
        }

        return nextPreview;
      });
    }
  };

  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    if (!formData.thumbnail) {
      toast.error("Category thumbnail is required.");
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name.trim());
    payload.append("description", formData.description.trim());
    payload.append("parent", formData.parent);
    payload.append("sortOrder", String(Number(formData.sortOrder || 0)));
    payload.append("thumbnail", formData.thumbnail);

    try {
      await createCategory(payload).unwrap();
      toast.success("Category created successfully.");
      router.push("/admin/categories/allCategories");
    } catch (error) {
      toast.error(
        error?.data?.message || error?.error || "Unable to create category.",
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
            <h1 className="text-2xl font-bold text-gray-800">
              Add New Category
            </h1>
            <p className="text-sm text-gray-500">
              Create a category with a name, image, and optional parent.
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
            "Save Category"
          )}
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Input
            label="Category Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Men's Fashion"
          />

          <Select
            label="Parent Category"
            name="parent"
            value={formData.parent}
            onChange={handleChange}
            placeholder="No parent category"
            options={categories.map((category) => ({
              label: category?.name || "Unnamed category",
              value: String(category?._id || ""),
            }))}
          />

          <Input
            label="Sort Order"
            type="number"
            name="sortOrder"
            value={formData.sortOrder}
            onChange={handleChange}
            min={0}
            step={1}
          />

          <label className="block text-sm font-semibold text-slate-700">
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Optional category description"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {thumbnailPreview ? (
              <div className="relative h-56 w-full">
                <Image
                  src={thumbnailPreview}
                  alt={formData.name || "category image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="flex h-56 items-center justify-center text-sm text-slate-400">
                No image
              </div>
            )}
          </div>
          <label className="block text-sm font-semibold text-slate-700">
            Thumbnail
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 block w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            The category image will be uploaded to Cloudinary and the current
            user will be stored as both the creator and updater.
          </div>
        </div>
      </div>
    </form>
  );
};

export default Page;
