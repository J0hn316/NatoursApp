// Code from someone in the comments
// Few security measures to prevent attacks

const fs = require('fs');
const express = require('express');
const app = express();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Middleware to parse JSON bodies, limited to 10KB
app.use(express.json({ limit: '10kb' }));

// Middleware to parse URL-encoded bodies, limited to 10KB
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.get('/api/v1/tours', limiter, (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
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

// Video 52 handling GET requests
// app.get('/api/v1/tours', getAllTours);

// Video 54 Responding to URL Parameters
// app.get('/api/v1/tours/:id', getTourById);

// Video 53 handling POST requests
// app.post('/api/v1/tours', createTour);

// Video 55 handling PATCH Requests
// app.patch('/api/v1/tours/:id', updateTour);

// Video 56 handling DELETE Requests
// app.delete('/api/v1/tours/:id', deleteTour);

// middleware videos 58-60
// app.use((req, res, next) => {
//   console.log('Hello from the middleware!');
//   next();
// });

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

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

// Video 107 Aggregation Middleware
// Middleware functions are used to perform operations before or after an aggregation pipeline is executed
// They can be used to perform tasks such as validation, data transformation, and logging
// Runs before .aggregate()
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().match({ secretTour: { $ne: true } });
//   next();
// });
