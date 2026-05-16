import Image from "next/image";

const ProductCard = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg w-[320px] overflow-hidden">
      <div className="relative h-48 bg-yellow-200">
        <Image
          src={data?.thumbnail}
          alt={data?.title}
          fill
          className="object-cover"
          sizes="320px"
        />
        {/* Stock Badge */}
        <span
          className={`absolute top-4 left-4 text-black font-semibold text-sm px-3 py-1 rounded-md shadow ${data?.variants.stock ? "bg-red-500" : "bg-green-400"}`}
        >
          {data?.variants.stock ? "stock Out" : "in Stock"}
        </span>
        {/* Favorite Button */}
        <button className="absolute top-3 right-3 bg-white rounded-full p-1 shadow text-gray-500 text-xl hover:text-red-500">
          &#9825;
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold h-15 text-xl mb-1">{data?.title}</h3>
        <p className="text-gray-500 text-sm h-6 overflow-hidden mb-2">
          {data?.brand}
        </p>
        <div className="flex items-center mb-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-yellow-400 text-lg mr-0.5">
              ★
            </span>
          ))}
          <span className="text-gray-400 text-sm ml-2">(342 reviews).</span>
        </div>
        <div className="flex items-baseline mb-3">
          <span className="text-green-600 text-2xl font-bold mr-2">
            TK{" "}
            {data?.price - data?.discountPercentage ||
              data?.discountPrice ||
              null}
          </span>
          <span className="text-gray-400 line-through text-base mr-3">
            {data?.price}
          </span>
          {data?.discountPercentage || data?.discountPrice ? (
            <span className="text-gray-700 text-base font-semibold bg-amber-300 px-1 rounded-sm">
              {data?.discountPercentage + "%" ||
                data?.discountPrice + "TK" ||
                null}
              Off
            </span>
          ) : (
            ""
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-indigo-500 font-medium text-base">
            View Details
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;