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
  getToursWithin,
  getDistances,
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
// Video 165 Adding Missing Authentication and Authorization
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

// Video 171 Geospatial Queries: Finding Tours within Radius
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

// Video 172 Geospatial Aggregation: Calculating Distances
router.route('/distances/:latlng/unit/:unit').get(getDistances);

// Video 65 Chaining Middleware
// Video 131 Protecting Tour Routes Part 1
// Video 165 Adding Missing Authentication and Authorization
router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);

// Video 134 Authorization: User roles and permissions
// Video 165 Adding Missing Authentication and Authorization
router
  .route('/:id')
  .get(getTourById)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
