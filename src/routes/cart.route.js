const express = require('express');

const jwtAuth = require('../middlewares/jwtAuth');
const { isBuyer } = require('../middlewares/authorization');
const { cart } = require('../validations/cart.validation');
const validation = require('../middlewares/validation');
const {
  getCartByUser,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
} = require('../controllers/cart.controller');

const router = express.Router();
router
  .get('/cart/user', jwtAuth, isBuyer, getCartByUser)
  .get('/cart/:id', jwtAuth, getCartById)
  .post('/cart', jwtAuth, isBuyer, cart, validation, createCart)
  .put('/cart/:id', jwtAuth, isBuyer, cart, validation, updateCart)
  .put('/cart/delete/:id', jwtAuth, isBuyer, deleteCart);

module.exports = router;
