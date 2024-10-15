const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = require('../controllers/userController');

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);

// Video 135 Password reset functionality: Reset token
router.post('/forgotPassword', forgotPassword);

// Video 136 Sending Emails with nodemailer
router.patch('/resetPassword/:token', resetPassword);

// Video 165 Adding Missing Authentication and Authorization
// Protect all routes after this middleware
router.use(protect);

// Video 138 Updating the current user password
router.patch('/updatePassword', updatePassword);

// Video 164 Adding a /me Endpoint
router.get('/me', getMe, getUserById);

// Video 139 Updating the current user data
router.patch('/updateMe', updateMe);

// Video 140 Deleting the Current User
router.delete('/deleteMe', deleteMe);

// Video 165 Adding Missing Authentication and Authorization
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = router;
