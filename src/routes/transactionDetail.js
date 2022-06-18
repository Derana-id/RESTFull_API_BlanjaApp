const express = require('express');
const {
  deleteTransactionAll,
  deleteTransactionId,
} = require('../controllers/transactionDetail.controller');

const jwtAuth = require('../middlewares/jwtAuth');
const { isBuyer } = require('../middlewares/authorization');

const router = express.Router();

router
  .put(
    '/transaction-detail/delete/all/:id',
    jwtAuth,
    isBuyer,
    deleteTransactionAll
  )
  .put('/transaction-detail/delete/:id', jwtAuth, isBuyer, deleteTransactionId);

module.exports = router;
