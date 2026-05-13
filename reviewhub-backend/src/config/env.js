const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const env = {
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/reviewhub',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_dev_secret',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

const isProduction = env.NODE_ENV === 'production';
const isDevelopment = env.NODE_ENV === 'development';
const isTest = env.NODE_ENV === 'test';

module.exports = { env, isProduction, isDevelopment, isTest };
