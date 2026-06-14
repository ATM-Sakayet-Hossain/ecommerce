import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API, apiPath } from "@/lib/routes";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  credentials: "include",
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: apiPath(API.auth.refreshToken),
        method: API.auth.refreshToken.method,
      },
      api,
      extraOptions,
    );
    if (refreshResult.data) {
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const adminApiService = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (build) => ({
    getCategories: build.query({
      query: () => apiPath(API.category.get),
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
        url: apiPath(API.product.adminGet),
        params: { page, limit, search, category, sortBy, order, isActive },
      }),
    }),
    createProduct: build.mutation({
      query: (body) => ({
        url: apiPath(API.product.create),
        method: API.product.create.method,
        body,
      }),
    }),
    updateProduct: build.mutation({
      query: ({ slug, body }) => ({
        url: apiPath(API.product.update, { slug }),
        method: API.product.update.method,
        body,
      }),
    }),
    getProductBySlug: build.query({
      query: (slug) => apiPath(API.product.adminBySlug, { slug }),
    }),
    createCategories: build.mutation({
      query: (body) => ({
        url: apiPath(API.category.create),
        method: API.category.create.method,
        body,
      }),
    }),
    updateCategories: build.mutation({
      query: ({ slug, body }) => ({
        url: apiPath(API.category.update, { slug }),
        method: API.category.update.method,
        body,
      }),
    }),
    getCategoriesAdmin: build.query({
      query: (params = {}) => ({
        url: apiPath(API.category.adminGet),
        params,
      }),
    }),
    getCategoryBySlug: build.query({
      query: (slug) => apiPath(API.category.adminBySlug, { slug }),
    }),
    getBanner: build.query({
      query: (params = {}) => ({
        url: apiPath(API.banner.adminGet),
        params,
      }),
    }),
    getBannerBySlug: build.query({
      query: (slug) => apiPath(API.banner.adminBySlug, { slug }),
    }),
    createBanner: build.mutation({
      query: (body) => ({
        url: apiPath(API.banner.create),
        method: API.banner.create.method,
        body,
      }),
    }),
    updateBanner: build.mutation({
      query: ({ slug, body }) => ({
        url: apiPath(API.banner.update, { slug }),
        method: API.banner.update.method,
        body,
      }),
    }),
    getActivityLogs: build.query({
      query: (params = {}) => ({
        url: apiPath(API.activityLogs.adminGet),
        params,
      }),
    }),
    getAllUsers: build.query({
      query: (params = {}) => ({
        url: apiPath(API.auth.adminUsers),
        params,
      }),
    }),
    userStatus: build.mutation({
      query: (body) => ({
        url: apiPath(API.auth.adminUserStatus),
        method: API.auth.adminUserStatus.method,
        body,
      }),
    }),
    getOrders: build.query({
      query: (params = {}) => ({
        url: apiPath(API.order.get),
        params,
      }),
    }),
    getOrderByNumber: build.query({
      query: (orderNumber) => apiPath(API.order.detail, { orderNumber }),
    }),
    updateOrder: build.mutation({
      query: ({ orderId, body }) => ({
        url: apiPath(API.order.adminUpdate, { orderId }),
        method: API.order.adminUpdate.method,
        body,
      }),
    }),
    getReviews: build.query({
      query: (params = {}) => ({
        url: apiPath(API.review.adminGet),
        params,
      }),
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
  useGetBannerQuery,
  useGetBannerBySlugQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useGetActivityLogsQuery,
  useGetAllUsersQuery,
  useUserStatusMutation,
  useGetOrdersQuery,
  useGetOrderByNumberQuery,
  useUpdateOrderMutation,
  useGetReviewsQuery,
} = adminApiService;
