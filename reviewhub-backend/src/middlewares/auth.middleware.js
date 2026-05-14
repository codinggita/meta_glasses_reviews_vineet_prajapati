const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { sendError } = require('../utils/apiResponse');

const authenticate = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return sendError(res, 'Access denied. No token provided.', 401);
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Token expired', 401);
    }
    return sendError(res, 'Invalid token', 401);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Forbidden: insufficient permissions', 403);
    }
    next();
  };
};

module.exports = { authenticate, authorize };
