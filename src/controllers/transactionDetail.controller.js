const TrunsactionDetail = require('../models/transaction_detail');
const Product = require('../models/product');
const { v4: uuidv4 } = require('uuid');
const { success, failed } = require('../helpers/response');

module.exports = {
  insertTransaction: async (req, res) => {
    try {
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
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
};
