const { v4: uuidv4 } = require('uuid');
const Sequelize = require('sequelize');
const { success, failed } = require('../helpers/response');
const Cart = require('../models/cart');
const ProductColor = require('../models/product_color');
const ProductImage = require('../models/product_image');
const ProductSize = require('../models/product_size');
const Product = require('../models/product');
const Store = require('../models/store');

module.exports = {
  getCartByUser: async (req, res) => {
    try {
      const { id } = req.APP_DATA.tokenDecoded;

      const cart = await Cart.findAll({
        where: {
          user_id: id,
          is_active: 1,
        },
      });

      if (!cart.length) {
        return failed(res, {
          code: 404,
          message: `Cart by user id ${id} not found`,
          error: 'Not Found',
        });
      }

      let getData = [];
      const data = await Promise.all(
        cart.map(async (item, index) => {
          const product = await Product.findAll({
            where: {
              id: item.product_id,
            },
          });

          const dataProduct = await Promise.all(
            product.map(async (e, i) => {
              const image = await ProductImage.findAll({
                where: {
                  product_id: e.id,
                },
              });

              const size = await ProductSize.findAll({
                where: {
                  product_id: e.id,
                },
              });

              const color = await ProductColor.findAll({
                where: {
                  product_id: e.id,
                },
              });

              const getStore = await Store.findAll({
                where: {
                  id: e.store_id,
                },
              });

              const obj = {
                cart: item,
                product,
                image,
                size,
                color,
                store: getStore,
              };

              return getData.push(obj);
            })
          );
        })
      );

      success(res, {
        code: 200,
        message: `Success get cart by user`,
        data: getData,
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
          is_active: 1,
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

      let { product_id, qty } = req.body;

      const checkCart = await Cart.findAll({
        where: {
          product_id: product_id,
          user_id: userId,
        },
      });

      if (checkCart.length) {
        const getQty = Number(checkCart[0].qty) + Number(qty);
        const data = {
          qty: getQty,
        };

        await Cart.update(data, {
          where: {
            id: checkCart[0].id,
          },
        });

        return success(res, {
          code: 200,
          message: 'Success Create Cart',
          data: null,
        });
      }

      const cart = {
        id: uuidv4(),
        user_id: userId,
        product_id,
        qty,
        is_active: 1,
      };

      await Cart.create(cart);

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

      if (!cart) {
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
      const userId = req.APP_DATA.tokenDecoded.id;

      // cek id params = id login
      if (id == userId) {
        const cart = await Cart.findAll({
          where: {
            user_id: id,
          },
        });

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
              user_id: id,
            },
          }
        );

        return success(res, {
          code: 200,
          message: 'Success Delete Cart',
          data: null,
        });
      } else {
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
      }
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
};
