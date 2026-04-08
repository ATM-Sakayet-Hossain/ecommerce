"use client";
import { useState } from "react";
import Input from "../../../components/ui/input";
import Button from "../../../components/ui/Button";

const page = () => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Product Title is required";
    }
    if (!formData.category.trim()) {
      newErrors.category = "Product Title is required";
    }
    if (!formData.brand.trim()) {
      newErrors.brand = "Product Title is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length !== 0) return;
    try {
      setLoading(true);
      // 🔥 API call here
      console.log("Login Data:", formData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Product Create
          </h1>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="grid grid-cols-3 gap-5 border-1 py-2 px-4 rounded-xl">
            <Input
              label="Title"
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
            />
            <Input
              label="Slug"
              type="text"
              name="slug"
              placeholder="Slug"
              value={formData.slug}
              onChange={handleChange}
              error={errors.slug}
            />
            <Input
              label="category"
              type="text"
              name="category"
              placeholder="category"
              value={formData.category}
              onChange={handleChange}
              error={errors.category}
            />
            <Input
              label="brand"
              type="text"
              name="brand"
              placeholder="brand"
              value={formData.brand}
              onChange={handleChange}
              error={errors.brand}
            />
            <Input
              label="discountPrice"
              type="text"
              name="discountPercentage"
              placeholder="discountPercentage"
              value={formData.discountPercentage}
              onChange={handleChange}
              error={errors.discountPercentage}
            />
            <Input
              label="price"
              type="text"
              name="price"
              placeholder="price"
              value={formData.price}
              onChange={handleChange}
              error={errors.price}
            />
            <Input
              label="Description"
              type="text"
              name="description"
              placeholder="description"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
            />
            <Input
              label="tags"
              type="text"
              name="tags"
              placeholder="tags"
              value={formData.tags}
              onChange={handleChange}
              error={errors.tags}
            />
            <Input
              label="isActive"
              type="text"
              name="isActive"
              placeholder="isActive"
              value={formData.isActive}
              onChange={handleChange}
              error={errors.isActive}
            />
          </div>
          <div className="grid grid-cols-4 gap-5 border-1 py-2 px-4 rounded-xl">
            <Input
              label="sku"
              type="text"
              name="sku"
              placeholder="sku"
              value={formData.sku}
              onChange={handleChange}
              error={errors.sku}
            />
            <Input
              label="color"
              type="text"
              name="color"
              placeholder="color"
              value={formData.color}
              onChange={handleChange}
              error={errors.color}
            />
            <Input
              label="size"
              type="option"
              name="size"
              placeholder="size"
              value={formData.size}
              onChange={handleChange}
              error={errors.size}
            />
            <Input
              label="stock"
              type="text"
              name="stock"
              placeholder="stock"
              value={formData.stock}
              onChange={handleChange}
              error={errors.stock}
            />
          </div>
          <div className="grid grid-cols-2 gap-5 border-1 py-2 px-4 rounded-xl">
            <Input
              label="thumbnail"
              type="file"
              name="thumbnail"
              placeholder="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              error={errors.thumbnail}
            />
            <Input
              label="images"
              type="file"
              name="images"
              placeholder="images"
              value={formData.images}
              onChange={handleChange}
              error={errors.images}
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Button type="submit" loading={loading} variant="gradient">
              Cancle
            </Button>
            <Button type="submit" loading={loading} variant="primary">
              Create Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
