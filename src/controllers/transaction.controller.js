const Transaction = require('../models/transaction');
const TransactionDetail = require('../models/transaction_detail');
const Product = require('../models/product.js');
const ProductColor = require('../models/product_color');
const ProductImage = require('../models/product_image');
const ProductSize = require('../models/product_size');
const Address = require('../models/address');
const { v4: uuidv4 } = require('uuid');
const { success, failed } = require('../helpers/response');
const Sequelize = require('sequelize');
const pagination = require('../utils/pagination');
const { post, notif } = require('../utils/midtrans');
const Op = Sequelize.Op;

module.exports = {
  insertTransaction: async (req, res) => {
    try {
      const userId = req.APP_DATA.tokenDecoded.id;
      const productId = req.params.id;
      let { price, qty } = req.body;
      price = Number(price);
      qty = Number(qty);

      const checkStock = await Product.findAll({
        where: {
          id: productId,
        },
      });

      if (!checkStock.length) {
        return failed(res, {
          code: 409,
          message: 'Id not found',
          error: 'Insert Failed',
        });
      }

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
      // console.log(address[0].dataValues);

      let data;
      const transactionId = uuidv4();
      if (!address.length) {
        data = {
          id: transactionId,
          user_id: userId,
          invoice: `INV-${getDate}`,
          date: getDate,
          total: total,
          status: 0,
          is_active: 1,
        };
      } else {
        data = {
          id: transactionId,
          user_id: userId,
          invoice: `invoice${getDate}`,
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
      const midtransNotif = await createTransaction(transData);

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
      let {
        label,
        recipientName,
        recipientPhone,
        address,
        postalCode,
        city,
        isPrimary,
      } = req.body;

      const checkTransactionId = await Transaction.findAll({
        where: {
          id: transactionId,
        },
      });
      if (!checkTransactionId.length) {
        return failed(res, {
          code: 409,
          message: 'Id not found',
          error: 'Update Failed',
        });
      }

      const checkAddress = await Address.findAll({
        where: {
          user_id: userId,
        },
      });
      if (!checkAddress.length) {
        isPrimary = 1;
      }

      if (isPrimary === 1) {
        const setPrimary = {
          is_primary: 0,
        };
        await Address.update(setPrimary, {
          where: {
            user_id: userId,
          },
        });
      }

      const dataTransaction = {
        label: label,
        recipient_name: recipientName,
        recipient_phone: recipientPhone,
        address: address,
        postal_code: postalCode,
        city: city,
      };

      const addressId = uuidv4();
      const dataAddress = {
        id: addressId,
        user_id: userId,
        label: label,
        recipient_name: recipientName,
        recipient_phone: recipientPhone,
        address: address,
        postal_code: postalCode,
        city: city,
        is_primary: isPrimary,
        is_active: 1,
      };
      await Address.create(dataAddress);
      const updateTransaction = await Transaction.update(dataTransaction, {
        where: {
          id: transactionId,
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
      const userId = req.APP_DATA.tokenDecoded.id;
      const transactionId = req.params.id;
      const { paymentMethod } = req.body;

      const data = {
        payment_method: paymentMethod,
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
      let { page, limit, search, sort, sortType } = req.query;
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

      const result = await Transaction.findAndCountAll({
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

                  const obj = {
                    transaction: item,
                    transactionDetail: element,
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
  getMyTransaction: async (req, res) => {
    try {
      const userId = req.APP_DATA.tokenDecoded.id;
      let { page, limit, search, sort, sortType } = req.query;
      page = Number(page) || 1;
      limit = Number(limit) || 10;
      sort = sort || 'recipient_name';
      sortType = sortType || 'ASC';

      const condition = search
        ? {
            recipient_name: { [Op.iLike]: `%${search}%` },
            is_active: 1,
            user_id: userId,
          }
        : null;

      const offset = (page - 1) * limit;

      const result = await Transaction.findAndCountAll({
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

                  const obj = {
                    transaction: item,
                    transactionDetail: element,
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
        message: `Success get my transaction`,
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

      const data = {
        transaction: result,
        transactionDetail,
        product,
        color,
        image,
        size,
      };

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
          code: 409,
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
      } else if (transactionStatus === 'cancel' || transactionStatus === 'expire') {
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
};
