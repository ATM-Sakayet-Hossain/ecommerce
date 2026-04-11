import { cookies } from "next/headers";

const API_BASE_URL = (
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:1993"
).replace(/\/$/, "");

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
};

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  const access = cookieStore.get("X-AS-Token")?.value;
  const refresh = cookieStore.get("X-RF-Token")?.value;
  const segments = [];
  if (access) segments.push(`X-AS-Token=${access}`);
  if (refresh) segments.push(`X-RF-Token=${refresh}`);
  return segments.length ? { Cookie: segments.join("; ") } : {};
};

const readData = (payload, candidates = []) => {
  const root = payload?.data;
  for (const key of candidates) {
    if (root?.[key] !== undefined) return root[key];
  }
  if (root !== undefined) return root;
  return payload;
};

const fetchJson = async (path, { auth = false } = {}) => {
  try {
    const headers = auth ? await getCookieHeader() : {};
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers,
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

export const getOrdersData = async () => {
  const payload = await fetchJson("/get?page=1&limit=50", { auth: true });
  const order = readData(payload, ["order"]);
  return Array.isArray(order) ? order : [];
};

export const getPaymentsData = async () => {
  const orders = await getOrdersData();
  return orders.map((item) => ({
    id:
      item?.payment?.paymentId ||
      item?.orderNumber ||
      String(item?._id || "N/A"),
    gateway: item?.payment?.method || "N/A",
    amount: formatCurrency(item?.totalPrice),
    status: item?.payment?.status || "pending",
    date: formatDate(item?.createdAt),
    orderNumber: item?.orderNumber || "N/A",
    customer: item?.user?.name || item?.user?.email || "Unknown",
  }));
};

export const getUsersData = async () => {
  const payload = await fetchJson("/auth/admin/users?page=1&limit=100", {
    auth: true,
  });
  const users = readData(payload, ["allUser"]);
  return Array.isArray(users) ? users : [];
};

export const getBannersData = async () => {
  let payload = await fetchJson("/banner/admin/get?page=1&limit=50", {
    auth: true,
  });
  if (!payload) {
    payload = await fetchJson("/banner/get?page=1&limit=50");
  }
  const banners = readData(payload, ["banners"]);
  return Array.isArray(banners) ? banners : [];
};

export const getReviewsData = async () => {
  let payload = await fetchJson("/product/admin/get?page=1&limit=50", {
    auth: true,
  });
  if (!payload) {
    payload = await fetchJson("/product/get?page=1&limit=50");
  }
  const products = readData(payload, ["product"]);
  const safeProducts = Array.isArray(products) ? products : [];
  const reviews = [];

  for (const product of safeProducts) {
    const list = Array.isArray(product?.reviews) ? product.reviews : [];
    for (const review of list) {
      reviews.push({
        id: String(
          review?._id || `${product?.slug || "product"}-${reviews.length + 1}`,
        ),
        product: product?.title || "Unknown Product",
        amount: `${Number(review?.rating || 0).toFixed(1)} / 5`,
        status: review?.isApproved ? "active" : "pending",
        date: formatDate(review?.createdAt),
        reviewer: String(review?.user || "N/A"),
        comment: review?.comment || "No comment",
        moderation: review?.isApproved ? "Approved" : "Pending",
      });
    }
  }

  return reviews;
};

export const getAccountsData = async () => {
  const orders = await getOrdersData();
  const paid = orders.filter((o) => o?.payment?.status === "paid");
  const pending = orders.filter((o) => o?.payment?.status === "pending");
  const failed = orders.filter((o) => o?.payment?.status === "failed");

  const sum = (items) =>
    items.reduce((total, item) => total + Number(item?.totalPrice || 0), 0);

  return [
    {
      id: "acc-paid",
      name: "Collected Revenue",
      amount: formatCurrency(sum(paid)),
      status: "active",
      date: formatDate(new Date().toISOString()),
      ledgerType: "Revenue",
      provider: "Order Payments",
      currency: "USD",
      note: `Based on ${paid.length} paid orders`,
    },
    {
      id: "acc-pending",
      name: "Pending Clearance",
      amount: formatCurrency(sum(pending)),
      status: "pending",
      date: formatDate(new Date().toISOString()),
      ledgerType: "Receivable",
      provider: "Order Payments",
      currency: "USD",
      note: `Based on ${pending.length} pending payments`,
    },
    {
      id: "acc-failed",
      name: "Failed Payments",
      amount: formatCurrency(sum(failed)),
      status: "failed",
      date: formatDate(new Date().toISOString()),
      ledgerType: "Recovery",
      provider: "Order Payments",
      currency: "USD",
      note: `Based on ${failed.length} failed payments`,
    },
  ];
};

export const helpers = {
  API_BASE_URL,
  formatCurrency,
  formatDate,
};
