const { v4: uuidv4 } = require('uuid');
const Sequelize = require('sequelize');
const { success, failed } = require('../helpers/response');
const Cart = require('../models/cart');
const Buyer = require('../models/profile');
const Product = require('../models/product');

module.exports = {
  getCartByUser: async (req, res) => {
    try {
      const { id } = req.APP_DATA.tokenDecoded;

      const buyer = await Buyer.findAll({
        where: {
          user_id: id,
        },
      });

      const cart = await Cart.findAll({
        where: {
          user_id: buyer[0].id,
        },
      });

      if (!cart.length) {
        return failed(res, {
          code: 404,
          message: `Cart by id ${id} not found`,
          error: 'Not Found',
        });
      }

      const product = await Product.findAll({
        where: {
          id: cart[0].product_id,
        },
      });

      success(res, {
        code: 200,
        message: `Success get cart by user`,
        data: {
          cart,
          product,
        },
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  getCartById: async (req, res) => {
    try {
      const { id } = req.params;

      const cart = await Cart.findAll({
        where: {
          id,
        },
      });

      if (!cart.length) {
        return failed(res, {
          code: 404,
          message: `Cart by id ${id} not found`,
          error: 'Not Found',
        });
      }

      const product = await Product.findAll({
        where: {
          id: cart[0].product_id,
        },
      });

      success(res, {
        code: 200,
        message: `Success get user by id`,
        data: {
          cart: cart[0],
          product,
        },
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  createCart: async (req, res) => {
    try {
      const userId = req.APP_DATA.tokenDecoded.id;

      const buyer = await Buyer.findAll({
        where: {
          user_id: userId,
        },
      });

      const { product_id, qty } = req.body;

      const cart = {
        id: uuidv4(),
        user_id: buyer[0].id,
        product_id,
        qty,
        is_active: 1,
      };

      await Product.create(cart);

      return success(res, {
        code: 200,
        message: 'Success Create Cart',
        data: null,
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  updateCart: async (req, res) => {
    try {
      const { id } = req.params;

      const cart = await Cart.findByPk(id);

      if (!cart.length) {
        return failed(res, {
          code: 404,
          message: `Cart by id ${id} not found`,
          error: 'Not Found',
        });
      }

      const { product_id, qty } = req.body;

      const data = {
        product_id,
        qty,
      };

      await Cart.update(data, {
        where: {
          id,
        },
      });

      return success(res, {
        code: 200,
        message: 'Success Edit Cart',
        data: null,
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  deleteCart: async (req, res) => {
    try {
      const { id } = req.params;

      const cart = await Cart.findByPk(id);

      if (!cart.length) {
        return failed(res, {
          code: 404,
          message: `Cart by id ${id} not found`,
          error: 'Not Found',
        });
      }

      await Cart.update(
        {
          is_active: 0,
        },
        {
          where: {
            id,
          },
        }
      );

      return success(res, {
        code: 200,
        message: 'Success Delete Cart',
        data: null,
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
};
