const express = require('express');

// Video 159 Nested Routes with Express
// added { mergeParams: true }
const router = express.Router({ mergeParams: true });

const {
  createReview,
  getAllReviews,
  setTourUserIds,
  deleteReview,
  updateReview,
  getReview,
} = require('../controllers/reviewController');

const { protect, restrictTo } = require('../controllers/authController');

// Video 165 Adding Missing Authentication and Authorization
router.use(protect);

// Video 155 Creating and Getting Reviews
router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourUserIds, createReview);

// Video 161 Building Handler Factory Functions: Delete
// Video 162 Factory Functions: Update and Create
// Video 163 Factory Functions: Reading
// Video 165 Adding Missing Authentication and Authorization
router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview);

module.exports = router;
