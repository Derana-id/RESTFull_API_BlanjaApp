const Address = require('../models/address');
const { v4: uuidv4 } = require('uuid');
const { success, failed } = require('../helpers/response');
const Sequelize = require('sequelize');
const pagination = require('../utils/pagination');

module.exports = {
  getAllmyAddress: async (req, res) => {
    try {
      const Op = Sequelize.Op;
      const userId = req.APP_DATA.tokenDecoded.id;
      let { page, limit, search, sort, sortType } = req.query;
      page = Number(page) || 1;
      limit = Number(limit) || 10;
      sort = sort || 'label';
      sortType = sortType || 'ASC';

      const offset = (page - 1) * limit;
      const result = await Address.findAndCountAll({
        where: {
          is_active: 1,
          user_id: userId,
        },
        order: [[`${sort}`, `${sortType}`]],
        limit,
        offset,
      });
      if (!result.count) {
        return failed(res, {
          code: 404,
          message: 'Addres Not Found',
          error: 'Not Found',
        });
      }
      const paging = pagination(result.count, page, limit);
      return success(res, {
        code: 200,
        message: `Success get all my address by user id ${userId}`,
        data: result.rows,
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
  getAddressById: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await Address.findByPk(id);
      // console.log(result.dataValues);
      return success(res, {
        code: 200,
        message: `Success get address by id ${id}`,
        data: result,
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  insertAddress: async (req, res) => {
    try {
      const id = uuidv4();
      const userId = req.APP_DATA.tokenDecoded.id;
      let {
        label,
        recipientName,
        recipientPhone,
        address,
        postalCode,
        city,
        isPrimary,
      } = req.body;

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

      const data = {
        id: id,
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
      const result = await Address.create(data);
      return success(res, {
        code: 200,
        message: `Success insert address`,
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
  updateAddress: async (req, res) => {
    try {
      const userId = req.APP_DATA.tokenDecoded.id;
      const id = req.params.id;
      let {
        label,
        recipientName,
        recipientPhone,
        address,
        postalCode,
        city,
        isPrimary,
      } = req.body;

      const checkIdAddress = await Address.findAll({
        where: {
          id,
        },
      });

      if (!checkIdAddress.length) {
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

      if (isPrimary === 0) {
        const checkIsPrimary = await Address.findAll({
          where: {
            user_id: userId,
            is_primary: 1,
          },
        });
        if (!checkIsPrimary.length) {
          isPrimary = 1;
        }
      }

      const data = {
        label: label,
        recipient_name: recipientName,
        recipient_phone: recipientPhone,
        address: address,
        postal_code: postalCode,
        city: city,
        is_primary: isPrimary,
        is_active: 1,
      };
      const result = await Address.update(data, {
        where: {
          id: id,
        },
      });

      return success(res, {
        code: 200,
        message: `Success update address`,
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
  deleteAddress: async (req, res) => {
    try {
      const id = req.params.id;

      const checkAddress = await Address.findByPk(id);

      if (!checkAddress) {
        return failed(res, {
          code: 409,
          message: 'Id not found',
          error: 'Delete Failed',
        });
      }

      if (checkAddress.dataValues.is_primary === 1) {
        return failed(res, {
          code: 409,
          message: 'This address is primary',
          error: 'Delete Failed',
        });
      }

      const data = {
        is_active: 0,
      };

      const result = await Address.update(data, {
        where: {
          id: id,
        },
      });

      return success(res, {
        code: 200,
        message: `Success delete address`,
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
