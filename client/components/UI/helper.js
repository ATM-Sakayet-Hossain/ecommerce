export const formatCurrency = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString();

export const formatPrice = (amount) => {
  const value = Number(amount ?? 0);
  return `৳${value.toLocaleString("en-BD")}`;
};

export const getSalePrice = (product) => {
  const price = Number(product?.price ?? 0);
  const discountPrice = Number(product?.discountPrice ?? 0);
  const discountPercentage = Number(product?.discountPercentage ?? 0);
  if (discountPrice > 0 && discountPrice < price) {
    return discountPrice;
  }
  if (discountPercentage > 0) {
    return price - (price * discountPercentage) / 100;
  }
  return price;
};

export const getDiscountLabel = (product) => {
  const discountPercentage = Number(product?.discountPercentage ?? 0);
  const discountPrice = Number(product?.discountPrice ?? 0);
  if (discountPercentage > 0) {
    return `${discountPercentage}%`;
  }
  if (discountPrice > 0) {
    return `${formatPrice(discountPrice)}`;
  }
  return null;
};

export const hasDiscount = (product) =>
  Number(product?.discountPercentage ?? 0) > 0 ||
  Number(product?.discountPrice ?? 0) > 0;

export const getTotalStock = (variants) => {
  if (!Array.isArray(variants)) {
    return 0;
  }
  return variants.reduce((sum, variant) => sum + Number(variant?.stock ?? 0), 0);
};

export const isInStock = (variants) => getTotalStock(variants) > 0;

export const getProductRating = (product) =>
  product?.ratings?.average ?? product?.rating ?? 0;

export const formatVariantSize = (size) =>
  size ? String(size).toUpperCase() : "";

export const enrichOrderItemsClient = (order) => {
  if (!order?.items?.length) return order?.items ?? [];
  const productMap = new Map(
    (order.productDocs ?? []).map((p) => [String(p._id), p]),
  );
  return order.items.map((item) => {
    const productId = item.product?._id ?? item.product;
    const product = productMap.get(String(productId));
    const variant = product?.variants?.find((v) => v.sku === item.sku);
    return {
      ...item,
      productTitle: item.productTitle || product?.title,
      productSlug: item.productSlug || product?.slug,
      productThumbnail: item.productThumbnail || product?.thumbnail,
      size: item.size || variant?.size,
    };
  });
};

export const getCategoryName = (category) => {
  if (!category) {
    return "";
  }
  if (typeof category === "string") {
    return category;
  }
  return category?.name ?? "";
};
