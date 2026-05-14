const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES = ['admin', 'analyst'];

const validateRegister = (body) => {
  const errors = [];
  const { name, email, password, role } = body || {};

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.length > 100) {
    errors.push('Name cannot exceed 100 characters');
  }

  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
  } else if (!EMAIL_RE.test(email)) {
    errors.push('Invalid email format');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  } else if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (role && !VALID_ROLES.includes(role)) {
    errors.push('Role must be admin or analyst');
  }

  return errors;
};

const validateLogin = (body) => {
  const errors = [];
  const { email, password } = body || {};

  if (!email) {
    errors.push('Email is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  return errors;
};

module.exports = { validateRegister, validateLogin };
