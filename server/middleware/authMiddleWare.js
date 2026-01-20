const { VerifiedToken } = require("../services/helper");
const { responseHandler } = require("../Utils/responseHandler");

const authMiddleWare = async (req, res, next) => {
    try {
        const token = req.cookies;
        if (!token["X-AS-Token"]) {
            return responseHandler(res, 400, "Invalid Request")
        }
        const decoded = VerifiedToken(token["X-AS-Token"])
        if (!decoded) {
            return responseHandler(res, 400, "Invalid Request")
        }
        req.user = decoded;
        next()
    } catch (error) {
        return responseHandler(res, 400, "Invalid Request")
    }
}

module.exports = authMiddleWare;