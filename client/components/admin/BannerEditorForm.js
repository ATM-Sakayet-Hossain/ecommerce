import React from "react";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import Select from "@/components/UI/Select";
import { ArrowLeft, ImagePlus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useUpdateBannerMutation } from "@/app/(admin)/services/api";

const buildInitialFormData = (banner) => ({
  title: banner?.title || "",
  subtitle: banner?.subtitle || "",
  startDate: banner?.startDate
    ? new Date(banner.startDate).toISOString().slice(0, 16)
    : "",
  endDate: banner?.endDate
    ? new Date(banner.endDate).toISOString().slice(0, 16)
    : "",
  isActive: String(banner?.isActive !== false),
  image: null,
});

const BannerEditorForm = ({ banner, slug, router }) => {
  const [updateBanner, { isLoading }] = useUpdateBannerMutation();
  const [formData, setFormData] = useState(() => buildInitialFormData(banner));
  const [previewUrl, setPreviewUrl] = useState(() => banner?.image || "");

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (event) => {
    const { name, value, files, type } = event.target;
    const nextValue = type === "file" ? files?.[0] || null : value;

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    if (name === "image" && nextValue) {
      const nextPreview = URL.createObjectURL(nextValue);
      setPreviewUrl((currentPreview) => {
        if (currentPreview && currentPreview.startsWith("blob:")) {
          URL.revokeObjectURL(currentPreview);
        }

        return nextPreview;
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Banner title is required.");
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title.trim());
    payload.append("subtitle", formData.subtitle.trim());
    payload.append("startDate", formData.startDate);
    payload.append("endDate", formData.endDate);
    payload.append("isActive", formData.isActive);

    if (formData.image) {
      payload.append("image", formData.image);
    }

    try {
      await updateBanner({ slug, body: payload }).unwrap();
      toast.success("Banner updated successfully.");
      router.push("/admin/banner/allBanner");
    } catch (error) {
      toast.error(
        error?.data?.message || error?.error || "Unable to update banner.",
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
            <h1 className="text-2xl font-bold text-gray-800">Edit Banner</h1>
            <p className="text-sm text-gray-500">
              Update the banner details and image.
            </p>
          </div>
        </div>

        <Button type="submit" loading={isLoading} className="min-w-40">
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Updating
            </span>
          ) : (
            "Update Banner"
          )}
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Input
            label="Banner Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          <Input
            label="Subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Start Date"
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
            <Input
              label="End Date"
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>

          <Select
            label="Active"
            name="isActive"
            value={formData.isActive}
            onChange={handleChange}
            options={[
              { label: "True", value: "true" },
              { label: "False", value: "false" },
            ]}
          />
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {previewUrl ? (
              <div className="relative h-60 w-full">
                <Image
                  src={previewUrl}
                  alt={formData.title || "banner preview"}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-60 flex-col items-center justify-center gap-2 text-sm text-slate-400">
                <ImagePlus className="h-8 w-8" />
                No image selected
              </div>
            )}
          </div>

          <label className="block text-sm font-semibold text-slate-700">
            Banner Image
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 block w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
        </div>
      </div>
    </form>
  );
};

export default BannerEditorForm;
