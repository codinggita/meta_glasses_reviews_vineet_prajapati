const { env } = require('./src/config/env');
const connectDB = require('./src/config/db');

const app = require('./app');

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`[SERVER] ReviewHub backend running on port ${env.PORT}`);
    console.log(`[SERVER] Environment: ${env.NODE_ENV}`);
    console.log(`[SERVER] Health check: http://localhost:${env.PORT}/api/v1/health`);
  });
};

startServer().catch((err) => {
  console.error('[SERVER] Failed to start:', err.message);
  process.exit(1);
});
