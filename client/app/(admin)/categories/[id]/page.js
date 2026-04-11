import CategoryView from "../../../components/admin/CategoryView";
import { cookies } from "next/headers";

const API_BASE_URL = (
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:1993"
).replace(/\/$/, "");

const normalizeCategory = (item) => ({
  id: item?._id?.$oid || item?._id,
  name: item?.name || "Category",
  image: item?.thumbnail || "/placeholder.png",
  description: item?.description || "No description available.",
  productCount: item?.productCount || 0,
  status: item?.isActive === false ? "inactive" : "active",
  totalRevenue: 0,
  avgRating: "-",
  createdAt: item?.createdAt,
});

async function findCategoryFromEndpoint(path, id, headers = {}) {
  const limit = 100;
  const firstRes = await fetch(`${API_BASE_URL}${path}?page=1&limit=${limit}`, {
    headers,
    cache: "no-store",
  });

  if (!firstRes.ok) return null;

  const firstPayload = await firstRes.json();
  const firstData = firstPayload?.data || {};
  const firstCategories = firstData?.categories || [];
  const firstMatch = firstCategories.find(
    (item) => String(item?._id?.$oid || item?._id) === String(id),
  );
  if (firstMatch) return normalizeCategory(firstMatch);

  const totalPage = Number(firstData?.totalPage || 1);
  for (let page = 2; page <= totalPage; page += 1) {
    const res = await fetch(`${API_BASE_URL}${path}?page=${page}&limit=${limit}`, {
      headers,
      cache: "no-store",
    });
    if (!res.ok) continue;

    const payload = await res.json();
    const categories = payload?.data?.categories || [];
    const match = categories.find(
      (item) => String(item?._id?.$oid || item?._id) === String(id),
    );
    if (match) return normalizeCategory(match);
  }

  return null;
}

async function getCategory(id) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("X-AS-Token")?.value;
    const authHeaders = token ? { Cookie: `X-AS-Token=${token}` } : {};

    const adminMatch = await findCategoryFromEndpoint(
      "/category/admin/get",
      id,
      authHeaders,
    );
    if (adminMatch) return adminMatch;

    return await findCategoryFromEndpoint("/category/get", id);
  } catch {
    return null;
  }
}

export default async function Page({ params }) {
  const { id } = await params;
  const category = await getCategory(id);
  const products = [];

  if (!category) {
    return <div className="p-4">Category not found.</div>;
  }

  return <CategoryView category={category} products={products} />;
}
