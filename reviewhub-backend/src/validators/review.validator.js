const VALID_RATINGS = [1, 3, 4, 5];

const validateReview = (body) => {
  const errors = [];
  const { name, date, rating, title, review, is_positive_review, helpfulness_score } = body || {};

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      errors.push('Name must be a non-empty string');
    } else if (name.length > 100) {
      errors.push('Name cannot exceed 100 characters');
    }
  }

  if (date !== undefined) {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      errors.push('Date must be a valid date string');
    }
  }

  if (rating !== undefined) {
    const num = Number(rating);
    if (!VALID_RATINGS.includes(num)) {
      errors.push(`Rating must be one of: ${VALID_RATINGS.join(', ')}`);
    }
  }

  if (title !== undefined && typeof title === 'string' && title.length > 500) {
    errors.push('Title cannot exceed 500 characters');
  }

  if (is_positive_review !== undefined) {
    const val = Number(is_positive_review);
    if (![0, 1].includes(val)) {
      errors.push('is_positive_review must be 0 or 1');
    }
  }

  if (helpfulness_score !== undefined) {
    const score = Number(helpfulness_score);
    if (isNaN(score) || score < 0 || score > 10) {
      errors.push('helpfulness_score must be a number between 0 and 10');
    }
  }

  return errors;
};

module.exports = { validateReview };
