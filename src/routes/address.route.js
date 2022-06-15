const express = require('express');
const {
  getAllmyAddress,
  getAddressById,
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
  .get('/myaddress', jwtAuth, isBuyer, getAllmyAddress)
  .get('/address/detail/:id', jwtAuth, getAddressById)
  .post(
    '/address',
    jwtAuth,
    isBuyer,
    insertValidation,
    validation,
    insertAddress
  )
  .put(
    '/address/:id',
    jwtAuth,
    isBuyer,
    updateValidation,
    validation,
    updateAddress
  )
  .put('/address/delete/:id', jwtAuth, isBuyer, deleteAddress);

module.exports = router;
