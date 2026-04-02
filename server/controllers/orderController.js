const cartSchema = require("../models/cartSchema");
const ordersSchema = require("../models/ordersSchema");
const { generateOrderNumber } = require("../services/helper");
const { responseHandler } = require("../Utils/responseHandler");
const stripe = require("stripe")(`${process.env.STRIPE}`);
const endpointSecret = process.env.ENDPOINTSECRET;

const checkOut = async (req, res) => {
  const { paymenType, cardId, shippingAddress, insideDhaka } = req.body;
  try {
    if (!cardId) return responseHandler.error(res, 400, "invalid request");
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
    const cartData = await cartSchema.findOne({ _id: cardId });
    if (!cartData) return responseHandler.error(res, 400, "invalid rewuest");
    const charge = insideDhaka === "true" ? 80 : 120;
    const totalPrice = cartData.items.reduce((total, current) => {
      return (total += current.subtotal);
    }, charge);
    const orderNumber = generateOrderNumber(orderData);
    const orderData = new ordersSchema({
      user: req.user?._id,
      items: cartData.items,
      shippingAddress,
      insideDhaka,
      deliveryCharge: charge,
      payment: { method: paymenType },
      orderNumber,
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
    res.redirect(303, session.url)
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
  const signature = req.headers['stripe-signature']
  let event
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      endpointSecret
    )
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`)
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // payment save in database
    await ordersSchema.findByIdAndUpdate(session.metadata.orderId, { "payment.status": "paid" }, { new: true })
  }
  if (event.type === 'checkout.session.async_payment_failed') {
    const session = event.data.object;
    // payment save in database
    await ordersSchema.findByIdAndUpdate(session.metadata.orderId, { "payment.status": "failed" }, { new: true })
  }
  res.status(200).send()
}

module.exports = { checkOut, webhook }