const express = require('express');

// const { isVerified } = require('../middlewares/authorizations');
// const {
//   register,
//   registers,
//   login,
//   forgot,
//   reset,
// } = require('../validations/auth.validation');
// const validation = require('../middlewares/validation');
const {
  registerBuyer,
  registerSeller,
} = require('../controllers/auth.controller');

const router = express.Router();

router
  .post('/auth/register-buyer', registerBuyer)
  .post('/auth/register-seller', registerSeller);

module.exports = router;
