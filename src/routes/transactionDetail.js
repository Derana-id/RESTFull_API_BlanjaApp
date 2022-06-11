const express = require('express');
const {
  deleteTransactionAll,
  deleteTransactionId,
} = require('../controllers/transactionDetail.controller');

const jwtAuth = require('../middlewares/jwtAuth');
const { isBuyer, isAdmin } = require('../middlewares/authorization');

const router = express.Router();

router
  .put('/transaction-detail/delete/all/:id', jwtAuth, deleteTransactionAll)
  .put('/transaction-detail/delete/:id', jwtAuth, deleteTransactionId);

module.exports = router;
