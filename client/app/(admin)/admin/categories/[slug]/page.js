"use client";

import { useMemo} from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
} from "@/app/(admin)/services/api";
import CategoryEditor from "@/components/admin/CategoryEditor";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  const { data: parentResponse } = useGetCategoriesQuery();
  const parentCategories = useMemo(
    () => parentResponse?.data?.categories || parentResponse?.categories || [],
    [parentResponse],
  );

  const {
    data: categoryResponse,
    isLoading: isCategoryLoading,
    isError,
  } = useGetCategoryBySlugQuery(slug, {
    skip: !slug,
  });

  const category = categoryResponse?.data || categoryResponse || null;

  if (isCategoryLoading && !category) {
    return (
      <div className="flex h-[calc(100vh-7rem)] items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-500">
        Loading category details...
      </div>
    );
  }

  if (isError && !category) {
    return (
      <div className="flex h-[calc(100vh-7rem)] items-center justify-center rounded-xl bg-gray-50 text-sm text-red-600">
        Unable to load this category.
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <CategoryEditor
      key={slug}
      category={category}
      parentCategories={parentCategories}
      router={router}
      slug={slug}
    />
  );
};

export default Page;
