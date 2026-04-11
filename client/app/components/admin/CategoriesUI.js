"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, MoreVertical, Eye, Tags, Package } from "lucide-react";
import { useSelector } from "react-redux";
import AddCategory from "./AddCategory";
import Image from "next/image";
import CardBody from "../ui/CardBody";

const CategoriesUI = ({ initialCategories }) => {
  const userData = useSelector((state) => state?.authSlice?.user ?? null);

  const [addCategoryModal, setAddCategoryModal] = useState(false);
  const categories = Array.isArray(initialCategories) ? initialCategories : []; // SSR data
  const activeCategories = categories.filter(
    (category) => category?.isActive !== false,
  );
  const inactiveCategories = categories.filter(
    (category) => category?.isActive === false,
  );
  const activeCategoriesCount = activeCategories.length;
  const inactiveCategoriesCount = inactiveCategories.length;

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      draft: "bg-yellow-100 text-yellow-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusClasses[status.toLowerCase()]
        }`}
      >
        {status}
      </span>
    );
  };

  const getCategoryId = (category) => {
    if (typeof category?._id === "string") return category._id;
    if (category?._id?.$oid) return category._id.$oid;
    return "";
  };

  const renderCategoryCard = (category) => (
    <div key={getCategoryId(category) || category?.name} className="group">
      <div className="relative">
        <Image
          src={category?.thumbnail || "/placeholder.png"}
          alt={category?.name || "Category"}
          width={56}
          height={56}
          className="w-full h-48 object-cover object-top rounded-lg mb-4"
        />

        <div className="absolute top-2 right-2">
          <div className="relative">
            <button className="p-2 bg-white rounded-full shadow-sm hover:shadow-md">
              <MoreVertical className="h-4 w-4 text-gray-600" />
            </button>

            <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border py-1 w-32 opacity-0 group-hover:opacity-100">
              <Link
                href={`/categories/${getCategoryId(category)}`}
                className="flex items-center px-3 py-2 text-sm hover:bg-gray-100"
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{category.name}</h3>
          {getStatusBadge(category?.isActive === false ? "inactive" : "active")}
        </div>

        <p className="text-sm text-gray-500">{category?.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Package className="h-4 w-4 mr-1" />
            {category?.productCount} products
          </div>

          <Link
            href={`/categories/${getCategoryId(category)}`}
            className="text-primary-600 font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-4 bg-green-50 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage your product categories</p>
        </div>

        {userData?.role === "admin" && (
          <button
            onClick={() => setAddCategoryModal(true)}
            className="btn-primary inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </button>
        )}
      </div>

      {addCategoryModal && <AddCategory stateChane={setAddCategoryModal} />}
      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <CardBody
          style={{ backgroundColor: "#000" }}
          icon={<Tags size={50} color="#fff" />}
          title="Total Categories"
          total={categories.length}
        />
        <CardBody
          style={{ backgroundColor: "green" }}
          icon={<Package size={50} color="#fff" />}
          title="Active Categories"
          total={activeCategoriesCount}
        />
        <CardBody
          style={{ backgroundColor: "#F56954" }}
          icon={<Package size={50} color="#fff" />}
          title="Inactive Categories"
          total={inactiveCategoriesCount}
        />
      </div>

      {/* Categories Grid */}
      {activeCategoriesCount > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Active Categories
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {activeCategories.map((category) => renderCategoryCard(category))}
          </div>
        </div>
      )}

      {inactiveCategoriesCount > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Inactive Categories
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {inactiveCategories.map((category) => renderCategoryCard(category))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="text-center py-12">
          <Tags className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No categories found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search</p>

          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Category
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoriesUI;
