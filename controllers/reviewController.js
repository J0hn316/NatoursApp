const factory = require('./handlerFactory');
const Review = require('../models/reviewModel');
// const catchAsync = require('../utils/catchAsync');

// Video 162 Factory Functions: Update and Create
exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// Video 160 Adding a Nested GET endpoint
// Video 163 Factory Functions: Reading
exports.getAllReviews = factory.getAll(Review);

// Video 163 Factory Functions: Reading
exports.getReview = factory.getOne(Review);

// Video 162 Factory Functions: Update and Create
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);

// Video 161 Building Handler Factory Functions: Delete
exports.deleteReview = factory.deleteOne(Review);
