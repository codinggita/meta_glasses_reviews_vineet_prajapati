const Review = require('../models/review.model');

const getAllReviews = async ({ filter, skip, limit, sort }) => {
  const [data, total] = await Promise.all([
    Review.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Review.countDocuments(filter),
  ]);
  return { data, total };
};

const getReviewById = async (id) => {
  const review = await Review.findById(id).lean();
  return review;
};

const createReview = async (payload) => {
  const review = await Review.create(payload);
  return review;
};

const updateReview = async (id, payload) => {
  const review = await Review.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();
  return review;
};

const softDeleteReview = async (id) => {
  const review = await Review.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  ).lean();
  return review;
};

const searchReviews = async ({ searchTerm, skip, limit }) => {
  const [data, total] = await Promise.all([
    Review.find({ $text: { $search: searchTerm }, isDeleted: false })
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments({ $text: { $search: searchTerm }, isDeleted: false }),
  ]);
  return { data, total };
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  softDeleteReview,
  searchReviews,
};
