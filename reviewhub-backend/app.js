const express = require('express');
const cors = require('cors');
const healthRoutes = require('./src/routes/health.routes');
const authRoutes = require('./src/routes/auth.routes');
const reviewRoutes = require('./src/routes/review.routes');
const analyticsRoutes = require('./src/routes/analytics.routes');
const logger = require('./src/middlewares/logger.middleware');
const errorHandler = require('./src/middlewares/error.middleware');
const rateLimiter = require('./src/middlewares/rateLimiter.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);
app.use(logger);

app.use('/api/v1', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use(errorHandler);

module.exports = app;
