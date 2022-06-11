const express = require('express');
const {
  insertTrunsaction,
  updateTransaction,
  updatePayment,
  getAllTransaction,
  getMyTransaction,
  getTransactionId,
  deleteTransaction,
} = require('../controllers/transaction.controller');
const jwtAuth = require('../middlewares/jwtAuth');
const { isBuyer, isAdmin } = require('../middlewares/authorization');

const {
  insertValidation,
  updateValidation,
  paymentValidation,
} = require('../validations/transaction.validation');
const validation = require('../middlewares/validation');

const router = express.Router();

router
  .post(
    '/transaction/:id',
    jwtAuth,
    isBuyer,
    insertValidation,
    validation,
    insertTrunsaction
  )
  .put(
    '/transaction/address/:id',
    jwtAuth,
    isBuyer,
    updateValidation,
    validation,
    updateTransaction
  )
  .put(
    '/transaction/payment/:id',
    jwtAuth,
    isBuyer,
    paymentValidation,
    validation,
    updatePayment
  )
  .get(
    '/transaction',
    jwtAuth,
    // isAdmin,
    getAllTransaction
  )
  .get('/mytransaction', jwtAuth, isBuyer, getMyTransaction)
  .get('/transaction/:id', jwtAuth, getTransactionId)
  .put('/transaction/delete/:id', jwtAuth, isBuyer, deleteTransaction);

module.exports = router;
