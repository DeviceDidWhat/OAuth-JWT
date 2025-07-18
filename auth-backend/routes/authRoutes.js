const express = require('express');
const passport = require('passport');
const router = express.Router();
const {
  register,
  login,
  logout,
  refresh,
  getMe,
  callback
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', protect, getMe);

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

router.get('/google/callback', passport.authenticate('google', {
  session: false,
  failureRedirect: 'http://localhost:3000/login',
}), callback);


module.exports = router;