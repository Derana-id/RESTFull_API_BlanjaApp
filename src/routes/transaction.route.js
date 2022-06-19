const express = require('express');
const {
  insertTransaction,
  updateTransaction,
  updatePayment,
  getAllTransaction,
  getTransactionId,
  deleteTransaction,
  postNotifMidtrans,
  getTransactionByStore,
  updateStatus,
} = require('../controllers/transaction.controller');
const jwtAuth = require('../middlewares/jwtAuth');
const { isBuyer, isAdmin, isSeller } = require('../middlewares/authorization');

const {
  insertValidation,
  updateValidation,
  paymentValidation,
} = require('../validations/transaction.validation');
const validation = require('../middlewares/validation');

const router = express.Router();

router
  .post('/transaction/midtrans-notification', postNotifMidtrans)
  .post(
    '/transaction',
    jwtAuth,
    isBuyer,
    insertValidation,
    validation,
    insertTransaction
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
  .put('/transaction/status/:id', jwtAuth, isSeller, updateStatus)
  .get('/transaction', jwtAuth, getAllTransaction)
  .get('/transaction/status', jwtAuth, isSeller, getTransactionByStore)
  .get('/transaction/:id', jwtAuth, getTransactionId)
  .put('/transaction/delete/:id', jwtAuth, isBuyer, deleteTransaction);

module.exports = router;
