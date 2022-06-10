const express = require('express');
const {
  insertTransaction,
  updateTransaction,
  getAllTransaction,
  getTransactionId,
  deleteTransaction,
} = require('../controllers/transactionDetail.controller');

const jwtAuth = require('../middlewares/jwtAuth');
const { isBuyer, isAdmin } = require('../middlewares/authorization');

const validation = require('../middlewares/validation');

const router = express.Router();

router
  .post('/transaction-detail', insertTransaction)
  .put('/transaction-detail', updateTransaction)
  .get('/transaction-detail', getAllTransaction)
  .get('/transaction-detail/:id', getTransactionId)
  .put('/transaction-detail/delete', deleteTransaction);

module.exports = router;
