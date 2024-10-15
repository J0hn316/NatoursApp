const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

// Video 162 Factory Functions: Update and Create
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const body = req.body;
    const document = await Model.create(body);

    res.status(201).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

// Video 162 Factory Functions: Update and Create
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const body = req.body;

    const document = await Model.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

// Video 161 Building Handler Factory Functions: Delete
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

// Video 163 Factory Functions: Reading
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    let query = Model.findById(id);

    if (popOptions) {
      query = query.populate(popOptions);
    }

    const document = await query;

    if (!document) {
      return next(new AppError('Document not found with this ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

// Video 163 Factory Functions: Reading
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // --- To allow for nested GET reviews on tour ---
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    // -- To allow for nested GET reviews on tour -- ^

    const query = req.query;
    const features = new APIFeatures(Model.find(filter), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const document = await features.query;

    res.status(200).json({
      status: 'success',
      results: document.length,
      data: {
        data: document,
      },
    });
  });
