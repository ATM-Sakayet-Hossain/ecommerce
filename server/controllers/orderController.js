const { default: mongoose } = require("mongoose");
const cartSchema = require("../models/cartSchema");
const ordersSchema = require("../models/ordersSchema");
const { generateOrderNumber, getPagination } = require("../services/helper");
const { responseHandler } = require("../Utils/responseHandler");
const stripe = require("stripe")(`${process.env.STRIPE}`);
const endpointSecret = process.env.ENDPOINTSECRET;

const checkOut = async (req, res) => {
  const { paymenType, cartId, shippingAddress, insideDhaka } = req.body;
  try {
    if (!cartId) return responseHandler.error(res, 400, "invalid request");
    if (!shippingAddress)
      return responseHandler.error(res, 400, "Address is required");
    if (!insideDhaka)
      return responseHandler.error(
        res,
        400,
        "Invalid selection. Please choose inside Dhaka or outside Dhaka.",
      );
    if (!paymenType)
      return responseHandler.error(res, 400, "Payment methord is required");
    const cartData = await cartSchema.findOne({ _id: cartId });
    if (!cartData) return responseHandler.error(res, 400, "invalid rewuest");
    const charge = insideDhaka === "true" ? 80 : 120;
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
      insideDhaka,
      deliveryCharge: charge,
      payment: { method: paymenType },
      orderNumber,
      totalPrice,
    });
    await orderData.save();
    if (paymenType === "cash")
      return responseHandler.success(
        res,
        200,
        orderData,
        "Order placed successfully",
      );
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "BDT",
            product_data: {
              name: "T-Shirt",
              description: `Blue T-Shirt with chest print`,
            },
            unit_amount: 20000 * 100,
          },
          quantity: 1,
        },
      ],
      customer_email: `${req.user.email}`,
      metadata: {
        orderId: `${orderNumber}`,
      },
      success_url: `https://example.com/success`,
      cancel_url: `https://example.com/error`,
    });
    res.redirect(303, session.url);
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
        $match: search
          ? {
              $or: [
                { orderNumber: { $regex: search, $options: "i" } },
                { "user.email": { $regex: search, $options: "i" } },
                { "user.name": { $regex: search, $options: "i" } },
              ],
            }
          : {},
      },
      {
        $project: {
          orderNumber: 1,
          status: 1,
          totalPrice: 1,
          payment: 1,
          createdAt: 1,
          "user.name": 1,
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
          "user.name": 1,
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
module.exports = { checkOut, webhook, getAllOrders, updateOrder };
