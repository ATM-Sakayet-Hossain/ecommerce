const { default: mongoose } = require("mongoose");
const cartSchema = require("../models/cartSchema");
const ordersSchema = require("../models/ordersSchema");
const { generateOrderNumber, getPagination } = require("../services/helper");
const { enrichOrderItems } = require("../services/orderEnrichment");
const { responseHandler } = require("../Utils/responseHandler");
const endpointSecret = process.env.ENDPOINTSECRET;

const getStripeClient = () => {
  const key = process.env.STRIPE?.trim();
  if (!key) return null;
  return require("stripe")(key);
};

const parseInsideDhaka = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value === "true";
  return null;
};

const clearUserCart = async (userId) => {
  const cart = await cartSchema.findOne({ user: userId });
  if (!cart) return;
  cart.items = [];
  await cart.save();
};

const checkOut = async (req, res) => {
  const { paymenType, cartId, shippingAddress, insideDhaka } = req.body;
  try {
    if (!cartId) return responseHandler.error(res, 400, "invalid request");
    if (!shippingAddress)
      return responseHandler.error(res, 400, "Address is required");
    const isInsideDhaka = parseInsideDhaka(insideDhaka);
    if (isInsideDhaka === null)
      return responseHandler.error(
        res,
        400,
        "Invalid selection. Please choose inside Dhaka or outside Dhaka.",
      );
    if (!paymenType)
      return responseHandler.error(res, 400, "Payment methord is required");
    const cartData = await cartSchema.findOne({
      _id: cartId,
      user: req.user?._id,
    });
    if (!cartData?.items?.length)
      return responseHandler.error(res, 400, "Cart is empty");
    const charge = isInsideDhaka ? 80 : 120;
    const totalPrice = cartData.items.reduce((total, current) => {
      return (total += current.subtotal);
    }, charge);
    const orderNumber = await generateOrderNumber(
      ordersSchema,
      "OR",
      "orderNumber",
    );
    const orderData = new ordersSchema({
      user: req.user?._id,
      items: cartData.items,
      shippingAddress,
      insideDhaka: isInsideDhaka,
      deliveryCharge: charge,
      payment: { method: paymenType },
      orderNumber,
      totalPrice,
    });
    await orderData.save();

    if (paymenType === "cash") {
      await clearUserCart(req.user._id);
      return responseHandler.success(
        res,
        200,
        { order: orderData },
        "Order placed successfully",
      );
    }

    if (paymenType !== "Stripe") {
      return responseHandler.error(
        res,
        400,
        `${paymenType} payment is not available yet. Please choose cash or card (Stripe).`,
      );
    }

    const stripe = getStripeClient();
    if (!stripe) {
      return responseHandler.error(
        res,
        400,
        "Card payment is not configured on the server.",
      );
    }

    const clientUrl =
      process.env.CLIENT_URL?.trim() || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: `Order ${orderNumber}`,
              description: "SakkhorMart order payment",
            },
            unit_amount: Math.round(totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: req.user?.email,
      metadata: {
        orderNumber,
      },
      success_url: `${clientUrl}/orders/${orderNumber}?paid=1`,
      cancel_url: `${clientUrl}/checkout?cancelled=1`,
    });

    await clearUserCart(req.user._id);

    return responseHandler.success(
      res,
      200,
      { order: orderData, checkoutUrl: session.url },
      "Redirecting to payment",
    );
  } catch (error) {
    console.log(error);
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};

