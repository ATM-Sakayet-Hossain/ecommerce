const responseHandler = (
  res,
  message = "",
  statusCode = 400,
  success = false,
  data = null
) => {
  return res.status(statusCode).json({
    success,
    message,
    ...(data && { data }),
  });
};
const responseHandlerSuccess = (
  res,
  message = "",
  statusCode = 200,
  success = true,
  data = null
) => {
  return res.status(statusCode).json({
    success,
    message,
    ...(data && { data }),
  });
};

module.exports = { responseHandler, responseHandlerSuccess }