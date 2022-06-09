const express = require('express');

const jwtAuth = require('../middlewares/jwtAuth');
const { isSeller } = require('../middlewares/authorization');
// const { update } = require('../validations/product.validation');
// const validation = require('../middlewares/validation');
const upload = require('../middlewares/uploadProduct');
const {
  getAllProduct,
  createProduct,
  updateProduct,
} = require('../controllers/product.controller');

const router = express.Router();
router
  .get('/product', jwtAuth, getAllProduct)
  .post('/product', jwtAuth, createProduct)
  .put('/product/:id', jwtAuth, updateProduct);

module.exports = router;
