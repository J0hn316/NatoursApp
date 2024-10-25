const mongoose = require('mongoose');
const Tour = require('./tourModel');

// Video 154 Modelling Reviews: Parent Referencing
// Create a Review model with the following:
// 1) Review
// 2) rating
// 3) createdAt
// 4) ref to tour
// 5) ref to user
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Video 170 Preventing Duplicate Reviews
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Video 156 Populating Reviews
reviewSchema.pre(/^find/, function (next) {
  // ---- wont work well for this type of application see video 157 ----
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });
  // ---- wont work well for this type of application see video 157 ----

  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// Video 168 Calculating Average Rating on Tours Part 1
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        numRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);
  // Video 169 Calculating Average Rating on Tours Part 2
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].numRating,
      ratingAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingAverage: 4.5,
    });
  }
};

// Video 168 Calculating Average Rating on Tours Part 1
reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

// Video 169 Calculating Average Rating on Tours Part 2
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // this points to current review
  // this code is from Q & A
  this.review = await this.clone().findOne();
  // this code is from Q & A ^
  // console.log(this.review);
  next();
});

// Video 169 Calculating Average Rating on Tours Part 2
reviewSchema.post(/^findOneAnd/, async function () {
  // this points to current review
  await this.review.constructor.calcAverageRatings(this.review.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
