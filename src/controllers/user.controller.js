const User = require('../models/user');
const Profile = require('../models/profile');
const Store = require('../models/store');
const { success, failed } = require('../helpers/response');
const deleteFile = require('../utils/deleteFile');
const Sequelize = require('sequelize');
const pagination = require('../utils/pagination');
const uploadGoogleDrive = require('../utils/uploadGoogleDrive');
const deleteGoogleDrive = require('../utils/deleteGoogleDrive');
const Op = Sequelize.Op;

module.exports = {
  getAllStore: async (req, res) => {
    try {
      let { page, limit, search, sort, sortType } = req.query;
      page = Number(page) || 1;
      limit = Number(limit) || 10;
      sort = sort || 'store_name';
      sortType = sortType || 'ASC';

      const condition = search
        ? {
            [Op.or]: [
              {
                name: { [Op.iLike]: `%${search}%` },
              },
              {
                store_name: { [Op.iLike]: `%${search}%` },
              },
            ],
          }
        : null;

      const offset = (page - 1) * limit;

      const result = await Store.findAndCountAll({
        where: condition,
        order: [[`${sort}`, `${sortType}`]],
        limit,
        offset,
      });
      if (!result.count) {
        return failed(res, {
          code: 404,
          message: 'Store Not Found',
          error: 'Not Found',
        });
      }

      const data = await Promise.all(
        result.rows.map(async (item) => {
          const user = await User.findAll({
            where: {
              id: item.user_id,
            },
          });

          const obj = {
            store: item,
            user,
          };

          return obj;
        })
      );

      const paging = pagination(result.count, page, limit);
      return success(res, {
        code: 200,
        message: `Success get all store`,
        data: data,
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
  getAllProfile: async (req, res) => {
    try {
      let { page, limit, search, sort, sortType } = req.query;
      page = Number(page) || 1;
      limit = Number(limit) || 10;
      sort = sort || 'name';
      sortType = sortType || 'ASC';

      const condition = search
        ? {
            [Op.or]: [
              {
                name: { [Op.iLike]: `%${search}%` },
              },
            ],
          }
        : null;

      const offset = (page - 1) * limit;

      const result = await Profile.findAndCountAll({
        where: condition,
        order: [[`${sort}`, `${sortType}`]],
        limit,
        offset,
      });
      if (!result.count) {
        return failed(res, {
          code: 404,
          message: 'Store Not Found',
          error: 'Not Found',
        });
      }

      const data = await Promise.all(
        result.rows.map(async (item) => {
          const user = await User.findAll({
            where: {
              id: item.user_id,
              level: 2,
            },
          });

          let obj;

          if (user.length) {
            obj = {
              profile: item,
              user,
            };
          }

          return obj;
        })
      );

      const results = [];
      data.forEach((element) => {
        if (element) {
          results.push(element);
        }
      });

      const paging = pagination(result.count, page, limit);
      return success(res, {
        code: 200,
        message: `Success get all profile`,
        data: results,
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
  updateProfile: async (req, res) => {
    try {
      const { id } = req.APP_DATA.tokenDecoded;

      const { name, email, phone, gender, birth } = req.body;

      const profile = await Profile.findAll({
        where: {
          user_id: id,
        },
      });

      if (!profile.length) {
        if (req.file) {
          deleteFile(req.file.path);
        }
        return failed(res, {
          code: 404,
          message: `Profile by id ${id} not found`,
          error: 'Not Found',
        });
      }

      // upload image to google drive
      let { photo } = profile[0];
      if (req.file) {
        if (photo) {
          // remove old image except default image
          deleteGoogleDrive(photo);
        }
        // upload new image to google drive
        const photoGd = await uploadGoogleDrive(req.file);
        photo = photoGd.id;
        // remove image after upload
        deleteFile(req.file.path);
      }

      await Profile.update(
        {
          name,
          phone,
          gender,
          birth,
          photo,
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
        message: 'Success Edit Profile',
        data: null,
      });
    } catch (error) {
      if (req.file) {
        deleteFile(req.file.path);
      }
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

      const { name, store_name, email, store_phone, store_description } =
        req.body;

      const store = await Store.findAll({
        where: {
          user_id: id,
        },
      });

      if (!store.length) {
        if (req.file) {
          deleteFile(req.file.path);
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
          deleteGoogleDrive(photo);
        }
        // photo = req.file.filename;
        const photoGd = await uploadGoogleDrive(req.file);
        photo = photoGd.id;
        deleteFile(req.file.path);
      }

      await Store.update(
        {
          name,
          store_name,
          store_phone,
          store_description,
          photo,
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
        deleteFile(req.file.path);
      }
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findAll({
        where: {
          id,
        },
      });

      if (!user.length) {
        return failed(res, {
          code: 404,
          message: `User id ${id} not found`,
          error: 'Not Found',
        });
      }

      let data = [];
      if (user[0].level == 1) {
        const store = await Store.findAll({
          where: {
            user_id: id,
          },
        });

        obj = {
          store: store[0],
          user: user[0],
        };

        data.push(obj);
      }

      if (user[0].level == 2) {
        const profile = await Profile.findAll({
          where: {
            user_id: id,
          },
        });

        obj = {
          profile: profile[0],
          user: user[0],
        };

        data.push(obj);
      }

      return success(res, {
        code: 200,
        message: `Success get user by id`,
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
};
