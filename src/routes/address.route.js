const express = require('express');
const {
  getAllAddress,
  insertAddress,
  updateAddress,
  deleteAddress,
} = require('../controllers/address.controller');
const {
  insertValidation,
  updateValidation,
} = require('../validations/address.validation');
const validation = require('../middlewares/validation');
const jwtAuth = require('../middlewares/jwtAuth');
const { isBuyer } = require('../middlewares/authorization');

const router = express.Router();

router
  .get('/address/:userId', getAllAddress)
  .post(
    '/address',
    insertValidation,
    validation,
    jwtAuth,
    // isBuyer,
    insertAddress
  )
  .put(
    '/address',
    updateValidation,
    validation,
    jwtAuth,
    // isBuyer,
    updateAddress
  )
  .put('/address/:id', deleteAddress);

module.exports = router;
