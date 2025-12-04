// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  signup,
  verifyOTP,
  login,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

router.post('/signup', signup);            // create user & send OTP
router.post('/verify-otp', verifyOTP);    // verify signup OTP -> returns token
router.post('/login', login);             // email + password -> token
router.post('/forgot-password', forgotPassword); // send OTP for reset
router.post('/reset-password', resetPassword);   // verify OTP + new password -> token

module.exports = router;
