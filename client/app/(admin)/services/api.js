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
      query: (body) => ({
        url: "/product/update/:slug",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useCreateProductMutation,
} = adminApiService;
