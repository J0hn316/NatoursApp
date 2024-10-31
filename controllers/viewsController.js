const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

// Video 181 Setting up project structure
// Video 182 Building the Tour Overview - Part 1
exports.getOverview = catchAsync(async (req, res) => {
  // 1. Get tour data from collection.
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

// Video 181 Setting up project structure
// Video 184 Building the Tour Page - part 1
exports.getTour = catchAsync(async (req, res) => {
  const slug = req.params.slug;

  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  // 3) Render template user data from step 1
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});
