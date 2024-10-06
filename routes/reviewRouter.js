const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  createReview,
  getAllReviews,
  setTourUserIds,
} = require('../controllers/reviewController');

const { protect, restrictTo } = require('../controllers/authController');

router.use(protect);

// Video 155 Creating and Getting Reviews
router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourUserIds, createReview);

module.exports = router;
