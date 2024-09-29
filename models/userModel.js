const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Video 125 Modelling Users
// Create userSchema with name, email, photo, password and confirmPassword
// Video 130 Logging in Users
// Video 132 Protecting Tour Routes Part 2
// Video 134 Authorization: User roles and permissions
// Video 135 Password reset functionality: Reset token
// Video 140 Deleting the Current User
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on create and save.
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same.',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// Video 127 Managing Passwords
// Create a pre-save middleware to hash the password before saving to the database.
userSchema.pre('save', async function (next) {
  // Only run this if password was modified.
  if (!this.isModified('password')) return next();

  // Create a new hash using bcrypt.
  this.password = await bcrypt.hash(this.password, 12);

  // Remove the confirm Password field from the document.
  this.confirmPassword = undefined;
  next();
});

// Video 137 Password Reset Functionality: Setting new password
// Create a pre-save middleware to hash the new password before saving to the database.
userSchema.pre('save', async function (next) {
  // Only run this if password was modified or if the document is new (i.e., not being updated)
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Video 140 Deleting the Current User
userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// Video 130 Logging in Users
// Create a instance method to compare the password with the hashed password.
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Video 132 Protecting Tour Routes Part 2
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < passwordChangedTimestamp;
  }
  return false;
};

// Video 135 Password reset functionality: Reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  // password reset expires after 10 minutes.
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
