const Tour = require('../models/tourModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Video 100 Aliasing
exports.alisaTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// 1.) Video 57  Refactoring our Routes Handlers
// 2.) Video 90 Reading Documents
// 3.) Video 95 Filtering and 96 Advance Filtering
// 4.) Video 97 Sorting
// 5.) Video 98 Limiting Fields
// 6.) Video 99 Pagination
// 7.) Video 101 Refactor API Features
// 8.) Video 116 Catching Errors in Async Functions
// 9.) Video 163 Factory Functions: Reading
exports.getAllTours = factory.getAll(Tour);

// Video 90 Reading Documents
// Video 116 Catching Errors in Async Functions
// Video 117 Adding 404 Not Found Errors
// Video 157 Virtual Populate Tours and Reviews
// Video 163 Factory Functions: Reading
exports.getTourById = factory.getOne(Tour, { path: 'reviews' });

// Video 89 Creating Documents
// Video 116 Catching Errors in Async Functions
// Video 162 Factory Functions: Update and Create
exports.createTour = factory.createOne(Tour);

// Video 91 Updating documents
// Video 116 Catching Errors in Async Functions
// Video 117 Adding 404 Not Found Errors
// Video 162 Factory Functions: Update and Create
exports.updateTour = factory.updateOne(Tour);

// Video 116 Catching Errors in Async Functions
// Video 117 Adding 404 Not Found Errors
// Video 161 Building Handler Factory Functions: Delete
exports.deleteTour = factory.deleteOne(Tour);

// Video 102 Aggregation Pipeline: Matching and Grouping
// Video 116 Catching Errors in Async Functions
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

// Video 103 Aggregation Pipeline:Unwinding and Projecting
// Video 116 Catching Errors in Async Functions
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

// Video 171 Geospatial Queries: Finding Tours within Radius
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      AppError(
        'Please provide latitude and longitude in the format lat, lng.',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

// Video 172 Geospatial Aggregation: Calculating Distances
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const convertKiloToMiles = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      AppError(
        'Please provide latitude and longitude in the format lat, lng.',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [lng * 1, lat * 1] },
        distanceField: 'distance',
        distanceMultiplier: convertKiloToMiles,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});
