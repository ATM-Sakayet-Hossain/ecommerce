const now = new Date();

export const banners = [
  {
    id: "banner-hero-1",
    title: "Spring layers for every route",
    subtitle:
      "Fresh drops, smart bundles, and fast shipping for the season ahead.",
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1600&q=80",
    startDate: new Date("2026-03-20T00:00:00Z"),
    endDate: new Date("2026-05-31T23:59:59Z"),
  },
  {
    id: "banner-hero-2",
    title: "Tech that moves with you",
    subtitle: "New audio, wearables, and travel gear with launch-week pricing.",
    image:
      "https://images.unsplash.com/photo-1518441314215-6a6c7a3f4f9d?auto=format&fit=crop&w=1600&q=80",
    startDate: new Date("2026-04-01T00:00:00Z"),
    endDate: new Date("2026-04-30T23:59:59Z"),
  },
  {
    id: "banner-expired",
    title: "This banner is expired",
    subtitle: "It stays in the data set to prove the scheduling filter works.",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80",
    startDate: new Date("2025-12-01T00:00:00Z"),
    endDate: new Date("2026-01-15T23:59:59Z"),
  },
  {
    id: "banner-future",
    title: "Future launch drop",
    subtitle: "Scheduled content stays hidden until the start window opens.",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1600&q=80",
    startDate: new Date("2026-06-10T00:00:00Z"),
    endDate: new Date("2026-07-15T23:59:59Z"),
  },
];

export const categories = [
  {
    name: "Fashion",
    slug: "fashion",
    thumbnail:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
    parent: null,
    sortOrder: 1,
  },
  {
    name: "Women",
    slug: "women",
    thumbnail:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    parent: "null",
    sortOrder: 1,
  },
  {
    name: "Men",
    slug: "men",
    thumbnail:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    parent: "null",
    sortOrder: 2,
  },
  {
    name: "Dresses",
    slug: "dresses",
    thumbnail:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
    parent: "null",
    sortOrder: 1,
  },
  {
    name: "Activewear",
    slug: "activewear",
    thumbnail:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    parent: "null",
    sortOrder: 2,
  },
  {
    name: "Shirts",
    slug: "shirts",
    thumbnail:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80",
    parent: "men",
    sortOrder: 1,
  },
  {
    name: "Sneakers",
    slug: "sneakers",
    thumbnail:
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1200&q=80",
    parent: "men",
    sortOrder: 2,
  },
  {
    name: "Electronics",
    slug: "electronics",
    thumbnail:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80",
    parent: null,
    sortOrder: 2,
  },
  {
    name: "Audio",
    slug: "audio",
    thumbnail:
      "https://images.unsplash.com/photo-1518441314215-6a6c7a3f4f9d?auto=format&fit=crop&w=1200&q=80",
    parent: "electronics",
    sortOrder: 1,
  },
  {
    name: "Wearables",
    slug: "wearables",
    thumbnail:
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1200&q=80",
    parent: "electronics",
    sortOrder: 2,
  },
  {
    name: "Home",
    slug: "home",
    thumbnail:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    parent: null,
    sortOrder: 3,
  },
  {
    name: "Kitchen",
    slug: "kitchen",
    thumbnail:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
    parent: "home",
    sortOrder: 1,
  },
  {
    name: "Decor",
    slug: "decor",
    thumbnail:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    parent: "home",
    sortOrder: 2,
  },
  {
    name: "Beauty",
    slug: "beauty",
    thumbnail:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
    parent: null,
    sortOrder: 4,
  },
  {
    name: "Sports",
    slug: "sports",
    thumbnail:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
    parent: null,
    sortOrder: 5,
  },
  {
    name: "Gifts",
    slug: "gifts",
    thumbnail:
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1200&q=80",
    parent: null,
    sortOrder: 6,
  },
];

