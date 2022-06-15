const express = require('express');

const jwtAuth = require('../middlewares/jwtAuth');
const { isSeller } = require('../middlewares/authorization');
const { product } = require('../validations/product.validation');
const validation = require('../middlewares/validation');
const upload = require('../middlewares/uploads');
const {
  getAllProduct,
  getProductByUser,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

const router = express.Router();
router
  .get('/product', getAllProduct)
  .get('/product/user', jwtAuth, isSeller, getProductByUser)
  .get('/product/:id', getProductById)
  .post(
    '/product',
    jwtAuth,
    isSeller,
    upload,
    product,
    validation,
    createProduct
  )
  .put(
    '/product/:id',
    jwtAuth,
    isSeller,
    upload,
    product,
    validation,
    updateProduct
  )
  .put('/product/delete/:id', jwtAuth, isSeller, deleteProduct);

module.exports = router;
