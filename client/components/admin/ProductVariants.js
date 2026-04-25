import React from "react";
import Button from "../UI/Button";
import Input from "../UI/Input";
import { IoRemoveCircleSharp } from "react-icons/io5";
import Select from "../UI/Select";

const sizeOptions = ["s", "m", "l", "xl", "2xl", "3xl"].map((size) => ({
  label: size.toUpperCase(),
  value: size,
}));
const ProductVariants = ({ variants = [], setVariants = () => {} }) => {
  // AUTO SKU GENERATOR
  const regenerateAllSKU = (variants) => {
    return variants.map((v, index) => {
      const colorPart = v.color ? v.color.slice(0, 3).toUpperCase() : "COL";
      const sizePart = v.size ? v.size.toUpperCase() : "SZ";
      const number = String(index + 1).padStart(3, "0");
      return {
        ...v,
        sku: `${colorPart}-${sizePart}-${number}`,
      };
    });
  };
  // ADD VARIANT
  const addVariant = () => {
    const updated = [
      ...variants,
      {
        sku: "",
        color: "",
        size: "",
        stock: "",
      },
    ];
    setVariants(regenerateAllSKU(updated));
  };
  // UPDATE VARIANT
  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(regenerateAllSKU(updated));
  };
  // REMOVE VARIANT
  const removeVariant = (index) => {
    const updated = variants.filter((_, i) => i !== index);
    setVariants(regenerateAllSKU(updated));
  };

  return (
    <div className="border border-blue-400 p-3 rounded-xl">
      <div className="flex">
        <h2 className="w-3/5 text-lg font-semibold text-center">
          Product Variants
        </h2>
        <div className="w-2/5 flex justify-end">
          <Button
            type="button"
            variant="gradient"
            onClick={addVariant}
            className="w-1/2 cursor-pointer"
          >
            Add Variant
          </Button>
        </div>
      </div>
      <div className="h-[calc(100vh-18rem)] overflow-y-auto scrollbar-hide pt-3">
        {variants.map((v, i) => (
          <div
            key={i}
            className="border border-blue-400 p-2 rounded-lg mb-4 grid grid-cols-5 gap-2 relative"
          >
            <button
              type="button"
              onClick={() => removeVariant(i)}
              className="absolute -top-3.5 right-0 bg-white rounded-full shadow-md text-red-500 hover:scale-110 transition"
              aria-label="Remove variant"
            >
              <IoRemoveCircleSharp size={26} />
            </button>
            <Input
              label="SKU"
              type="text"
              placeholder="SKU"
              value={v.sku}
              readOnly
            />
            <Input
              label="Color"
              type="text"
              placeholder="Color"
              value={v.color}
              onChange={(e) => updateVariant(i, "color", e.target.value)}
            />
            <Select
              label="Size"
              value={v.size}
              name={`variants.${i}.size`}
              options={sizeOptions}
              placeholder="Select size"
              onChange={(e) => updateVariant(i, "size", e.target.value)}
            />
            <Input
              label="Price"
              type="number"
              placeholder="Price"
              value={v.Price}
              onChange={(e) =>
                updateVariant(i, "Price", Number(e.target.value))
              }
            />
            <Input
              label="Stock"
              type="number"
              placeholder="Stock"
              value={v.stock}
              onChange={(e) =>
                updateVariant(i, "stock", Number(e.target.value))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductVariants;
