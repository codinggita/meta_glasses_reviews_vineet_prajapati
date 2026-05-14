const authService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 'Name, email, and password are required', 400);
    }

    if (password.length < 8) {
      return sendError(res, 'Password must be at least 8 characters', 400);
    }

    const { user, token } = await authService.registerUser({
      name,
      email,
      password,
      role: role || 'analyst',
    });

    return sendSuccess(res, 'User registered successfully', { user, token }, 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    const { user, token } = await authService.loginUser({ email, password });
    return sendSuccess(res, 'Login successful', { user, token });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    return sendSuccess(res, 'User profile fetched', { user });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
