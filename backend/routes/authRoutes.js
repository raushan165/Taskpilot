const express = require('express');
const router = express.Router();
const { signup, verifySignup, forgotPassword, resetPassword, login } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/verify-signup', verifySignup);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// ADDED LOGIN ROUTE
router.post('/login', login);
router.post('/google-login', require('../controllers/authController').googleLogin);

module.exports = router;