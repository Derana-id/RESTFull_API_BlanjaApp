const express = require('express');

const jwtAuth = require('../middlewares/jwtAuth');
const { isSeller } = require('../middlewares/authorization');
const { product } = require('../validations/product.validation');
const validation = require('../middlewares/validation');
const multipleUpload = require('../middlewares/multipleUpload');
const {
  getAllProduct,
  getProductByUser,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  filter,
} = require('../controllers/product.controller');

const router = express.Router();
router
  .get('/product', getAllProduct)
  .get('/product/user', jwtAuth, isSeller, getProductByUser)
  .get('/product/:id', getProductById)
  .post('/product/filter', filter)
  .post(
    '/product',
    jwtAuth,
    isSeller,
    multipleUpload,
    product,
    validation,
    createProduct
  )
  .put(
    '/product/:id',
    jwtAuth,
    isSeller,
    multipleUpload,
    product,
    validation,
    updateProduct
  )
  .put('/product/delete/:id', jwtAuth, isSeller, deleteProduct);

module.exports = router;
