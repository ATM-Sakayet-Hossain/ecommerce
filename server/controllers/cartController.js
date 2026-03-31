const cartSchema = require("../models/cartSchema");
const productSchema = require("../models/productSchema");
const { responseHandler } = require("../Utils/responseHandler");

const addToCart = async (req, res) => {
  try {
    const { productId, sku, quantity } = req.body;
    if (!productId || !sku || !quantity)
      return responseHandler.error(res, 400, "Invalid request.");
    const productData = await productSchema.findById(productId);
    const discountAmount =
      (productData.price * productData.discountPercentage) / 100;
    const discountedPrice = productData.price - discountAmount;
    const subtotal = discountedPrice * quantity;
    const existingCart = await cartSchema.findOne({ user: req.user._id });
    if (existingCart) {
      const alreadyExists = existingCart.items.some(
        (pItem) => pItem.sku === sku,
      );
      if (alreadyExists)
        return responseHandler.error(res, 400, "Product already exist in cart");
      existingCart.items.push({
        product: productId,
        sku,
        quantity,
        subtotal,
      });
      existingCart.save();
      return responseHandler.success(res, 201, existingCart, "Product added to cart.");
    } else {
      await cartSchema.create({
        user: req.user._id,
        items: [
          {
            product: productId,
            sku,
            quantity,
            subtotal,
          },
        ],
      });
      responseHandler.success(res, 200, existingCart, "Product added to cart.");
    }
  } catch (error) {
    responseHandler.error(res, 500, "Something went wrong. Please try again later");
  }
};
const getCart = async (req, res) => {
  try {
    const cart = await cartSchema
      .findOne({ user: req.user._id })
      .populate("items.product");
    if (!cart)
      return responseHandler.error(res, 400, "Cart empty");
    return responseHandler.success(res, 200, cart, "Cart fetched");
  } catch (error) {
    responseHandler.error(res, 500, "Something went wrong. Please try again later");
  }
};
const updateCartItem = async (req, res) => {
  try {
    const { sku, quantity } = req.body;

    const cart = await cartSchema.findOne({ user: req.user._id });

    if (!cart)
      return responseHandler.error(res, 400,  "Cart not found");

    const item = cart.items.find((p) => p.sku === sku);

    if (!item)
      return responseHandler.error(res, 400,  "Item not found");

    const product = await productSchema.findById(item.product);

    const discountAmount =
      (product.price * product.discountPercentage) / 100;

    const discountedPrice = product.price - discountAmount;

    item.quantity = quantity;
    item.subtotal = discountedPrice * quantity;

    await cart.save();

    return responseHandler.success(res, 200, cart, "Cart updated");
  } catch (error) {
    responseHandler.error(res, 500, "Something went wrong. Please try again later");
  }
};

const removeCartItem = async (req, res) => {
  try {
    const { sku } = req.params;

    const cart = await cartSchema.findOne({ user: req.user._id });

    if (!cart)
      return responseHandler.error(res, 400,  "Cart not found");

    cart.items = cart.items.filter((item) => item.sku !== sku);

    await cart.save();

    return responseHandler.success(res, 200, cart, "Item removed");
  } catch (error) {
    responseHandler.error(res, 500, "Something went wrong. Please try again later");
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await cartSchema.findOne({ user: req.user._id });

    if (!cart)
      return responseHandler.error(res, 400,  "Cart not found");

    cart.items = [];

    await cart.save();

    return responseHandler.success(res, 200, cart, "Cart cleared");
  } catch (error) {
    responseHandler.error(res, 500, "Something went wrong. Please try again later");
  }
};

module.exports = { addToCart, getCart, updateCartItem, removeCartItem, clearCart };
