const { responseHandler } = require("../Utils/responseHandler")

const roleCheckMiddleware = (...roles) => {
    return (req, res, next) => {
        try {
            if (roles.includes(req.user.role)) {
                return next()
            }
            return responseHandler(res, 400, "Invalid Request")
        } catch (error) {
            return responseHandler(res, 400, "Invalid Request")
        }
    }
}

module.exports = roleCheckMiddleware;