export const products = [
  {
    id: "product-airloom-shirt",
    name: "Airloom Linen Shirt",
    slug: "airloom-linen-shirt",
    sku: "FSH-101",
    categorySlug: "shirts",
    brand: "Northwind",
    price: 118,
    rating: 4.8,
    tags: ["linen", "new-season", "smart-casual"],
    stock: 18,
    createdAt: new Date("2026-04-05T10:00:00Z"),
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80",
    description: "Clean tailoring with breathable fabric for everyday wear.",
  },
  {
    id: "product-runner",
    name: "Metro Runner Sneaker",
    slug: "metro-runner-sneaker",
    sku: "FSH-205",
    categorySlug: "sneakers",
    brand: "Northwind",
    price: 142,
    rating: 4.6,
    tags: ["comfort", "travel", "street"],
    stock: 6,
    createdAt: new Date("2026-03-31T09:00:00Z"),
    image:
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1200&q=80",
    description: "All-day cushioning with a clean silhouette.",
  },
  {
    id: "product-dress",
    name: "Bloom Line Dress",
    slug: "bloom-line-dress",
    sku: "FSH-309",
    categorySlug: "dresses",
    brand: "Atelier Zero",
    price: 138,
    rating: 4.9,
    tags: ["occasion", "soft", "premium"],
    stock: 11,
    createdAt: new Date("2026-04-08T14:00:00Z"),
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
    description: "Structured drape with a light, polished finish.",
  },
  {
    id: "product-hoodie",
    name: "Motion Layer Hoodie",
    slug: "motion-layer-hoodie",
    sku: "FSH-411",
    categorySlug: "activewear",
    brand: "Atlas",
    price: 96,
    rating: 4.5,
    tags: ["training", "layering", "lightweight"],
    stock: 0,
    createdAt: new Date("2026-04-02T12:00:00Z"),
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    description: "Warm, flexible layering for training and transit.",
  },
  {
    id: "product-headphones",
    name: "Echo Pod Pro",
    slug: "echo-pod-pro",
    sku: "ELC-501",
    categorySlug: "audio",
    brand: "Pulse Lab",
    price: 199,
    rating: 4.9,
    tags: ["wireless", "anc", "premium"],
    stock: 9,
    createdAt: new Date("2026-04-10T08:00:00Z"),
    image:
      "https://images.unsplash.com/photo-1518441314215-6a6c7a3f4f9d?auto=format&fit=crop&w=1200&q=80",
    description: "Focused sound with active noise cancellation.",
  },
  {
    id: "product-watch",
    name: "Pulse Loop Watch",
    slug: "pulse-loop-watch",
    sku: "ELC-612",
    categorySlug: "wearables",
    brand: "Pulse Lab",
    price: 229,
    rating: 4.7,
    tags: ["health", "fitness", "battery"],
    stock: 14,
    createdAt: new Date("2026-03-28T15:00:00Z"),
    image:
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1200&q=80",
    description: "Quick-glance health tracking and long battery life.",
  },
  {
    id: "product-kitchen",
    name: "Slate Ceramic Set",
    slug: "slate-ceramic-set",
    sku: "HME-701",
    categorySlug: "kitchen",
    brand: "Homeform",
    price: 88,
    rating: 4.4,
    tags: ["dinnerware", "modern", "giftable"],
    stock: 25,
    createdAt: new Date("2026-04-06T11:30:00Z"),
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
    description: "Durable tableware with a matte finish.",
  },
  {
    id: "product-decor",
    name: "Aura Table Lamp",
    slug: "aura-table-lamp",
    sku: "HME-722",
    categorySlug: "decor",
    brand: "Homeform",
    price: 76,
    rating: 4.3,
    tags: ["lighting", "ambient", "minimal"],
    stock: 15,
    createdAt: new Date("2026-04-03T16:20:00Z"),
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    description: "Soft ambient light with a clean footprint.",
  },
  {
    id: "product-serum",
    name: "Glow Reset Serum",
    slug: "glow-reset-serum",
    sku: "BTY-801",
    categorySlug: "beauty",
    brand: "Kindform",
    price: 64,
    rating: 4.5,
    tags: ["hydration", "skin-care", "daily"],
    stock: 30,
    createdAt: new Date("2026-04-09T07:45:00Z"),
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
    description: "Lightweight serum with a simple routine-first formula.",
  },
  {
    id: "product-gift",
    name: "Gift Box Edit",
    slug: "gift-box-edit",
    sku: "GFT-901",
    categorySlug: "gifts",
    brand: "SakkhorMart",
    price: 54,
    rating: 4.2,
    tags: ["curated", "seasonal", "ready-to-ship"],
    stock: 50,
    createdAt: new Date("2026-04-11T13:10:00Z"),
    image:
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1200&q=80",
    description: "Curated essentials packed for gifting.",
  },
];

export const currentUser = {
  id: "user-001",
  name: "A. H. Sakayet",
  email: "sakayet@example.com",
  phone: "+880 17 0000 0000",
  avatar: "AH",
  membership: "Gold",
};

export const savedAddresses = [
  {
    id: "address-home",
    label: "Home",
    name: "A. H. Sakayet",
    line1: "12 Lake Road",
    line2: "Dhanmondi, Dhaka 1209",
    phone: "+880 17 0000 0000",
    default: true,
  },
  {
    id: "address-office",
    label: "Office",
    name: "A. H. Sakayet",
    line1: "45 Tech Park Avenue",
    line2: "Banani, Dhaka 1213",
    phone: "+880 17 1111 1111",
    default: false,
  },
];

