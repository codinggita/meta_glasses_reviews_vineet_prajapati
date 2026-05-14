const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    reviewID: {
      type: String,
      required: [true, 'reviewID is required'],
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Reviewer name is required'],
      trim: true,
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Review date is required'],
      index: true,
    },
    verifiedPurchase: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      enum: [1, 3, 4, 5],
      index: true,
    },
    helpful: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      trim: true,
      default: '',
    },
    review: {
      type: String,
      default: '',
    },
    profile: {
      type: String,
      trim: true,
      default: '',
    },
    country: {
      type: String,
      trim: true,
      default: 'United States',
    },
    reviewLink: {
      type: String,
      trim: true,
      default: '',
    },
    reviewImage: {
      type: String,
      trim: true,
      default: '',
    },
    helpful_aug: {
      type: Number,
      default: 0,
    },
    is_positive_review: {
      type: Number,
      enum: [0, 1],
      default: 1,
      index: true,
    },
    helpfulness_score: {
      type: Number,
      default: 0.0,
      min: 0,
      max: 10,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ title: 'text', review: 'text' });
reviewSchema.index({ helpfulness_score: -1 });
reviewSchema.index({ helpful_aug: -1 });

module.exports = mongoose.model('Review', reviewSchema);
