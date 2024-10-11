const express = require('express');

// Video 159 Nested Routes with Express
// added { mergeParams: true }
const router = express.Router({ mergeParams: true });

const {
  createReview,
  getAllReviews,
  setTourUserIds,
  deleteReview,
} = require('../controllers/reviewController');

const { protect, restrictTo } = require('../controllers/authController');

router.use(protect);

// Video 155 Creating and Getting Reviews
router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourUserIds, createReview);

// Video 161 Building Handler Factory Functions: Delete
router.route('/:id').delete(deleteReview);

module.exports = router;