export const orders = [
  {
    id: "order-1001",
    orderNumber: "SM-10481",
    createdAt: new Date("2026-04-12T10:25:00Z"),
    paymentStatus: "paid",
    orderStatus: "shipped",
    totalAmount: 457,
    user: currentUser,
    items: [
      {
        product: {
          name: "Echo Pod Pro",
          slug: "echo-pod-pro",
          sku: "ELC-501",
          image:
            "https://images.unsplash.com/photo-1518441314215-6a6c7a3f4f9d?auto=format&fit=crop&w=1200&q=80",
        },
        sku: "ELC-501",
        quantity: 1,
        subtotal: 199,
      },
      {
        product: {
          name: "Slate Ceramic Set",
          slug: "slate-ceramic-set",
          sku: "HME-701",
          image:
            "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
        },
        sku: "HME-701",
        quantity: 1,
        subtotal: 88,
      },
      {
        product: {
          name: "Gift Box Edit",
          slug: "gift-box-edit",
          sku: "GFT-901",
          image:
            "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1200&q=80",
        },
        sku: "GFT-901",
        quantity: 1,
        subtotal: 54,
      },
    ],
  },
  {
    id: "order-1002",
    orderNumber: "SM-10442",
    createdAt: new Date("2026-03-29T08:40:00Z"),
    paymentStatus: "paid",
    orderStatus: "delivered",
    totalAmount: 246,
    user: currentUser,
    items: [
      {
        product: {
          name: "Airloom Linen Shirt",
          slug: "airloom-linen-shirt",
          sku: "FSH-101",
          image:
            "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80",
        },
        sku: "FSH-101",
        quantity: 1,
        subtotal: 118,
      },
      {
        product: {
          name: "Aura Table Lamp",
          slug: "aura-table-lamp",
          sku: "HME-722",
          image:
            "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
        },
        sku: "HME-722",
        quantity: 1,
        subtotal: 76,
      },
    ],
  },
];

export const reviews = [
  {
    id: "review-1",
    user: currentUser,
    productSlug: "echo-pod-pro",
    rating: 5,
    comment: "Great sound, fast shipping, and the packaging felt premium.",
    images: [
      "https://images.unsplash.com/photo-1518441314215-6a6c7a3f4f9d?auto=format&fit=crop&w=800&q=80",
    ],
    verifiedPurchase: true,
    editable: true,
    createdAt: new Date("2026-04-13T14:00:00Z"),
  },
  {
    id: "review-2",
    user: { name: "M. Rahman", avatar: "MR" },
    productSlug: "airloom-linen-shirt",
    rating: 4,
    comment: "Breathable fabric and the fit is true to size.",
    images: [],
    verifiedPurchase: true,
    editable: false,
    createdAt: new Date("2026-04-10T09:30:00Z"),
  },
  {
    id: "review-3",
    user: { name: "N. Islam", avatar: "NI" },
    productSlug: "bloom-line-dress",
    rating: 5,
    comment: "Exactly what I needed for a formal dinner.",
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
    ],
    verifiedPurchase: true,
    editable: false,
    createdAt: new Date("2026-04-09T13:10:00Z"),
  },
];

const categoryMap = new Map(
  categories.map((category) => [category.slug, category]),
);

const categoryChildrenMap = categories.reduce((map, category) => {
  const children = map.get(category.parent) ?? [];
  children.push(category);
  map.set(category.parent, children);
  return map;
}, new Map());

const productMap = new Map(products.map((product) => [product.slug, product]));
const productSkuMap = new Map(
  products.map((product) => [product.sku, product]),
);

function sortByOrderAndName(items = []) {
  return [...items].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return left.name.localeCompare(right.name);
  });
}

export function getActiveBanners(referenceDate = now) {
  return banners
    .filter((banner) => {
      const started = !banner.startDate || banner.startDate <= referenceDate;
      const notExpired = !banner.endDate || banner.endDate >= referenceDate;
      return started && notExpired;
    })
    .sort(
      (left, right) =>
        (left.startDate?.getTime() ?? 0) - (right.startDate?.getTime() ?? 0),
    );
}

