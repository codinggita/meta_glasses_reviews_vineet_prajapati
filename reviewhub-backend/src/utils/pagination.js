const DEFAULTS = { page: 1, limit: 20 };
const MAX_LIMIT = 100;

const parse = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || DEFAULTS.page);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(query.limit, 10) || DEFAULTS.limit));
  return { page, limit };
};

const skip = (page, limit) => {
  return (page - 1) * limit;
};

const format = (page, limit, total) => {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
  };
};

module.exports = { parse, skip, format, DEFAULTS };
