const cartSchema = require("../models/cartSchema");
const productSchema = require("../models/productSchema");
const { responseHandlerSuccess, responseHandler } = require("../Utils/responseHandler");

const addToCart = async (req, res) => {
  try {
    const { productId, sku, quantity } = req.body;

    if (!productId || !sku || !quantity)
      return responseHandler(res, "Invalid request.");

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
        return responseHandler(res, "Product already exist in cart");

      existingCart.items.push({
        product: productId,
        sku,
        quantity,
        subtotal,
      });
      existingCart.save();
      return responseHandlerSuccess(res, "Product added to cart.", 201);
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

      responseHandlerSuccess(res, "Product added to cart.", 201);
    }
  } catch (error) {
    console.log(error);
  }
};
const getCart = async (req, res) => {
  try {
    const cart = await cartSchema
      .findOne({ user: req.user._id })
      .populate("items.product");
    if (!cart)
      return responseHandlerSuccess(res,  "Cart empty", { items: [] });
    return responseHandlerSuccess(res,  "Cart fetched", cart);
  } catch (error) {
    console.log(error);
    responseHandler(res, "Server Error");
  }
};
const updateCartItem = async (req, res) => {
  try {
    const { sku, quantity } = req.body;

    const cart = await cartSchema.findOne({ user: req.user._id });

    if (!cart)
      return responseHandler(res,  "Cart not found");

    const item = cart.items.find((p) => p.sku === sku);

    if (!item)
      return responseHandler(res,  "Item not found");

    const product = await productSchema.findById(item.product);

    const discountAmount =
      (product.price * product.discountPercentage) / 100;

    const discountedPrice = product.price - discountAmount;

    item.quantity = quantity;
    item.subtotal = discountedPrice * quantity;

    await cart.save();

    return responseHandlerSuccess(res,  "Cart updated", cart);
  } catch (error) {
    console.log(error);
    responseHandler(res, "Server Error");
  }
};

const removeCartItem = async (req, res) => {
  try {
    const { sku } = req.params;

    const cart = await cartSchema.findOne({ user: req.user._id });

    if (!cart)
      return responseHandler(res,  "Cart not found");

    cart.items = cart.items.filter((item) => item.sku !== sku);

    await cart.save();

    return responseHandlerSuccess(res,  "Item removed", cart);
  } catch (error) {
    console.log(error);
    responseHandler(res, "Server Error");
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await cartSchema.findOne({ user: req.user._id });

    if (!cart)
      return responseHandler(res,  "Cart not found");

    cart.items = [];

    await cart.save();

    return responseHandlerSuccess(res,  "Cart cleared");
  } catch (error) {
    console.log(error);
    responseHandler(res, "Server Error");
  }
};

module.exports = { addToCart, getCart, updateCartItem, removeCartItem, clearCart };
