const express = require('express');
const router = express.Router();

const { protect, restrictTo } = require('../controllers/authController');

const {
  createTour,
  updateTour,
  deleteTour,
  getAllTours,
  getTourById,
  alisaTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');

const reviewRouter = require('../routes/reviewRoutes');

// Video 64 Param Middleware
// router.param('id', checkID);

// Video 159 Nested Routes with Express
router.use('/:tourId/reviews', reviewRouter);

// Video 100 Aliasing
router.route('/top-5-cheap').get(alisaTopTours, getAllTours);

// Video 102 Aggregation Pipeline: Matching and Grouping
router.route('/tour-stats').get(getTourStats);

// Video 103 Aggregation Pipeline:Unwinding and Projecting
router.route('/monthly-plan/:year').get(getMonthlyPlan);

// Video 65 Chaining Middleware
// Video 131 Protecting Tour Routes Part 1
router.route('/').get(protect, getAllTours).post(createTour);

// Video 134 Authorization: User roles and permissions
router
  .route('/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
