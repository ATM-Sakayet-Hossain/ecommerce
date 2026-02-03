const { VerifiedToken } = require("../services/helper");
const { responseHandler } = require("../Utils/responseHandler");

const authMiddleWare = async (req, res, next) => {
    try {
        const token = req.cookies;
        if (!token["X-AS-Token"]) {
            return responseHandler(res, "Invalid Request", 400)
        }
        const decoded = VerifiedToken(token["X-AS-Token"])
        if (!decoded) {
            return responseHandler(res, "Invalid Request", 400)
        }
        req.user = decoded;
        next()
    } catch (error) {
        console.log(error);
        return responseHandler(res,"Invalid Request", 500)
    }
}

module.exports = authMiddleWare;