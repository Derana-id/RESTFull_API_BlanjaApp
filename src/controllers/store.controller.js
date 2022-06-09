const User = require('../models/user.model');
const Store = require('../models/store.model');
const { success, failed } = require('../helpers/response');
const deleteFile = require('../utils/deleteFile');

module.exports = {
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;

      const store = await Store.findAll({
        where: {
          user_id: id,
        },
      });

      if (!store.length) {
        return failed(res, {
          code: 404,
          message: `Store by id ${id} not found`,
          error: 'Not Found',
        });
      }

      const user = await User.findAll({
        where: {
          id,
        },
      });

      if (!user.length) {
        return failed(res, {
          code: 404,
          message: `Store by id ${id} not found`,
          error: 'Not Found',
        });
      }

      const data = {
        store: store[0],
        user: user[0],
      };

      return success(res, {
        code: 200,
        message: `Success get store by id`,
        data,
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  updateStore: async (req, res) => {
    try {
      const { id } = req.APP_DATA.tokenDecoded;

      const { name, store_name, email, store_phone, store_description } = req.body;

      const store = await Store.findAll({
        where: {
          user_id: id,
        },
      });

      if (!store.length) {
        if (req.file) {
          deleteFile(`public/uploads/users/${req.file.filename}`);
        }
        return failed(res, {
          code: 404,
          message: `Store by id ${id} not found`,
          error: 'Not Found',
        });
      }

      let { photo } = store[0];
      if (req.file) {
        if (photo !== 'default.png') {
          deleteFile(`public/uploads/users/${photo}`);
        }
        photo = req.file.filename;
      }

      await Store.update(
        {
          name,
          store_name,
          store_phone,
          store_description,
          photo
        },
        {
          where: {
            user_id: id,
          },
        }
      );

      await User.update(
        {
          email,
        },
        {
          where: {
            id,
          },
        }
      );

      return success(res, {
        code: 200,
        message: 'Success Edit Store',
        data: null,
      });
    } catch (error) {
      if (req.file) {
        deleteFile(`public/uploads/users/${req.file.filename}`);
      }
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
};