export function buildCategoryTree() {
  const nodeMap = new Map(
    categories.map((category) => [
      category.slug,
      { ...category, children: [], count: 0 },
    ]),
  );

  const roots = [];

  sortByOrderAndName(categories).forEach((category) => {
    const node = nodeMap.get(category.slug);
    const parentNode = category.parent ? nodeMap.get(category.parent) : null;

    if (parentNode) {
      parentNode.children.push(node);
    } else {
      roots.push(node);
    }
  });

  const directCounts = new Map();

  products.forEach((product) => {
    directCounts.set(
      product.categorySlug,
      (directCounts.get(product.categorySlug) ?? 0) + 1,
    );
  });

  const rollUpCounts = (node) => {
    let count = directCounts.get(node.slug) ?? 0;

    node.children.sort((left, right) => {
      if (left.sortOrder !== right.sortOrder) {
        return left.sortOrder - right.sortOrder;
      }

      return left.name.localeCompare(right.name);
    });

    node.children.forEach((child) => {
      count += rollUpCounts(child);
    });

    node.count = count;
    return count;
  };

  roots.sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return left.name.localeCompare(right.name);
  });

  roots.forEach(rollUpCounts);
  return roots;
}

export function getCategoryBySlug(slug) {
  return categoryMap.get(slug) ?? null;
}

export function getCategoryPath(slug) {
  const trail = [];
  let current = categoryMap.get(slug) ?? null;

  while (current) {
    trail.unshift(current);
    current = current.parent ? (categoryMap.get(current.parent) ?? null) : null;
  }

  return trail;
}

export function getCategoryDescendantSlugs(slug) {
  const branch = [];
  const stack = [slug];

  while (stack.length) {
    const current = stack.pop();
    if (!current) {
      continue;
    }

    branch.push(current);
    const children = categoryChildrenMap.get(current) ?? [];
    children.forEach((child) => stack.push(child.slug));
  }

  return branch;
}

export function getCategoryProductCount(slug) {
  const descendantSlugs = new Set(getCategoryDescendantSlugs(slug));

  return products.filter((product) => descendantSlugs.has(product.categorySlug))
    .length;
}

export function getFeaturedCategories(limit = 6) {
  return sortByOrderAndName(categories)
    .map((category) => ({
      ...category,
      count: getCategoryProductCount(category.slug),
    }))
    .slice(0, limit);
}

export function getBrands() {
  return [...new Set(products.map((product) => product.brand))].sort(
    (left, right) => left.localeCompare(right),
  );
}

export function getTags() {
  return [...new Set(products.flatMap((product) => product.tags))].sort(
    (left, right) => left.localeCompare(right),
  );
}

export function getPriceRange(items = products) {
  const prices = items.map((product) => product.price);

  return {
    min: prices.length ? Math.min(...prices) : 0,
    max: prices.length ? Math.max(...prices) : 0,
  };
}

export function getReviewSummary(items = reviews) {
  const totalRating = items.reduce((sum, review) => sum + review.rating, 0);

  return {
    count: items.length,
    average: items.length ? Number((totalRating / items.length).toFixed(1)) : 0,
    images: items.reduce((sum, review) => sum + review.images.length, 0),
  };
}

function normalizeQueryValue(value) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function parseShopFilters(searchParams = {}) {
  return {
    query: normalizeQueryValue(searchParams.query ?? searchParams.q),
    category: normalizeQueryValue(searchParams.category),
    brand: normalizeQueryValue(searchParams.brand),
    minPrice: normalizeQueryValue(searchParams.minPrice),
    maxPrice: normalizeQueryValue(searchParams.maxPrice),
    rating: normalizeQueryValue(searchParams.rating),
    tags: normalizeQueryValue(searchParams.tags),
    inStock: normalizeQueryValue(searchParams.inStock),
    sort: normalizeQueryValue(searchParams.sort) || "newest",
    cursor: normalizeQueryValue(searchParams.cursor),
    page: normalizeQueryValue(searchParams.page) || "1",
    limit: normalizeQueryValue(searchParams.limit) || "6",
  };
}

export function filterProducts(items = products, filters = {}) {
  const normalizedQuery = (filters.query ?? "").trim().toLowerCase();
  const categorySlug = (filters.category ?? "").trim();
  const brand = (filters.brand ?? "").trim().toLowerCase();
  const minPrice = toNumber(filters.minPrice, 0);
  const maxPrice = toNumber(filters.maxPrice, Number.POSITIVE_INFINITY);
  const ratingThreshold = toNumber(filters.rating, 0);
  const requestedTags = (filters.tags ?? "")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
  const onlyInStock = ["1", "true", "yes", "on"].includes(
    String(filters.inStock).toLowerCase(),
  );

  const allowedCategories =
    categorySlug && categoryMap.has(categorySlug)
      ? new Set(getCategoryDescendantSlugs(categorySlug))
      : null;

  return items.filter((product) => {
    const matchesQuery =
      !normalizedQuery ||
      [product.name, product.brand, product.description, ...product.tags]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

    const matchesCategory =
      !allowedCategories || allowedCategories.has(product.categorySlug);
    const matchesBrand = !brand || product.brand.toLowerCase() === brand;
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
    const matchesRating = product.rating >= ratingThreshold;
    const matchesTags =
      !requestedTags.length ||
      requestedTags.some((tag) => product.tags.includes(tag));
    const matchesStock = !onlyInStock || product.stock > 0;

    return (
      matchesQuery &&
      matchesCategory &&
      matchesBrand &&
      matchesPrice &&
      matchesRating &&
      matchesTags &&
      matchesStock
    );
  });
}

