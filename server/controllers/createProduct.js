const { responseHandler } = require("../Utils/responseHandler");

const createProduct = (req, res) =>{
    try {
        const {title, description, category, price, discountPercentage, variants, tags, isActive} = req.body;
        if(!title) return responseHandler(res, "Product title is required")
        if(!description) return responseHandler(res, "Product description is required")
        if(!category) return responseHandler(res, "Product category is required")
        if(!price) return responseHandler(res, "Product price is required")
    } catch (error) {
        console.log(error);
    }
}

module.exports ={createProduct}