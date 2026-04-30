"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useGetBannerBySlugQuery,
} from "@/app/(admin)/services/api";
import BannerEditorForm from "@/components/admin/BannerEditorForm";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  const {
    data: bannerResponse,
    isLoading: isBannerLoading,
    isError,
  } = useGetBannerBySlugQuery(slug, {
    skip: !slug,
  });

  const banner = bannerResponse?.data || bannerResponse || null;

  if (isBannerLoading && !banner) {
    return (
      <div className="flex h-[calc(100vh-7rem)] items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-500">
        Loading banner details...
      </div>
    );
  }

  if (isError && !banner) {
    return (
      <div className="flex h-[calc(100vh-7rem)] items-center justify-center rounded-xl bg-gray-50 text-sm text-red-600">
        Unable to load this banner.
      </div>
    );
  }

  if (!banner) {
    return null;
  }

  return (
    <BannerEditorForm key={slug} banner={banner} slug={slug} router={router} />
  );
};

export default Page;
