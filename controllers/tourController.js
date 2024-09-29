const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

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
exports.getAllTours = catchAsync(async (req, res, next) => {
  const query = req.query;

  const features = new APIFeatures(Tour.find(), query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// Video 90 Reading Documents
// Video 116 Catching Errors in Async Functions
// Video 117 Adding 404 Not Found Errors
exports.getTourById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const tour = await Tour.findById(id);

  if (!tour) {
    return next(new AppError('Tour not found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// Video 89 Creating Documents
// Video 116 Catching Errors in Async Functions
exports.createTour = catchAsync(async (req, res, next) => {
  const body = req.body;
  const newTour = await Tour.create(body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

// Video 91
// Video 116 Catching Errors in Async Functions
// Video 117 Adding 404 Not Found Errors
exports.updateTour = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  const tour = await Tour.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('Invalid Tour ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// Video 116 Catching Errors in Async Functions
// Video 117 Adding 404 Not Found Errors
exports.deleteTour = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const tour = await Tour.findByIdAndDelete(id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

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

// <---Extra Code------>

// Video 65 Chaining Middleware
// Create a checkBody middleware
// Check if body contains the name and price property
// If not, send back 400 (bad request)
// Add it to the post handler stack

// exports.checkBody = (req, res, next) => {
//   const name = req.body.name;
//   const price = req.body.price;

//   if (!name || !price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   const id = req.params.id * 1; // convert the id from string to number
//   const toursLength = tours.length;

//   if (id > toursLength) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

// const tours = await Tour.find()
//   .where('duration')
//   .equals(5)
//   .where('difficulty')
//   .equals('easy');
