const { default: mongoose } = require("mongoose");
const cartSchema = require("../models/cartSchema");
const productSchema = require("../models/productSchema");
const { responseHandler } = require("../Utils/responseHandler");

const addToCart = async (req, res) => {
  try {
    const { productId, sku, quantity } = req.body;
    if (!productId) return responseHandler.error(res, 400, "Invalid request.");
    if (!sku) return responseHandler.error(res, 400, "Invalid request.");
    if (!quantity)
      return responseHandler.error(res, 400, "Product Quantity is Missing");
    const productData = await productSchema.findById(productId);
    if (!productData)
      return responseHandler.error(res, 404, "Product not found");
    const variant = productData.variants.find((v) => v.sku === sku);
    if (!variant) return responseHandler.error(res, 404, "Invalid request.");
    if (variant.stock < quantity)
      return responseHandler.error(res, 400, "Insufficient stock");
    const discountAmount =
      (productData.price * productData.discountPercentage) / 100;
    const discountedPrice = productData.price - discountAmount;
    const subtotal = discountedPrice * quantity;
    const existingCart = await cartSchema.findOne({ user: req.user._id });
    if (existingCart) {
      const existingItem = existingCart.items.find((Item) => Item.sku === sku);
      if (existingItem)
        return responseHandler.error(res, 400, "Product already exist in cart");
      existingCart.items.push({
        product: productId,
        sku,
        quantity,
        subtotal,
      });
      await existingCart.save();
      return responseHandler.success(
        res,
        201,
        existingCart,
        "Product added to cart.",
      );
    } else {
      const newCart = await cartSchema.create({
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
      responseHandler.success(res, 201, newCart, "Product added to cart.");
    }
  } catch (error) {
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};
const getCart = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user?._id);
    const userRole = req.user?.role;
    if (!userId) return responseHandler.error(res, 401, "Unauthorized");
    const isAdmin = userRole === "admin" || userRole === "editor";
    let matchCart = { user: userId };
    if (isAdmin) {
      matchCart = {};
    }
    const carts = await cartSchema.aggregate([
      { $match: matchCart },
      { $unwind: { path: "$items", preserveNullAndEmptyArrays: true } },
      // product details
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "items.product",
        },
      },
      // cart product
      { $unwind: { path: "$items.product", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$_id",
          items: { $push: "$items" },
          totalItems: { $sum: "$items.quantity" },
          totalPrice: {
            $sum: {
              $multiply: ["$items.quantity", "$items.product.price"],
            },
          },
          createdAt: { $first: "$createdAt" },
        },
      },
    ]);
    if (!carts.length) return responseHandler.error(res, 404, "cart not Found");
    return responseHandler.success(res, 200, carts, "cart feched");
  } catch (error) {
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};
const updateCartItem = async (req, res) => {
  try {
    const { sku, quantity } = req.body;
    const cart = await cartSchema.findOne({ user: req.user._id });
    if (!cart) return responseHandler.error(res, 400, "Cart not found");
    const item = cart.items.find((p) => p.sku === sku);
    if (!item) return responseHandler.error(res, 400, "Item not found");
    const product = await productSchema.findById(item.product);
    const discountAmount = (product.price * product.discountPercentage) / 100;
    const discountedPrice = product.price - discountAmount;
    item.quantity = quantity;
    item.subtotal = discountedPrice * quantity;
    await cart.save();
    return responseHandler.success(res, 200, cart, "Cart updated");
  } catch (error) {
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};

const removeCartItem = async (req, res) => {
  try {
    const { sku } = req.params;
    const cart = await cartSchema.findOne({ user: req.user._id });
    if (!cart) return responseHandler.error(res, 400, "Cart not found");
    cart.items = cart.items.filter((item) => item.sku !== sku);
    await cart.save();
    return responseHandler.success(res, 200, cart, "Item removed");
  } catch (error) {
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await cartSchema.findOne({ user: req.user._id });
    if (!cart) return responseHandler.error(res, 400, "Cart not found");
    cart.items = [];
    await cart.save();
    return responseHandler.success(res, 200, cart, "Cart cleared");
  } catch (error) {
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
