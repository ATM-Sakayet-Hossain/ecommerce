const { responseHandler } = require("../Utils/responseHandler");

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error?.statusCode || error?.status || 500;
  const message = error?.message || "Internal Server Error";

  return responseHandler.error(res, statusCode, message);
};

module.exports = errorHandler;