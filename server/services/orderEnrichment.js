const getVariantFromProduct = (product, sku) => {
  if (!product?.variants?.length || !sku) return null;
  return product.variants.find((v) => v.sku === sku) || null;
};

const buildProductMap = (productDocs = []) =>
  new Map(productDocs.map((p) => [String(p._id), p]));

const enrichOrderItems = (order) => {
  if (!order) return order;
  const productMap = buildProductMap(order.productDocs || []);
  const items = (order.items || []).map((item) => {
    const productId = item.product?._id ?? item.product;
    const product = productMap.get(String(productId));
    const variant = getVariantFromProduct(product, item.sku);
    return {
      ...item,
      product: product
        ? {
            _id: product._id,
            title: product.title,
            slug: product.slug,
            thumbnail: product.thumbnail,
          }
        : item.product,
      productTitle: product?.title,
      productSlug: product?.slug,
      productThumbnail: product?.thumbnail,
      size: variant?.size,
      color: variant?.color,
    };
  });
  const { productDocs, ...rest } = order;
  return { ...rest, items };
};

module.exports = {
  enrichOrderItems,
  getVariantFromProduct,
};
