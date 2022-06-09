const express = require('express');

const { isVerified } = require('../middlewares/authorization');
const {
  registerProfile,
  registerStore,
  login,
  forgot,
  reset,
} = require('../validations/auth.validation');
const validation = require('../middlewares/validation');
const {
  registerBuyer,
  registerSeller,
  activation,
  loginAccount,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');

const router = express.Router();

router
  .post('/auth/register-buyer', registerProfile, validation, registerBuyer)
  .post('/auth/register-seller', registerStore, validation, registerSeller)
  .get('/auth/activation/:token', activation)
  .post('/auth/login', isVerified, login, validation, loginAccount)
  .put('/auth/forgot', isVerified, forgot, validation, forgotPassword)
  .put('/auth/reset/:token', reset, validation, resetPassword);

module.exports = router;