export function sortProducts(items = products, sort = "newest") {
  const sorted = [...items];

  switch (sort) {
    case "price_asc":
      return sorted.sort((left, right) => left.price - right.price);
    case "price_desc":
      return sorted.sort((left, right) => right.price - left.price);
    case "rating":
      return sorted.sort(
        (left, right) =>
          right.rating - left.rating || right.createdAt - left.createdAt,
      );
    case "newest":
    default:
      return sorted.sort((left, right) => right.createdAt - left.createdAt);
  }
}

export function paginateProducts(
  items = products,
  { cursor, page = 1, limit = 6 } = {},
) {
  const safeLimit = Math.max(1, toNumber(limit, 6));
  const normalizedPage = Math.max(1, toNumber(page, 1));
  let startIndex = 0;

  if (cursor) {
    const cursorIndex = items.findIndex(
      (item) =>
        item.id === cursor || item.slug === cursor || item.sku === cursor,
    );

    startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
  } else if (normalizedPage > 1) {
    startIndex = (normalizedPage - 1) * safeLimit;
  }

  const pageItems = items.slice(startIndex, startIndex + safeLimit);
  const previousIndex = Math.max(0, startIndex - safeLimit);

  return {
    pageItems,
    totalCount: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / safeLimit)),
    currentPage: Math.max(1, Math.floor(startIndex / safeLimit) + 1),
    hasNextPage: startIndex + safeLimit < items.length,
    hasPreviousPage: startIndex > 0,
    nextCursor: pageItems.length ? pageItems[pageItems.length - 1].id : null,
    previousCursor: items[previousIndex]?.id ?? null,
    safeLimit,
  };
}

export function findProductBySku(sku) {
  return productSkuMap.get(sku) ?? null;
}

export function findProductBySlug(slug) {
  return productMap.get(slug) ?? null;
}

export function getOrderStatusSteps(status) {
  const steps = ["pending", "paid", "shipped", "delivered", "cancelled"];
  return steps.map((step) => ({
    step,
    active: step === status,
    done: steps.indexOf(step) <= steps.indexOf(status),
  }));
}

export function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function cloneCartItem(item, product = null) {
  const source = product ?? findProductBySku(item.sku) ?? item.product ?? null;
  const unitPrice =
    product?.price ??
    item.unitPrice ??
    item.subtotal / Math.max(1, item.quantity);

  return {
    product: source
      ? {
          id: source.id,
          name: source.name,
          slug: source.slug,
          sku: source.sku,
          image: source.image,
          price: source.price,
          stock: source.stock,
        }
      : item.product,
    sku: item.sku,
    quantity: item.quantity,
    unitPrice,
    subtotal: Math.round(unitPrice * item.quantity),
  };
}

export function getDefaultCart() {
  return [
    cloneCartItem({
      product: findProductBySku("ELC-501"),
      sku: "ELC-501",
      quantity: 1,
      subtotal: 199,
    }),
    cloneCartItem({
      product: findProductBySku("FSH-101"),
      sku: "FSH-101",
      quantity: 2,
      subtotal: 236,
    }),
  ];
}

export function createOrderSnapshot(cartItems, user = currentUser) {
  const items = cartItems.map((item) =>
    cloneCartItem(item, findProductBySku(item.sku)),
  );
  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

  return {
    id: `order-${Date.now()}`,
    items,
    totalAmount,
    paymentStatus: "pending",
    orderStatus: "pending",
    user,
  };
}

export const shopHighlightMetrics = [
  {
    label: "Active banners",
    value: getActiveBanners().length.toString().padStart(2, "0"),
  },
  {
    label: "Category nodes",
    value: categories.length.toString().padStart(2, "0"),
  },
  {
    label: "Live reviews",
    value: getReviewSummary().count.toString().padStart(2, "0"),
  },
];
