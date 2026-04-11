import React from "react";
import { X } from "lucide-react";
import Input from "../../ui/input";
import Image from "next/image";

const ProductImages = ({ formData, setFormData }) => {
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };
  const remove = (i) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== i),
    }));
  };
  return (
    <div className="card border border-blue-400 p-4 rounded-xl">
      <h3 className="mb-2 text-lg text-center font-semibold">Images</h3>
      <div className="grid grid-cols-2 gap-5">
        <Input
          label="Main Image"
          type="file"
          name="thumbnail"
          accept="image/*"
          onChange={(e) =>
            setFormData((p) => ({
              ...p,
              thumbnail: e.target.files?.[0] || null,
            }))
          }
        />
        <Input
          label="Gallery Images"
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={handleUpload}
        />
      </div>
      <div className="grid grid-cols-4 gap-2 mt-4">
        {formData.images.map((img, i) => (
          <div key={i} className="relative">
            <Image
              src={URL.createObjectURL(img)}
              alt={`Product ${i + 1}`}
              className="h-20 w-full object-cover"
            />
            <button type="button" onClick={() => remove(i)}>
              <X size={24} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
