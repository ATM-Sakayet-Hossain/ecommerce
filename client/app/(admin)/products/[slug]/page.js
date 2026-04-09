import { notFound } from "next/navigation";
import ProductDetails from "../../../components/admin/product/productDetails";
import fallbackProducts from "../allProducts/ecommerce.products.json";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:1993";

async function getProduct(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/product/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams?.slug || "");

  const apiProduct = await getProduct(slug);
  const fallbackProduct = fallbackProducts.find((p) => p.slug === slug) || null;
  const product = apiProduct || fallbackProduct;

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
