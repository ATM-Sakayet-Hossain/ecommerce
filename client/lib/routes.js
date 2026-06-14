/**
 * Central route map for client pages and server API endpoints.
 * Public pages: (ecommerce) + (auth). Admin pages: /admin/*
 */

/** Replace :param segments in API paths */
export function apiPath(routeDef, params = {}) {
  if (!routeDef?.path) return "";
  let path = routeDef.path;
  for (const [key, value] of Object.entries(params)) {
    path = path.replace(`:${key}`, encodeURIComponent(String(value)));
  }
  return path;
}

/** Replace :param segments in client page paths */
export function clientPath(routeDef, params = {}) {
  if (!routeDef?.path) return "";
  let path = routeDef.path;
  for (const [key, value] of Object.entries(params)) {
    path = path.replace(`:${key}`, encodeURIComponent(String(value)));
  }
  return path;
}

export const API = {
  auth: {
    register: { method: "POST", path: "/auth/register" },
    verifyOTP: { method: "POST", path: "/auth/verifyOTP" },
    resendOTP: { method: "POST", path: "/auth/resendOTP" },
    login: { method: "POST", path: "/auth/login" },
    logout: { method: "POST", path: "/auth/logout" },
    forgetPass: { method: "POST", path: "/auth/forgetPass" },
    resetPass: { method: "POST", path: "/auth/resetPass" },
    changePassword: { method: "POST", path: "/auth/changePassword" },
    refreshToken: { method: "POST", path: "/auth/refreshToken" },
    getprofile: { method: "GET", path: "/auth/getprofile" },
    updateUserProfile: { method: "PUT", path: "/auth/updateUserProfile" },
    getAuthStatus: { method: "GET", path: "/auth/getAuthStatus" },
    deactivateAccount: { method: "POST", path: "/auth/deactivateAccount" },
    adminUsers: { method: "GET", path: "/auth/admin/users" },
    adminUserStatus: { method: "PUT", path: "/auth/admin/userStatus" },
  },
  category: {
    create: { method: "POST", path: "/category/create" },
    adminGet: { method: "GET", path: "/category/admin/get" },
    get: { method: "GET", path: "/category/get" },
    publicBySlug: { method: "GET", path: "/category/public/:slug" },
    adminBySlug: { method: "GET", path: "/category/get/:slug" },
    update: { method: "PUT", path: "/category/update/:slug" },
  },
  product: {
    create: { method: "POST", path: "/product/createProduct" },
    adminGet: { method: "GET", path: "/product/admin/get" },
    adminBySlug: { method: "GET", path: "/product/admin/:slug" },
    get: { method: "GET", path: "/product/get" },
    bySlug: { method: "GET", path: "/product/:slug" },
    update: { method: "PUT", path: "/product/update/:slug" },
  },
  banner: {
    create: { method: "POST", path: "/banner/create" },
    adminGet: { method: "GET", path: "/banner/admin/get" },
    adminBySlug: { method: "GET", path: "/banner/admin/get/:slug" },
    get: { method: "GET", path: "/banner/get" },
    update: { method: "PUT", path: "/banner/update/:slug" },
    delete: { method: "DELETE", path: "/banner/:slug" },
  },
  cart: {
    add: { method: "POST", path: "/cart/add" },
    get: { method: "GET", path: "/cart/get" },
    update: { method: "PUT", path: "/cart/update" },
    remove: { method: "DELETE", path: "/cart/remove/:sku" },
    clear: { method: "DELETE", path: "/cart/clear" },
  },
  order: {
    checkout: { method: "POST", path: "/order/checkout" },
    get: { method: "GET", path: "/order/get" },
    detail: { method: "GET", path: "/order/detail/:orderNumber" },
    adminUpdate: { method: "PUT", path: "/order/admin/update/:orderId" },
  },
  review: {
    get: { method: "GET", path: "/review/get" },
    adminGet: { method: "GET", path: "/review/admin/get" },
    stats: { method: "GET", path: "/review/stats" },
    mine: { method: "GET", path: "/review/mine" },
    pending: { method: "GET", path: "/review/pending" },
    single: { method: "GET", path: "/review/single/:reviewId" },
    create: { method: "POST", path: "/review/:slug" },
    update: { method: "PUT", path: "/review/update/:reviewId" },
    adminApprove: { method: "PATCH", path: "/review/admin/approve/:reviewId" },
    adminDeleteSoft: {
      method: "DELETE",
      path: "/review/admin/delete-soft/:reviewId",
    },
  },
  activityLogs: {
    adminGet: { method: "GET", path: "/activity-logs/admin/get" },
  },
};

export const publicRoutes = {
  home: { path: "/", label: "Home" },
  shop: { path: "/shop", label: "Shop", api: API.product.get },
  shopDetail: {
    path: "/shop/:slug",
    label: "Product",
    api: API.product.bySlug,
  },
  categories: {
    path: "/categories",
    label: "Categories",
    api: API.category.get,
  },
  categoryDetail: {
    path: "/categories/:slug",
    label: "Category",
    api: API.category.publicBySlug,
  },
  cart: { path: "/cart", label: "Cart", api: API.cart.get },
  checkout: { path: "/checkout", label: "Checkout", api: API.order.checkout },
  orders: { path: "/orders", label: "My Orders", api: API.order.get },
  orderDetail: {
    path: "/orders/:orderNumber",
    label: "Order",
    api: API.order.detail,
  },
};

