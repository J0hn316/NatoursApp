const User = require('../models/userModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Video 139 Updating the current user data
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

// Video 164 Adding a /me Endpoint
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// Video 139 Updating the current user data
exports.updateMe = catchAsync(async (req, res, next) => {
  const id = req.user.id;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // 1.) Create error if user POSTs password data.
  if (password || confirmPassword) {
    return next(
      new AppError(
        'This route is not for password updates. Please use updatePassword',
        400
      )
    );
  }

  // 2.) Filtered out unwanted fields names that are not allowed to be updated.
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3.) Update user document
  const updatedUser = await User.findByIdAndUpdate(id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// Video 140 Deleting the Current User
exports.deleteMe = catchAsync(async (req, res, next) => {
  const id = req.user.id;

  // 1.) Delete user document
  await User.findByIdAndUpdate(id, { active: false });

  res.status(204).json({
    status: 'success',
    data: {
      user: null,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};

// Video 61 then video 63
// Video 130 Logging in users
// Video 163 Factory Functions: Reading
exports.getAllUsers = factory.getAll(User);

// Video 163 Factory Functions: Reading
exports.getUserById = factory.getOne(User);

// Video 162 Factory Functions: Update and Create
// Do Not update passwords with this.
exports.updateUser = factory.updateOne(User);

// Video 161 Building Handler Factory Functions: Delete
exports.deleteUser = factory.deleteOne(User);
