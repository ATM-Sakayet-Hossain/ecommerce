import { ArrowLeft } from "lucide-react";
import ProductForm from "../../../components/admin/product/ProductForm";
// import { useRouter } from "next/navigation";

const page = () => {
  // const router = useRouter();
  return (
    <div className="h-[calc(100vh-4.2rem)] space-y-6 rounded-xl bg-green-50 p-4 pb-10">
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-4">
          
          <button
            // onClick={router.back('/createProduct')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Add New Product
            </h2>
            <p className="text-gray-600">Create a new product for your store</p>
          </div>
        </div>
      </div>
      <div className="pb-2">
        <ProductForm />
      </div>
    </div>
  )
}

export default page