const webhook = async (req, res) => {
  const stripe = getStripeClient();
  if (!stripe || !endpointSecret) {
    return res.status(400).send("Stripe webhook is not configured");
  }
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    // payment save in database
    await ordersSchema.findByIdAndUpdate(
      session.metadata.orderId,
      { "payment.status": "paid" },
      { new: true },
    );
  }
  if (event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object;
    // payment save in database
    await ordersSchema.findByIdAndUpdate(
      session.metadata.orderId,
      { "payment.status": "failed" },
      { new: true },
    );
  }
  res.status(200).send();
};
const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const userId = req.user?._id;
    const userRole = req.user?.role;
    if (!userId) return responseHandler.error(res, 401, "Unauthorized");
    if (!orderNumber) return responseHandler.error(res, 400, "Order number is required");

    const isAdmin = userRole === "admin" || userRole === "editor";
    const matchOrders = { orderNumber };
    if (!isAdmin) {
      matchOrders.user = new mongoose.Types.ObjectId(userId);
    }

    const [order] = await ordersSchema.aggregate([
      { $match: matchOrders },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDocs",
        },
      },
      {
        $project: {
          orderNumber: 1,
          status: 1,
          totalPrice: 1,
          payment: 1,
          shippingAddress: 1,
          insideDhaka: 1,
          deliveryCharge: 1,
          items: 1,
          createdAt: 1,
          updatedAt: 1,
          "user.fullName": 1,
          "user.email": 1,
          productDocs: 1,
        },
      },
    ]);

    if (!order) return responseHandler.error(res, 404, "Order not found");

    return responseHandler.success(
      res,
      200,
      enrichOrderItems(order),
      "Order fetched successfully",
    );
  } catch (error) {
    console.log(error);
    return responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const {
      search,
      status,
      paymenType,
      paymentStatus,
      orderNumber,
      sort = "desc",
    } = req.query;
    const userId = new mongoose.Types.ObjectId(req.user?._id);
    const userRole = req.user?.role;
    if (!userId) return responseHandler.error(res, 401, "Unauthorized");
    const isAdmin = userRole === "admin" || userRole === "editor";
    let matchOrders = { user: userId };
    if (isAdmin) {
      matchOrders = {};
    }
    if (status) matchOrders.status = status;
    if (paymenType) matchOrders["payment.method"] = paymenType;
    if (paymentStatus) matchOrders["payment.status"] = paymentStatus;
    if (orderNumber) {
      matchOrders.orderNumber = {
        $regex: orderNumber,
        $options: "i",
      };
    }
    const order = await ordersSchema.aggregate([
      { $match: matchOrders },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDocs",
        },
      },
      {
        $match: search
          ? {
              $or: [
                { orderNumber: { $regex: search, $options: "i" } },
                { "user.email": { $regex: search, $options: "i" } },
                { "user.fullName": { $regex: search, $options: "i" } },
              ],
            }
          : {},
      },
      {
        $addFields: {
          previewThumbnail: { $arrayElemAt: ["$productDocs.thumbnail", 0] },
          itemCount: { $size: { $ifNull: ["$items", []] } },
        },
      },
      {
        $project: {
          orderNumber: 1,
          status: 1,
          totalPrice: 1,
          payment: 1,
          createdAt: 1,
          previewThumbnail: 1,
          itemCount: 1,
          "user.fullName": 1,
          "user.email": 1,
        },
      },
      { $sort: { createdAt: sort === "asc" ? 1 : -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
    const totalOrder = await ordersSchema.countDocuments(matchOrders);
    const totalPages = Math.ceil(totalOrder / limit);
    responseHandler.success(
      res,
      200,
      { order, totalOrder, page, limit, totalPages },
      "Orders fetched successfully",
    );
  } catch (error) {
    console.log(error);
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};
const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, paymentStatus, note } = req.body;
    const userRole = req.user?.role;
    const isAdmin = ["admin", "editor"].includes(userRole);
    const statusFlow = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
    };
    const existingOrder = await ordersSchema.findById(orderId);
    if (!existingOrder) return responseHandler.error(res, 404, "Order not Found");
    const validStatus = ["delivered", "cancelled"].includes(existingOrder.status)
    if (validStatus) return responseHandler.error(res, 400, "Finalized order cannot be updated");
    if (status) {
      const allowNext = statusFlow[existingOrder.status] || [];
      if (!allowNext.includes(status)) return responseHandler.error( res, 400, `Invalid status transition from ${existingOrder.status} to ${status}`);
      if (status === "delivered") {
        const finalPaymentStatus = paymentStatus || existingOrder.payment?.status;
        if (finalPaymentStatus !== "paid") return responseHandler.error(res, 400, "Payment must be paid before delivery");
        existingOrder.payment.status = "paid";
      }
      if (status !== "cancelled" && !isAdmin) return responseHandler.error(res, 403, "Only admin/editor can update order status");
      existingOrder.status = status;
      existingOrder.statusLogs.push({
        status,
        updatedBy: req.user?._id,
        role: userRole,
        note: note || "",
      });
    }
    if (paymentStatus) {
      existingOrder.payment = {
        ...existingOrder.payment,
        status: paymentStatus,
      };
    }
    existingOrder.updatedBy = req.user?._id;
    await existingOrder.save();
    const updatedOrder = await ordersSchema.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(orderId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          orderNumber: 1,
          status: 1,
          payment: 1,
          totalPrice: 1,
          createdAt: 1,
          "user.fullName": 1,
          "user.email": 1,
        },
      },
    ]);
    return responseHandler.success(
      res,
      200,
      updatedOrder[0],
      "Order updated successfully"
    );
  } catch (error) {
    console.log(error);
    return responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later"
    );
  }
};
module.exports = {
  checkOut,
  webhook,
  getAllOrders,
  getOrderByNumber,
  updateOrder,
};
