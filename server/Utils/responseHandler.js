const responseHandler = {
  success: (res, statusCode = 200, data, message) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  },
  error: (res, statusCode = 500, message) => {
    return res.status(statusCode).json({
      success: false,
      message: message || "Internal Server Error",
    });
  },
};

module.exports = { responseHandler };