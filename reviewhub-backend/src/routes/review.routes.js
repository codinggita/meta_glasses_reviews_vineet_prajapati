const { Router } = require('express');
const reviewController = require('../controllers/review.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { validateReview } = require('../validators/review.validator');

const router = Router();

router.get('/', authenticate, reviewController.getAllReviews);
router.get('/search', authenticate, reviewController.searchReviews);
router.get('/:id', authenticate, reviewController.getReviewById);
router.post('/', authenticate, authorize('admin'), validate(validateReview), reviewController.createReview);
router.put('/:id', authenticate, authorize('admin'), validate(validateReview), reviewController.updateReview);
router.delete('/:id', authenticate, authorize('admin'), reviewController.deleteReview);

module.exports = router;
