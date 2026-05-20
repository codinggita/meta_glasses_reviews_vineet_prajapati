const analyticsService = require('../services/analytics.service');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const getOverview = async (req, res, next) => {
  try {
    const data = await analyticsService.getOverview();
    return sendSuccess(res, 'Analytics overview fetched', { overview: data });
  } catch (err) {
    next(err);
  }
};

const getRatingDistribution = async (req, res, next) => {
  try {
    const data = await analyticsService.getRatingDistribution();
    return sendSuccess(res, 'Rating distribution fetched', { distribution: data });
  } catch (err) {
    next(err);
  }
};

const getSentimentTrend = async (req, res, next) => {
  try {
    const data = await analyticsService.getSentimentTrend();
    return sendSuccess(res, 'Sentiment trend fetched', { trend: data });
  } catch (err) {
    next(err);
  }
};

const getTopReviewers = async (req, res, next) => {
  try {
    const data = await analyticsService.getTopReviewers();
    return sendSuccess(res, 'Top reviewers fetched', { reviewers: data });
  } catch (err) {
    next(err);
  }
};

const getHelpfulnessDistribution = async (req, res, next) => {
  try {
    const data = await analyticsService.getHelpfulnessDistribution();
    return sendSuccess(res, 'Helpfulness distribution fetched', { distribution: data });
  } catch (err) {
    next(err);
  }
};

const getMonthlyVolume = async (req, res, next) => {
  try {
    const data = await analyticsService.getMonthlyVolume();
    return sendSuccess(res, 'Monthly volume fetched', { volume: data });
  } catch (err) {
    next(err);
  }
};

const getImageVsNoImage = async (req, res, next) => {
  try {
    const data = await analyticsService.getImageVsNoImage();
    return sendSuccess(res, 'Image comparison fetched', { comparison: data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOverview,
  getRatingDistribution,
  getSentimentTrend,
  getTopReviewers,
  getHelpfulnessDistribution,
  getMonthlyVolume,
  getImageVsNoImage,
};
