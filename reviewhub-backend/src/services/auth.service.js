const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { env } = require('../config/env');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const registerUser = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    const err = new Error('Email already registered');
    err.statusCode = 409;
    throw err;
  }

  const user = await User.create({ name, email, password, role });
  const token = generateToken(user);
  return { user, token };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  if (!user.isActive) {
    const err = new Error('Account is deactivated');
    err.statusCode = 403;
    throw err;
  }

  const token = generateToken(user);
  return { user, token };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).lean();
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  generateToken,
};
