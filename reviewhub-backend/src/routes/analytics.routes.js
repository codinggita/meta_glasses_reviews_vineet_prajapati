const { Router } = require('express');
const analyticsController = require('../controllers/analytics.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = Router();

router.use(authenticate);

router.get('/overview', analyticsController.getOverview);
router.get('/rating-distribution', analyticsController.getRatingDistribution);
router.get('/sentiment-trend', analyticsController.getSentimentTrend);
router.get('/top-reviewers', analyticsController.getTopReviewers);
router.get('/helpfulness-distribution', analyticsController.getHelpfulnessDistribution);
router.get('/monthly-volume', analyticsController.getMonthlyVolume);
router.get('/image-vs-no-image', analyticsController.getImageVsNoImage);

module.exports = router;
