import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApiService = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    credentials: "include",
  }),
  endpoints: (build) => ({
    getCategories: build.query({
      query: () => "/category/get",
    }),
    getProducts: build.query({
      query: ({
        page = 1,
        limit = 10,
        search,
        category,
        sortBy,
        order,
        isActive,
      } = {}) => ({
        url: "/product/admin/get",
        params: { page, limit, search, category, sortBy, order, isActive },
      }),
    }),
    createProduct: build.mutation({
      query: (body) => ({
        url: "/product/createProduct",
        method: "POST",
        body,
      }),
    }),
    updateProduct: build.mutation({
      query: ({ slug, body }) => ({
        url: `/product/update/${slug}`,
        method: "PUT",
        body,
      }),
    }),
    getProductBySlug: build.query({
      query: (slug) => `/product/admin/${slug}`,
    }),
    createCategories: build.mutation({
      query: (body) => ({
        url: "/category/create",
        method: "POST",
        body,
      }),
    }),
    updateCategories: build.mutation({
      query: ({ slug, body }) => ({
        url: `/category/update/${slug}`,
        method: "PUT",
        body,
      }),
    }),
    getCategoriesAdmin: build.query({
      query: (params = {}) => ({
        url: "/category/admin/get",
        params,
      }),
    }),
    
    getCategoryBySlug: build.query({
      query: (slug) => `/category/get/${slug}`,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductBySlugQuery,
  useCreateCategoriesMutation,
  useUpdateCategoriesMutation,
  useGetCategoriesAdminQuery,
} = adminApiService;
