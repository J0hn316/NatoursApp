const slugify = require('slugify');
const mongoose = require('mongoose');
// const validator = require('validator');

// Video 93 Modelling the Tours
// Video 150 Modelling Locations (Geo-spatial Data)
// Video 151 Modelling Tour Guides:Embedding
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A tour name must have less or equal then 40 characters.',
      ],
      minlength: [
        10,
        'A tour name must have more or equal then 10 characters.',
      ],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
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
        message: 'Select a valid difficulty: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
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
          // this only points to current doc on NEW document creation.
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) must be less than original price',
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
    guides: [],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Video 104 Virtual Properties
// Virtual properties are not stored in the database, but can be accessed in the model
// They are used to simplify the data retrieval process and reduce the amount of data sent over the network
// Virtual properties are defined using the get and set methods
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
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

// Video 151 Modelling Tour Guides:Embedding
// Embedded documents are used to store related data within a single document
// They are defined using the type property and are stored as a JSON object
// ----------- Will not be used for this project------------
// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });
// ----------- Will not be used for this project ^------------

// tourSchema.post('save', function (doc, next) {
//    doc is the document that was saved
//    next is a callback function that is called when the middleware function is finished
// });

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

// Video 107 Aggregation Middleware
// Middleware functions are used to perform operations before or after an aggregation pipeline is executed
// They can be used to perform tasks such as validation, data transformation, and logging
// Runs before .aggregate()
tourSchema.pre('aggregate', function (next) {
  this.pipeline().match({ secretTour: { $ne: true } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
