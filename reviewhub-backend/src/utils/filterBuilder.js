const buildReviewFilter = (query) => {
  const filter = { isDeleted: false };

  if (query.rating) {
    const rating = parseInt(query.rating, 10);
    if ([1, 3, 4, 5].includes(rating)) {
      filter.rating = rating;
    }
  }

  if (query.is_positive_review !== undefined) {
    const val = parseInt(query.is_positive_review, 10);
    if (val === 0 || val === 1) {
      filter.is_positive_review = val;
    }
  }

  if (query.country) {
    filter.country = query.country;
  }

  if (query.name) {
    filter.name = query.name;
  }

  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) {
      filter.date.$gte = new Date(query.startDate);
    }
    if (query.endDate) {
      filter.date.$lte = new Date(query.endDate);
    }
  }

  if (query.hasImage === 'true') {
    filter.reviewImage = { $ne: '' };
  } else if (query.hasImage === 'false') {
    filter.reviewImage = '';
  }

  return filter;
};

const buildSort = (query) => {
  const sort = {};
  const sortBy = query.sortBy || 'date';
  const order = query.order === 'asc' ? 1 : -1;
  sort[sortBy] = order;
  return sort;
};

module.exports = { buildReviewFilter, buildSort };
