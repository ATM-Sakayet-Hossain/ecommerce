const { uploadToCloudinary } = require("../services/cloudinaryService");
const { responseHandler } = require("../Utils/responseHandler");

const createProduct = async (req, res) =>{
    try {
        const {title, description, category, price, discountPercentage, variants, tags, isActive} = req.body;
        const thumbnail = req.files?.thumbnail?.[0];
        const images = req.files?.images || [];
        // if(!title) return responseHandler(res, "Product title is required")
        // if(!description) return responseHandler(res, "Product description is required")
        // if(!category) return responseHandler(res, "Product category is required")
        // if(!price) return responseHandler(res, "Product price is required")
        if(!thumbnail) return responseHandler(res, "Product Thumbnail is required")
        if(images && images.length > 4) return responseHandler(res, "You can upload images max 4")
        let imagesUrl= [];
        if(images){
            const resPromise = images.map(async(i)=> uploadToCloudinary(i, "Product"))
            const result = await Promise.all(resPromise)
            imagesUrl = result.map(r => r.secure_url)
        }
        console.log(thumbnail.buffer);
        console.log(imagesUrl);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {createProduct}