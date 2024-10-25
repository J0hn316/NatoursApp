const slugify = require('slugify');
const mongoose = require('mongoose');
// const validator = require('validator');

// Video 93 Modelling the Tours
// Video 150 Modelling Locations (Geo-spatial Data)
// Video 151 Modelling Tour Guides:Embedding
// Video 152 Modelling Tour Guides: Child Referencing
// Video 170 Preventing Duplicate Reviews
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Video 167 Improving Read Performance with Indexes
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

// Video 171 Geospatial Queries: Finding Tours within Radius
tourSchema.index({ startLocation: '2dsphere' });

// Video 104 Virtual Properties
// Virtual properties are not stored in the database, but can be accessed in the model
// They are used to simplify the data retrieval process and reduce the amount of data sent over the network
// Virtual properties are defined using the get and set methods
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Video 157 Virtual Populate Tours and Reviews
// Virtual populate is used to populate the reviews field with the reviews of the tour
// It is used to simplify the data retrieval process and reduce the amount of data sent over the network
// Virtual populate is defined using the populate method
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// Video 105 Document Middleware
// Middleware functions are used to perform operations before or after a document is saved or updated
// They can be used to perform tasks such as validation, data transformation, and logging
// Runs before .save() and .create()
// Middleware functions are defined using the pre and post methods
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Video 153 Populating Tour Guides
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

// Video 106 Query Middleware
// Middleware functions are used to perform operations before or after a query is executed
// They can be used to perform tasks such as validation, data transformation, and logging
// Runs before .find(), .findOne(), .update(), .remove(), etc.
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// tourSchema.post(/^find/, function (doc, next) {
// doc is the result of the query
// next is a callback function that is called when the middleware function is finished
// console.log(doc);
// });

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
