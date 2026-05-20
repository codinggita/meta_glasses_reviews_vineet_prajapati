const Review = require('../models/review.model');

const getOverview = async () => {
  const result = await Review.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        avgRating: { $avg: '$rating' },
        avgHelpfulness: { $avg: '$helpfulness_score' },
        positiveCount: {
          $sum: { $cond: [{ $eq: ['$is_positive_review', 1] }, 1, 0] },
        },
        negativeCount: {
          $sum: { $cond: [{ $eq: ['$is_positive_review', 0] }, 1, 0] },
        },
        withImageCount: {
          $sum: { $cond: [{ $ne: ['$reviewImage', ''] }, 1, 0] },
        },
      },
    },
  ]);
  return result[0] || {};
};

const getRatingDistribution = async () => {
  const result = await Review.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  return result.map((r) => ({ rating: r._id, count: r.count }));
};

const getSentimentTrend = async () => {
  const result = await Review.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
        },
        positive: {
          $sum: { $cond: [{ $eq: ['$is_positive_review', 1] }, 1, 0] },
        },
        negative: {
          $sum: { $cond: [{ $eq: ['$is_positive_review', 0] }, 1, 0] },
        },
        total: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);
  return result.map((r) => ({
    year: r._id.year,
    month: r._id.month,
    positive: r.positive,
    negative: r.negative,
    total: r.total,
    avgRating: parseFloat(r.avgRating.toFixed(2)),
  }));
};

const getTopReviewers = async () => {
  const result = await Review.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: '$name',
        totalReviews: { $sum: 1 },
        avgRating: { $avg: '$rating' },
        totalHelpfulAug: { $sum: '$helpful_aug' },
        avgHelpfulnessScore: { $avg: '$helpfulness_score' },
      },
    },
    { $sort: { totalHelpfulAug: -1 } },
    { $limit: 10 },
  ]);
  return result.map((r) => ({
    name: r._id,
    totalReviews: r.totalReviews,
    avgRating: parseFloat(r.avgRating.toFixed(2)),
    totalHelpfulAug: r.totalHelpfulAug,
    avgHelpfulnessScore: parseFloat(r.avgHelpfulnessScore.toFixed(2)),
  }));
};

const getHelpfulnessDistribution = async () => {
  const buckets = [
    { range: '0-2', min: 0, max: 2 },
    { range: '2-4', min: 2, max: 4 },
    { range: '4-6', min: 4, max: 6 },
    { range: '6-8', min: 6, max: 8 },
    { range: '8-10', min: 8, max: 10 },
  ];

  const result = await Review.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        docs: { $push: '$helpfulness_score' },
      },
    },
  ]);

  if (!result.length) return buckets.map((b) => ({ ...b, count: 0 }));

  const docs = result[0].docs;
  return buckets.map((b) => ({
    ...b,
    count: docs.filter((v) => v >= b.min && v < b.max).length,
  }));
};

const getMonthlyVolume = async () => {
  const result = await Review.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);
  return result.map((r) => ({
    year: r._id.year,
    month: r._id.month,
    count: r.count,
  }));
};

const getImageVsNoImage = async () => {
  const result = await Review.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        withImage: {
          $sum: { $cond: [{ $ne: ['$reviewImage', ''] }, 1, 0] },
        },
        withoutImage: {
          $sum: { $cond: [{ $eq: ['$reviewImage', ''] }, 1, 0] },
        },
        total: { $sum: 1 },
      },
    },
  ]);
  return result[0] || { withImage: 0, withoutImage: 0, total: 0 };
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
