import React from "react";
import Input from "../../ui/input";
import Textarea from "../../ui/Textarea";
import Select from "../../ui/Select";

const brandOptions = ["nike", "adidas", "puma", "reebok", "new-balance"].map(
  (brand) => ({
    label: brand
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
    value: brand,
  }),
);

const BasicInfo = ({ formData, setFormData, categories }) => {
  const categoryOptions = (categories || [])
    .map((category) => {
      if (typeof category === "string") {
        return { label: category, value: category };
      }
      const label =
        category?.name ||
        category?.title ||
        category?.label ||
        category?.value ||
        "";
      const value =
        category?._id ||
        category?.id ||
        category?.slug ||
        category?.name ||
        category?.value ||
        "";
      return { label, value };
    })
    .filter((option) => option.label && option.value);

  const discountValue =
    formData.discountType === "percentage"
      ? formData.discountPercentage
      : formData.discountPrice;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...(name === "isActive"
        ? {
            ...prev,
            isActive: value === "true",
          }
        : name === "discountType"
          ? {
              ...prev,
              discountType: value,
              ...(value === "percentage"
                ? { discountPrice: 0 }
                : { discountPercentage: 0 }),
            }
          : name === "discountValue"
            ? {
                ...prev,
                ...(prev.discountType === "percentage"
                  ? { discountPercentage: Number(value || 0), discountPrice: 0 }
                  : {
                      discountPrice: Number(value || 0),
                      discountPercentage: 0,
                    }),
              }
            : {
                ...prev,
                [name]: value,
              }),
    }));
  };
  return (
    <div className="card border border-blue-400 p-4 rounded-xl">
      <h3 className="mb-2 text-lg text-center font-semibold">Basic Info</h3>
      <Input
        label="Title"
        placeholder="Title"
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
      />
      <Input
        label="Slug"
        placeholder="Slug"
        type="text"
        name="slug"
        value={formData.slug}
        onChange={handleChange}
      />
      <Textarea
        label="Description"
        placeholder="Enter product description"
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Category"
          value={formData.category || ""}
          name="category"
          options={categoryOptions}
          placeholder="Select Category"
          onChange={handleChange}
        />
        <Select
          label="Brand"
          value={formData.brand}
          name="brand"
          options={brandOptions}
          placeholder="Select Brand"
          onChange={handleChange}
        />
        {/* <Input
          label="Discount Price"
          placeholder="Discount Price"
          type="number"
          name="discountPrice"
          value={formData.discountPrice}
          onChange={handleChange}
        />
        <Input
          label="Discount Percentage"
          placeholder="Discount Percentage"
          type="number"
          name="discountPercentage"
          value={formData.discountPercentage}
          onChange={handleChange}
        /> */}
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Discount Type"
            name="discountType"
            value={formData.discountType}
            options={[
              { label: "Fixed Amount (Tk.)", value: "amount" },
              { label: "Percentage (%)", value: "percentage" },
            ]}
            placeholder="Select Type"
            onChange={handleChange}
          />
          <Input
            label={
              formData.discountType === "percentage"
                ? "Discount (%)"
                : "Discount Amount (Tk.)"
            }
            placeholder={
              formData.discountType === "percentage"
                ? "Enter %"
                : "Enter amount"
            }
            type="number"
            name="discountValue"
            value={discountValue}
            min={0}
            max={formData.discountType === "percentage" ? 100 : undefined}
            onChange={handleChange}
          />
        </div>
        <Input
          label="Price"
          placeholder="Price"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
        <Input
          label="Tags"
          placeholder="Tags"
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
        />
        <Select
          label="Active"
          name="isActive"
          value={String(formData.isActive)}
          options={[
            { label: "True", value: "true" },
            { label: "False", value: "false" },
          ]}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default BasicInfo;
