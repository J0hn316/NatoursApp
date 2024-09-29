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
} = require('../controllers/userController');

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);

// Video 135 Password reset functionality: Reset token
router.post('/forgotPassword', forgotPassword);

// Video 136 Sending Emails with nodemailer
router.patch('/resetPassword/:token', resetPassword);

// Video 138 Updating the current user password
router.patch('/updatePassword', protect, updatePassword);

// Video 139 Updating the current user data
router.patch('/updateMe', protect, updateMe);

// Video 140 Deleting the Current User
router.delete('/deleteMe', protect, deleteMe);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = router;
