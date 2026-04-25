import React from "react";
import { X } from "lucide-react";
import Input from "../UI/Input";
import Image from "next/image";
import { IoRemoveCircleSharp } from "react-icons/io5";

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
  const removeThumbnail = () => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: null,
    }));
  };
  return (
    <div className="border border-blue-400 p-4 rounded-xl">
      {/* <h3 className="mb-2 text-lg text-center font-semibold">Images</h3> */}
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
      <div className="grid grid-cols-2 gap-2 mt-4">
        {formData.thumbnail && (
          <div className="relative">
            <Image
              src={URL.createObjectURL(formData.thumbnail)}
              alt="Product thumbnail"
              className="h-20 w-20 rounded-lg object-cover border border-red-600"
              width={20}
              height={20}
            />
          </div>
        )}
        <div className="grid grid-cols-4">
          {(formData.images || []).map((imageFile, i) => (
            <div key={i} className="relative">
              <Image
                src={URL.createObjectURL(imageFile)}
                alt={`Product ${i + 1}`}
                className="h-20 w-20 rounded-lg object-cover border border-green-700"
                width={40}
                height={40}
              />
              <button
                className="absolute -top-3.5 right-1 bg-white rounded-full shadow-md text-red-500"
                type="button"
                onClick={() => remove(i)}
              >
                <IoRemoveCircleSharp size={24} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductImages;
