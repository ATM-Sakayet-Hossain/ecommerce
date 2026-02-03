const { responseHandler } = require("../Utils/responseHandler")

const roleCheckMiddleware = (...roles) => {
    return (req, res, next) => {
        try {
            if (roles.includes(req.user.role)) {
                return next()
            }
            return responseHandler(res, "Contract Your Admin", 400)
        } catch (error) {
            return responseHandler(res, "Invalid Request", 500)
        }
    }
}

module.exports = roleCheckMiddleware;