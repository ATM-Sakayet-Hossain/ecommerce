const { responseHandler } = require("../Utils/responseHandler");

const notFound = (req, res) => {
  return responseHandler.error(res, 404, `Route not found: ${req.originalUrl}`);
};

module.exports = notFound;