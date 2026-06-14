import { apiPath } from "./routes";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

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
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  const config = {
    method,
    headers: isFormData
      ? { ...headers }
      : {
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
    config.body = isFormData ? body : JSON.stringify(body);
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
    const message =
      error instanceof TypeError && error.message === "Failed to fetch"
        ? "Unable to reach the API server. Ensure the backend is running and NEXT_PUBLIC_BASE_URL is set correctly."
        : error instanceof Error
          ? error.message
          : "API request failed";
    throw new Error(message);
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

  /** Call using route definition from lib/routes.js */
  fromRoute(routeDef, { params = {}, body, query, ...options } = {}) {
    let path = apiPath(routeDef, params);
    if (query && Object.keys(query).length) {
      const qs = new URLSearchParams(
        Object.entries(query).filter(([, v]) => v != null && v !== ""),
      ).toString();
      if (qs) path += `?${qs}`;
    }
    const method = routeDef?.method || "GET";
    if (method === "GET") return request(path, { ...options, method });
    if (method === "DELETE") return request(path, { ...options, method });
    return request(path, { ...options, method, body });
  },
};
