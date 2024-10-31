const morgan = require('morgan');
const express = require('express');
// const xss = require('xss-clean');
const hpp = require('hpp');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

// Utils
const AppError = require('./utils/appError');
const deepSanitize = require('./utils/deepSanitize');

// Route handlers
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const viewsRouter = require('./routes/viewsRoutes');
const reviewRouter = require('./routes/reviewRoutes');

// controllers
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Video 176 Setting up Pug in Express
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Video 66 Serving Static files
// Video 176 Setting up Pug in Express
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

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

// Routes
app.use('/', viewsRouter);
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
