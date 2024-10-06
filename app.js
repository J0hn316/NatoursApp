const morgan = require('morgan');
const express = require('express');
// const xss = require('xss-clean');
const hpp = require('hpp');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRouter');
const deepSanitize = require('./utils/deepSanitize');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Video 144 Setting Security HTTP headers
app.use(helmet());

// middleware videos 58-60, 67
// How to switch from development mode to production mode.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Video 143 Implementing Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again in an hour.',
});

// Video 143 Implementing Rate limiting
app.use('/api', limiter);

// Video 144 Setting Security HTTP headers
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Video 145 Data Sanitization
// 1.) Against NoSQL query injection
app.use(mongoSanitize());

// 2.) Against Cross-Site Scripting (XSS)
// xss-clean is deprecated
// app.use(xss());
// So you can use sanitize-html package or dompurify
// This is from Q&A
app.use((req, res, next) => {
  deepSanitize(req.body);
  next();
});

// Video 146 Preventing Parameter Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Video 66 Serving Static files
app.use(express.static(`${__dirname}/public`));

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// Video 155 Creating and Getting Reviews
app.use('/api/v1/reviews', reviewRouter);

// Video 112 Handling Unhandled Routes
// Video 115 Better Errors and Refactoring
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

// Video 114 Implementing a Global Error Handling Middleware
// Video 115 Better Errors and Refactoring
app.use(globalErrorHandler);

module.exports = app;

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
