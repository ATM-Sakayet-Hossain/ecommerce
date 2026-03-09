const cartSchema = require("../models/cartSchema");
const productSchema = require("../models/productSchema");
const { responseHandler } = require("../services/responseHandler");

const addToCart = async (req, res) => {
    try {
        const { productId, sku, quantity } = req.body;

        if (!productId || !sku || !quantity) return responseHandler.error(res, 400, "Invalid request.")

        const productData = await productSchema.findById(productId);
        const discountAmount = (productData.price * productData.discountPercentage) / 100;
        const discountedPrice = productData.price - discountAmount;
        const subtotal = discountedPrice * quantity;

        const existingCart = await cartSchema.findOne({ user: req.user._id })

        if (existingCart) {
            const alreadyExists = existingCart.items.some((pItem) => pItem.sku === sku)
            if (alreadyExists) return responseHandler.error(res, 400, "Product already exist in cart")

            existingCart.items.push({
                product: productId,
                sku,
                quantity,
                subtotal
            })
            existingCart.save()
            return responseHandler.success(res, 201, "Product added to cart.")
        } else {
            await cartSchema.create({
                user: req.user._id,
                items: [
                    {
                        product: productId,
                        sku,
                        quantity,
                        subtotal
                    }
                ]
            })

            responseHandler.success(res, 201, "Product added to cart.")
        }
    } catch (error) {
        console.log(error);

    }
}

module.exports = { addToCart };