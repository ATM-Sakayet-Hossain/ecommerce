"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import BasicInfo from "./BasicInfo";
import ProductImages from "./ProductImages";
import ProductVariants from "./ProductVariants";
import toast from "react-hot-toast";
import Button from "../../ui/Button";

const ProductForm = () => {
  const router = useRouter();
  const categoriesData = useSelector((state) => state.categorySlice.categories);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    brand: "",
    discountPrice: "",
    discountPercentage: "",
    discountType: "",
    price: "",
    tags: "",
    thumbnail: null,
    images: [],
    isActive: true,
  });
  const [variants, setVariants] = useState([
    {
      sku: "",
      color: "",
      size: "",
      stock: "",
    },
  ]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.category) {
      return toast.error("Basic into Required fields missing");
    }
    if (!variants.sku || !variants.color || !variants.size || !variants.stock) {
      return toast.error("variants Required fields missing");
    }
    try {
      const fd = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "images" || key === "discountType") return;
        const value = formData[key];
        if (typeof value === "boolean") {
          fd.append(key, String(value));
          return;
        }
        if (value !== "" && value !== null && value !== undefined) {
          fd.append(key, value);
        }
      });
      formData.images.forEach((img) => {
        fd.append("images", img);
      });
      fd.append("variants", JSON.stringify(variants));
      //   await productServices.createProduct(fd);
      toast.success("Product created");
      // router.push("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create product");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <BasicInfo
            formData={formData}
            setFormData={setFormData}
            categories={categoriesData}
          />
          <ProductImages formData={formData} setFormData={setFormData} />
        </div>
        <ProductVariants variants={variants} setVariants={setVariants} />
      </div>
      <div className="flex justify-center gap-5">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/products/createProduct")}
          className="cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={() => router.push("/products/createProduct")}
          className="cursor-pointer"
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
