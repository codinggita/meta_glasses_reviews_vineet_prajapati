const reviewService = require('../services/review.service');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const pagination = require('../utils/pagination');
const filterBuilder = require('../utils/filterBuilder');

const getAllReviews = async (req, res, next) => {
  try {
    const { page, limit } = pagination.parse(req.query);
    const filter = filterBuilder.buildReviewFilter(req.query);
    const sort = filterBuilder.buildSort(req.query);

    const { data, total } = await reviewService.getAllReviews({
      filter,
      skip: pagination.skip(page, limit),
      limit,
      sort,
    });

    return sendSuccess(res, 'Reviews fetched successfully', {
      reviews: data,
      pagination: pagination.format(page, limit, total),
    });
  } catch (err) {
    next(err);
  }
};

const getReviewById = async (req, res, next) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);
    if (!review) {
      return sendError(res, 'Review not found', 404);
    }
    return sendSuccess(res, 'Review fetched successfully', { review });
  } catch (err) {
    next(err);
  }
};

const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.body);
    return sendSuccess(res, 'Review created successfully', { review }, 201);
  } catch (err) {
    next(err);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const review = await reviewService.updateReview(req.params.id, req.body);
    if (!review) {
      return sendError(res, 'Review not found', 404);
    }
    return sendSuccess(res, 'Review updated successfully', { review });
  } catch (err) {
    next(err);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await reviewService.softDeleteReview(req.params.id);
    if (!review) {
      return sendError(res, 'Review not found', 404);
    }
    return sendSuccess(res, 'Review deleted successfully');
  } catch (err) {
    next(err);
  }
};

const searchReviews = async (req, res, next) => {
  try {
    const { q, page, limit } = req.query;
    if (!q) {
      return sendError(res, 'Search query (q) is required', 400);
    }

    const { page: p, limit: l } = pagination.parse({ page, limit });
    const { data, total } = await reviewService.searchReviews({
      searchTerm: q,
      skip: pagination.skip(p, l),
      limit: l,
    });

    return sendSuccess(res, 'Search results fetched', {
      reviews: data,
      pagination: pagination.format(p, l, total),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  searchReviews,
};
