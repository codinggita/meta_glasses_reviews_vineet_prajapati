const { Router } = require('express');

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'ReviewHub API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

module.exports = router;
