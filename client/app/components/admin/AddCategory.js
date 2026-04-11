"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:1993"
).replace(/\/$/, "");

const AddCategory = ({ stateChane }) => {
  const [categoryData, setCategoryData] = useState({
    name: "",
    thumbnail: null,
  });

  const handelCreate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", categoryData.name);
      formData.append("thumbnail", categoryData.thumbnail);

      const response = await fetch(`${API_BASE_URL}/category/create`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const res = await response.json();
      if (!response.ok || !res?.success) {
        throw new Error(res?.message || "Failed to create category");
      }

      toast.success(res.message || "Category created successfully");
      stateChane(false);
    } catch (error) {
      toast.error(error?.message || "Category create failed");
    }
  };
  return (
    <div className="absolute top-0 left-0 z-50 h-full w-full bg-black/25 flex items-center justify-center">
      <form onSubmit={handelCreate} className="bg-white w-xl p-10 rounded-2xl space-y-10">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Name
          </label>
          <input
            onChange={(e) =>
              setCategoryData((prev) => ({ ...prev, name: e.target.value }))
            }
            type="text"
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Image
          </label>
          <input
            onChange={(e) =>
              setCategoryData((prev) => ({
                ...prev,
                thumbnail: e.target.files?.[0] || null,
              }))
            }
            type="file"
            className="input-field"
            name="category"
            required
          />
        </div>
        <button type="submit" className="btn-primary inline-flex items-center">
          Create
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
