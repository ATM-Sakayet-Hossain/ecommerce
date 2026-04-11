import React from "react";
import { cookies } from "next/headers";
import CategoriesUI from "../../components/admin/CategoriesUI";

const API_BASE_URL = (
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:1993"
).replace(/\/$/, "");

async function getCategories() {
  const cookieStore = await cookies();
  const token = cookieStore.get("X-AS-Token")?.value;

  const res = await fetch(`${API_BASE_URL}/category/admin/get`, {
    headers: token ? { Cookie: `X-AS-Token=${token}` } : {},
    cache: "no-store", // SSR (no caching)
  });

  if (!res.ok) {
    const publicRes = await fetch(`${API_BASE_URL}/category/get`, {
      cache: "no-store",
    });
    if (!publicRes.ok) return [];
    const publicPayload = await publicRes.json();
    return publicPayload?.data?.categories || [];
  }

  const payload = await res.json();
  return payload?.data?.categories || [];
}

const page = async () => {
  const categories = await getCategories();
  return <CategoriesUI initialCategories={categories} />;
};

export default page;
