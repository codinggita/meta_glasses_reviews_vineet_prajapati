const mongoose = require('mongoose');

/**
 * Connect to MongoDB with retry logic and error logging.
 * @param {number} retryCount - Number of retry attempts (default: 3)
 */
const connectDB = async (retryCount = 3) => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/reviewhub';

  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.error(`[DB] Connection attempt ${attempt}/${retryCount} failed: ${err.message}`);

      if (attempt === retryCount) {
        console.error('[DB] All connection attempts exhausted. Exiting.');
        process.exit(1);
      }

      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

mongoose.connection.on('connected', () => {
  console.log('[DB] Mongoose connection established.');
});

mongoose.connection.on('error', (err) => {
  console.error(`[DB] Mongoose connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[DB] Mongoose connection disconnected.');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('[DB] Mongoose connection closed due to application termination.');
  process.exit(0);
});

module.exports = connectDB;
