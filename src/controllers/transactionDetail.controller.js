const TrunsactionDetail = require('../models/transaction_detail');
const { success, failed } = require('../helpers/response');

module.exports = {
  deleteTransactionAll: async (req, res) => {
    try {
      const transactionId = req.params.id;
      const data = {
        is_active: 0,
      };
      const result = await TrunsactionDetail.update(data, {
        where: {
          transaction_id: transactionId,
        },
      });
      if (!result.length) {
        return failed(res, {
          code: 409,
          message: `Transaction id ${transactionId} not found`,
          error: 'Delete Failed',
        });
      }
      return success(res, {
        code: 200,
        message: `Success delete detail transaction with transaction id ${transactionId}`,
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
  deleteTransactionId: async (req, res) => {
    try {
      const id = req.params.id;
      const data = {
        is_active: 0,
      };
      const result = await TrunsactionDetail.update(data, {
        where: {
          transaction_id: id,
        },
      });
      if (!result.length) {
        return failed(res, {
          code: 409,
          message: `Detail Transaction id ${id} not found`,
          error: 'Delete Failed',
        });
      }
      return success(res, {
        code: 200,
        message: `Success delete detail transaction with id ${id}`,
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
};
