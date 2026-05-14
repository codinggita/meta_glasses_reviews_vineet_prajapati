const { sendError } = require('../utils/apiResponse');

const validate = (validatorFn) => {
  return (req, res, next) => {
    const errors = validatorFn(req.body);
    if (errors.length > 0) {
      return sendError(res, errors.join(', '), 400);
    }
    next();
  };
};

module.exports = validate;
