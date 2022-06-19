const Transaction = require('../models/transaction');
const TransactionDetail = require('../models/transaction_detail');
const Product = require('../models/product.js');
const ProductColor = require('../models/product_color');
const ProductImage = require('../models/product_image');
const ProductSize = require('../models/product_size');
const Address = require('../models/address');
const Cart = require('../models/cart');
const Store = require('../models/store.js');
const { v4: uuidv4 } = require('uuid');
const { success, failed } = require('../helpers/response');
const Sequelize = require('sequelize');
const pagination = require('../utils/pagination');
const { post, notif } = require('../utils/midtrans');
const Op = Sequelize.Op;
const RandomCodes = require('random-codes');

module.exports = {
  insertTransaction: async (req, res) => {
    try {
      const userId = req.APP_DATA.tokenDecoded.id;
      let { qty, isBuy, productId } = req.body;

      const checkStock = await Product.findAll({
        where: {
          id: productId,
        },
      });

      if (!checkStock.length) {
        return failed(res, {
          code: 404,
          message: 'Id not found',
          error: 'Insert Failed',
        });
      }

      let price = checkStock[0].price;

      if (isBuy == 0) {
        const cartCheck = await Cart.findAll({
          where: {
            product_id: productId,
            user_id: userId,
          },
        });
        if (!cartCheck.length) {
          return failed(res, {
            code: 404,
            message: 'Id not found',
            error: 'Insert Failed',
          });
        }

        // set qty
        qty = cartCheck[0].qty;

        // delete cart id
        await Cart.destroy({
          where: {
            id: cartCheck[0].id,
          },
        });
      }
      price = Number(price);
      qty = Number(qty);

      const date = new Date();
      const dateOffset = new Date(
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
      );
      const getDate = dateOffset.toISOString();

      const total = price * qty;

      const address = await Address.findAll({
        where: {
          is_primary: 1,
          user_id: userId,
        },
      });

      const config = {
        chars: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        separator: '-',
        mask: '*',
        parts: 3,
        part_size: 4,
        getChar: function (pool) {
          var random = Math.floor(Math.random() * pool.length);
          return pool.charAt(random);
        },
      };
      const rc = new RandomCodes(config);

      let data;
      const code = rc.generate();
      const transactionId = uuidv4();
      if (!address.length) {
        data = {
          id: transactionId,
          user_id: userId,
          invoice: code,
          date: getDate,
          total: total,
          status: 0,
          is_active: 1,
          is_payment: 0,
        };
      } else {
        data = {
          id: transactionId,
          user_id: userId,
          invoice: code,
          date: getDate,
          total: total,
          status: 0,
          label: address[0].dataValues.label,
          recipient_name: address[0].dataValues.recipient_name,
          recipient_phone: address[0].dataValues.recipient_phone,
          address: address[0].dataValues.address,
          postal_code: address[0].dataValues.postal_code,
          city: address[0].dataValues.city,
          is_active: 1,
          is_payment: 0,
        };
      }

      await Transaction.create(data);

      const dataTransactionDetail = {
        id: uuidv4(),
        transaction_id: transactionId,
        product_id: productId,
        price: total,
        qty: qty,
        is_active: 1,
      };
      await TransactionDetail.create(dataTransactionDetail);

      const getStock = Number(checkStock[0].stock);

      if (getStock - qty < 0) {
        return failed(res, {
          code: 409,
          message: 'Not enough stock',
          error: 'Insert Failed',
        });
      }

      const stock = getStock - qty;
      const setStock = {
        stock: stock,
      };
      await Product.update(setStock, {
        where: {
          id: productId,
        },
      });

      // configurate midtrans
      const transData = {
        id: transactionId,
        amount: total,
      };
      const midtransNotif = await post(transData);

      return success(res, {
        code: 200,
        message: `Please complete your payment`,
        data: {
          redirectUrl: midtransNotif,
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
  updateTransaction: async (req, res) => {
    try {
      const userId = req.APP_DATA.tokenDecoded.id;
      const transactionId = req.params.id;
      let { addressId } = req.body;

      const checkTransactionId = await Transaction.findAll({
        where: {
          id: transactionId,
        },
      });
      if (!checkTransactionId.length) {
        return failed(res, {
          code: 404,
          message: 'Id not found',
          error: 'Update Failed',
        });
      }

      const checkAddress = await Address.findAll({
        where: {
          id: addressId,
        },
      });
      if (!checkAddress.length) {
        return failed(res, {
          code: 404,
          message: `Id addres ${addressId} not found`,
          error: 'Update Failed',
        });
      }

      const dataTransaction = {
        label: checkAddress[0].label,
        recipient_name: checkAddress[0].recipient_name,
        recipient_phone: checkAddress[0].recipient_phone,
        address: checkAddress[0].address,
        postal_code: checkAddress[0].postal_code,
        city: checkAddress[0].city,
      };

      await Transaction.update(dataTransaction, {
        where: {
          user_id: userId,
          is_payment: 0,
        },
      });

      return success(res, {
        code: 200,
        message: `Success update transaction`,
        data: dataTransaction,
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  updatePayment: async (req, res) => {
    try {
      // const userId = req.APP_DATA.tokenDecoded.id;
      const transactionId = req.params.id;
      const { paymentMethod } = req.body;

      const data = {
        payment_method: paymentMethod,
        is_payment: 1,
      };

      const result = await Transaction.update(data, {
        where: {
          id: transactionId,
        },
      });

      return success(res, {
        code: 200,
        message: `Success update transaction payment`,
        data: data,
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  getAllTransaction: async (req, res) => {
    try {
      const userId = req.APP_DATA.tokenDecoded.id;
      const level = req.APP_DATA.tokenDecoded.level;
      let { page, limit, search, sort, sortType } = req.query;
      const { isPayment, status } = req.query;
      page = Number(page) || 1;
      limit = Number(limit) || 10;
      sort = sort || 'recipient_name';
      sortType = sortType || 'ASC';

      const condition = search
        ? {
            [Op.or]: [
              {
                recipient_name: { [Op.iLike]: `%${search}%` },
              },
              {
                city: { [Op.iLike]: `%${search}%` },
              },
              {
                address: { [Op.iLike]: `%${search}%` },
              },
            ],
          }
        : null;

      const offset = (page - 1) * limit;

      let result;

      if (level == 2) {
        if (isPayment == 0) {
          result = await Transaction.findAndCountAll({
            where: {
              is_active: 1,
              user_id: userId,
              is_payment: 0,
            },
            order: [[`${sort}`, `${sortType}`]],
            limit,
            offset,
          });
          if (!result.count) {
            return failed(res, {
              code: 404,
              message: 'Transaction Not Found',
              error: 'Not Found',
            });
          }
        }

        if (isPayment == 1) {
          result = await Transaction.findAndCountAll({
            where: {
              is_active: 1,
              user_id: userId,
              is_payment: 1,
            },
            order: [[`${sort}`, `${sortType}`]],
            limit,
            offset,
          });
          if (!result.count) {
            return failed(res, {
              code: 404,
              message: 'Transaction Not Found',
              error: 'Not Found',
            });
          }
        }
      } else if (level == 1) {
        result = await Transaction.findAndCountAll({
          where: {
            status: status,
            is_active: 1,
          },
          order: [[`${sort}`, `${sortType}`]],
          limit,
          offset,
        });
        if (!result.count) {
          return failed(res, {
            code: 404,
            message: 'Transaction Not Found',
            error: 'Not Found',
          });
        }
      } else {
        result = await Transaction.findAndCountAll({
          where: condition,
          order: [[`${sort}`, `${sortType}`]],
          limit,
          offset,
        });
        if (!result.count) {
          return failed(res, {
            code: 404,
            message: 'Transaction Not Found',
            error: 'Not Found',
          });
        }
      }

      let getData = [];
      const data = await Promise.all(
        result.rows.map(async (item) => {
          const transactionDetail = await TransactionDetail.findAll({
            where: {
              transaction_id: item.id,
            },
          });

          const dataDetailTransaction = await Promise.all(
            transactionDetail.map(async (element) => {
              const product = await Product.findAll({
                where: {
                  id: element.product_id,
                },
              });

              const dataProduct = await Promise.all(
                product.map(async (e) => {
                  const color = await ProductColor.findAll({
                    where: {
                      product_id: e.id,
                    },
                  });

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

                  const store = await Store.findAll({
                    where: {
                      id: e.store_id,
                    },
                  });

                  const obj = {
                    transaction: item,
                    transactionDetail: element,
                    store,
                    product: e,
                    color,
                    image,
                    size,
                  };

                  return getData.push(obj);
                })
              );
            })
          );
        })
      );

      const paging = pagination(result.count, page, limit);
      return success(res, {
        code: 200,
        message: `Success get all address`,
        data: getData,
        pagination: paging.response,
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  getTransactionId: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await Transaction.findByPk(id);

      const transactionDetail = await TransactionDetail.findAll({
        where: {
          transaction_id: id,
        },
      });

      const product = await Product.findAll({
        where: {
          id: transactionDetail[0].product_id,
        },
      });

      const color = await ProductColor.findAll({
        where: {
          product_id: product[0].id,
        },
      });

      const image = await ProductImage.findAll({
        where: {
          product_id: product[0].id,
        },
      });

      const size = await ProductSize.findAll({
        where: {
          product_id: product[0].id,
        },
      });

      const data = [
        {
          transaction: result,
          transactionDetail,
          product,
          color,
          image,
          size,
        },
      ];

      return success(res, {
        code: 200,
        message: `Success get transaction by id ${id}`,
        data: data,
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  deleteTransaction: async (req, res) => {
    try {
      const transactionId = req.params.id;
      const data = {
        is_active: 0,
      };
      const result = await Transaction.update(data, {
        where: {
          id: transactionId,
        },
      });
      if (!result.length) {
        return failed(res, {
          code: 404,
          message: 'Id not found',
          error: 'Delete Failed',
        });
      }
      return success(res, {
        code: 200,
        message: `Success delete transaction with id ${transactionId}`,
        data: [],
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  postNotifMidtrans: async (req, res) => {
    try {
      const notifMidtrans = await notif(req.body);
      const { orderId, transactionStatus, fraudStatus } = notifMidtrans;

      if (transactionStatus === 'capture') {
        if (fraudStatus === 'challenge') {
          await Transaction.update(
            {
              transaction_status: 'challenge',
            },
            {
              where: {
                id: orderId,
              },
            }
          );
        } else if (fraudStatus === 'accept') {
          await Transaction.update(
            {
              transaction_status: 'success',
            },
            {
              where: {
                id: orderId,
              },
            }
          );
        }
      } else if (transactionStatus === 'settlement') {
        await Transaction.update(
          {
            transaction_status: 'success',
          },
          {
            where: {
              id: orderId,
            },
          }
        );
      } else if (transactionStatus === 'deny') {
        await Transaction.update(
          {
            transaction_status: 'failed',
          },
          {
            where: {
              id: orderId,
            },
          }
        );
      } else if (
        transactionStatus === 'cancel' ||
        transactionStatus === 'expire'
      ) {
        await Transaction.update(
          {
            transaction_status: 'failed',
          },
          {
            where: {
              id: orderId,
            },
          }
        );
      } else if (transactionStatus === 'pending') {
        await Transaction.update(
          {
            transaction_status: 'pending',
          },
          {
            where: {
              id: orderId,
            },
          }
        );
      }

      return success(res, {
        code: 200,
        message: 'Transaction Successfully',
        data: notifMidtrans,
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  updateStatus: async (req, res) => {
    try {
      const transactionId = req.params.id;
      const { status } = req.body;

      const checkTransaction = await Transaction.findAll({
        where: {
          id: transactionId,
          is_active: 1,
        },
      });

      if (!checkTransaction.length) {
        return failed(res, {
          code: 404,
          message: `Id ${transactionId} not found`,
          error: 'Update status Failed',
        });
      }

      const data = {
        status,
      };
      await Transaction.update(data, {
        where: {
          id: transactionId,
        },
      });

      return success(res, {
        code: 200,
        message: 'Update Status Transaction Successfully',
        data: [],
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  getTransactionByStore: async (req, res) => {
    try {
      const userId = req.APP_DATA.tokenDecoded.id;

      const store = await Store.findAll({
        where: {
          user_id: userId,
        },
      });

      if (!store.length) {
        return failed(res, {
          code: 404,
          message: `Store with user id ${userId} not found`,
          error: 'Get transaction by product store failed',
        });
      }

      let getData = [];
      const data = await Promise.all(
        store.map(async (item) => {
          const product = await Product.findAll({
            where: {
              store_id: item.id,
            },
          });

          const dataProduct = await Promise.all(
            product.map(async (element) => {
              const transactionDetail = await TransactionDetail.findAll({
                where: {
                  product_id: element.id,
                },
              });
              console.log(element);

              const dataTransactionDetail = await Promise.all(
                transactionDetail.map(async (el) => {
                  const transaction = await Transaction.findAll({
                    where: {
                      id: el.transaction_id,
                    },
                  });

                  const color = await ProductColor.findAll({
                    where: {
                      product_id: element.id,
                    },
                  });

                  const image = await ProductImage.findAll({
                    where: {
                      product_id: element.id,
                    },
                  });

                  const size = await ProductSize.findAll({
                    where: {
                      product_id: element.id,
                    },
                  });

                  const obj = {
                    transaction,
                    product: element,
                    color,
                    size,
                    image,
                  };

                  return getData.push(obj);
                })
              );
            })
          );
        })
      );
      return success(res, {
        code: 200,
        message: 'Get All Transaction Success',
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
};
