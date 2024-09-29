// Video 118 Errors during development vs production
const AppError = require('../utils/appError');

// Video 119 Handling Invalid Database IDs
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Video 120 Handling Duplicate DB fields
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;

  return new AppError(message, 400);
};

// Video 121 Handling Mongoose Validation Errors
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const devErrors = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const prodErrors = (err, res) => {
  // Operational, trusted error: send message to client.
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details.
  } else {
    // 1) Log error
    // console.error('Error:', err);

    // 2) Return generic error to client.
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong.',
    });
  }
};

// Video 132 Protecting Tour Routes Part 2
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again', 401);

// Video 132 Protecting Tour Routes Part 2
module.exports = (err, req, res, next) => {
  const environment = process.env.NODE_ENV;

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (environment === 'development') {
    devErrors(err, res);
  } else if (environment === 'production') {
    // Video 119 Handling Invalid Database IDs
    let error = err;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    prodErrors(error, res);
  }
};
