const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL;

async function request(
  endpoint,
  {
    method = "GET",
    body,
    headers = {},
    revalidate, // ISR seconds
    tags = [], // cache tags for revalidation
  } = {},
) {
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
    next: {},
  };
  // ISR config
  if (typeof revalidate === "number") {
    config.next.revalidate = revalidate;
  }
  // Tag-based caching (Next 13+)
  if (tags.length > 0) {
    config.next.tags = tags;
  }
  if (body) {
    config.body = JSON.stringify(body);
  }
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);
    let data;
    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }
    if (!res.ok) {
      throw new Error(data?.message || "API request failed");
    }
    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
}
// REST helpers
export const apiClient = {
  get: (url, options = {}) => request(url, { ...options, method: "GET" }),

  post: (url, body, options = {}) =>
    request(url, { ...options, method: "POST", body }),

  put: (url, body, options = {}) =>
    request(url, { ...options, method: "PUT", body }),

  patch: (url, body, options = {}) =>
    request(url, { ...options, method: "PATCH", body }),

  delete: (url, options = {}) => request(url, { ...options, method: "DELETE" }),
};