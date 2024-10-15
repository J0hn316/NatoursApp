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