export const authRoutes = {
  login: { path: "/login", label: "Login", api: API.auth.login },
  register: { path: "/register", label: "Register", api: API.auth.register },
  verifyOTP: {
    path: "/verifyOTP",
    label: "Verify OTP",
    api: API.auth.verifyOTP,
  },
  forgotPassword: {
    path: "/forgotPassword",
    label: "Forgot Password",
    api: API.auth.forgetPass,
  },
  resetPassword: {
    path: "/resetPassword",
    label: "Reset Password",
    api: API.auth.resetPass,
  },
  resetSuccess: { path: "/resetSuccess", label: "Reset Success" },
  profile: { path: "/profile", label: "Profile", api: API.auth.getprofile },
};

export const adminRoutes = {
  dashboard: { path: "/admin/dashboard", label: "Dashboard" },
  profile: {
    path: "/admin/profile",
    label: "Profile",
    api: API.auth.getprofile,
  },
  activityLogs: {
    path: "/admin/activity-logs",
    label: "Activity Logs",
    api: API.activityLogs.adminGet,
  },
  products: {
    list: { path: "/admin/products/allProducts", label: "All Products" },
    create: {
      path: "/admin/products/createProduct",
      label: "Add Product",
      api: API.product.create,
    },
    detail: {
      path: "/admin/products/:slug",
      label: "Product",
      api: API.product.adminBySlug,
    },
  },
  categories: {
    list: { path: "/admin/categories/allCategories", label: "Categories" },
    create: {
      path: "/admin/categories/createCategories",
      label: "Add Category",
      api: API.category.create,
    },
    detail: {
      path: "/admin/categories/:slug",
      label: "Category",
      api: API.category.adminBySlug,
    },
  },
  banners: {
    list: { path: "/admin/banner/allBanner", label: "All Banners" },
    create: {
      path: "/admin/banner/createBanner",
      label: "Add Banner",
      api: API.banner.create,
    },
    detail: {
      path: "/admin/banner/:slug",
      label: "Banner",
      api: API.banner.adminBySlug,
    },
  },
  orders: {
    list: { path: "/admin/orders", label: "Orders", api: API.order.get },
    detail: {
      path: "/admin/orders/:orderNumber",
      label: "Order",
      api: API.order.detail,
    },
  },
  users: {
    list: { path: "/admin/users", label: "Users", api: API.auth.adminUsers },
  },
  reviews: {
    list: {
      path: "/admin/reviews",
      label: "Reviews",
      api: API.review.adminGet,
    },
  },
};

/** Sidebar menu built from admin routes */
export const adminMenuItems = [
  {
    title: "Dashboard",
    subItems: [{ title: "Dashboard", to: adminRoutes.dashboard.path }],
  },
  {
    title: "Activity Logs",
    subItems: [{ title: "Activity Logs", to: adminRoutes.activityLogs.path }],
  },
  {
    title: "Product",
    subItems: [
      { title: "Add Product", to: adminRoutes.products.create.path },
      { title: "All Products", to: adminRoutes.products.list.path },
    ],
  },
  {
    title: "Categories",
    subItems: [
      { title: "Add Categories", to: adminRoutes.categories.create.path },
      { title: "Categories", to: adminRoutes.categories.list.path },
    ],
  },
  {
    title: "Banner",
    subItems: [
      { title: "Add Banner", to: adminRoutes.banners.create.path },
      { title: "All Banner", to: adminRoutes.banners.list.path },
    ],
  },
  {
    title: "Orders",
    subItems: [{ title: "All Orders", to: adminRoutes.orders.list.path }],
  },
  {
    title: "Reviews",
    subItems: [{ title: "All Reviews", to: adminRoutes.reviews.list.path }],
  },
  {
    title: "Users",
    subItems: [{ title: "Manage Users", to: adminRoutes.users.list.path }],
  },
];

/** Public navbar links */
export const publicNavLinks = [
  { label: "Home", href: publicRoutes.home.path },
  { label: "Shop", href: publicRoutes.shop.path },
  { label: "Categories", href: publicRoutes.categories.path },
];

export const accountNavLinks = [
  { label: "My Account", href: authRoutes.profile.path },
  { label: "My Cart", href: `${authRoutes.profile.path}?tab=cart` },
  { label: "My Orders", href: `${authRoutes.profile.path}?tab=orders` },
];

/** Full API URL for server-side fetch (SSR) */
export function apiUrl(routeDef, params = {}, query = {}) {
  const internalBase = process.env.INTERNAL_API_URL ?? "";
  const publicBase = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const base =
    process.platform === "win32" && internalBase.includes("server")
      ? publicBase
      : internalBase || publicBase;
  const path = apiPath(routeDef, params);
  const qs = new URLSearchParams(
    Object.entries(query).filter(([, v]) => v != null && v !== ""),
  ).toString();
  return `${base}${path}${qs ? `?${qs}` : ""}`;
}
