"use client";

import React, { useState } from 'react'
import Image from "next/image";
import Select from "../UI/Select";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useUpdateCategoriesMutation } from "@/app/(admin)/services/api";
import { toast } from 'react-toastify';

const CategoryEditor = ({ category, parentCategories, router, slug }) => {
  const [updateCategory, { isLoading: isSaving }] =
    useUpdateCategoriesMutation();
  const [formData, setFormData] = useState(() => ({
    name: category?.name || "",
    description: category?.description || "",
    parent: category?.parent?._id || category?.parent || "",
    sortOrder: category?.sortOrder ?? 0,
    isActive: Boolean(category?.isActive),
    thumbnail: null,
  }));
  const [thumbnailPreview, setThumbnailPreview] = useState(
    () => category?.thumbnail || "",
  );

  const getUser = (user) => {
    if (!user) {
      return "-";
    }

    if (typeof user === "object") {
      return user?.fullName || user?.email || user?.role || "-";
    }

    return String(user);
  };

  const handleChange = (event) => {
    const { name, value, files, type } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] || null : value,
    }));

    if (name === "thumbnail" && files?.[0]) {
      setThumbnailPreview(URL.createObjectURL(files[0]));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!slug) {
      toast.error("Category slug is missing.");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name.trim());
    payload.append("description", formData.description.trim());
    payload.append("parent", formData.parent);
    payload.append("sortOrder", String(Number(formData.sortOrder || 0)));
    payload.append("isActive", String(formData.isActive));

    if (formData.thumbnail) {
      payload.append("thumbnail", formData.thumbnail);
    }

    try {
      await updateCategory({ slug, body: payload }).unwrap();
      toast.success("Category updated successfully.");
      router.push("/admin/categories/allCategories");
    } catch (error) {
      toast.error(
        error?.data?.message || error?.error || "Unable to update category.",
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
            <h1 className="text-2xl font-bold text-gray-800">Edit Category</h1>
            <p className="text-sm text-gray-500">
              Update category details, image, parent, and active status.
            </p>
          </div>
        </div>

        <Button type="submit" loading={isSaving} className="min-w-40">
          {isSaving ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving
            </span>
          ) : (
            "Update Category"
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
            placeholder="Category name"
          />

          <Select
            label="Parent Category"
            name="parent"
            value={formData.parent}
            onChange={handleChange}
            placeholder="No parent category"
            options={parentCategories
              .filter((item) => String(item?._id) !== String(category?._id))
              .map((item) => ({
                label: item?.name || "Unnamed category",
                value: String(item?._id || ""),
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

          <Select
            label="Status"
            name="isActive"
            value={String(formData.isActive)}
            onChange={handleChange}
            options={[
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ]}
            placeholder="Select status"
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
            Created By: {getUser(category?.createdBy)}
            <br />
            Updated By: {getUser(category?.updatedBy)}
          </div>
        </div>
      </div>
    </form>
  );
};

export default CategoryEditor