const sendSuccess = (res, message, data = null, statusCode = 200) => {
  const response = { success: true, message };
  if (data) {
    Object.assign(response, data);
  }
  return res.status(statusCode).json(response);
};

const sendError = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { sendSuccess, sendError };
