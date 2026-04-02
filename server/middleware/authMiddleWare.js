const { VerifiedToken } = require("../services/helper");
const { responseHandler } = require("../utils/responseHandler");

const authMiddleWare = async (req, res, next) => {
    try {
        const token = req.cookies;
        if (!token["X-AS-Token"]) {
            return responseHandler.error(res, 400, "Invalid Request")
        }
        const decoded = VerifiedToken(token["X-AS-Token"])
        if (!decoded) {
            return responseHandler.error(res, 400, "Invalid Request")
        }
        req.user = decoded;
        next()
    } catch (error) {
        responseHandler.error(res, 500, "Invalid Request")
    }
}

module.exports = authMiddleWare;