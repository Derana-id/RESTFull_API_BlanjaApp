const User = require('../models/user');
const Profile = require('../models/profile');
const { success, failed } = require('../helpers/response');
const deleteFile = require('../utils/deleteFile');
const Sequelize = require('sequelize');
const pagination = require('../utils/pagination');
const Op = Sequelize.Op;

module.exports = {
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;

      const profile = await Profile.findAll({
        where: {
          user_id: id,
        },
      });

      if (!profile.length) {
        return failed(res, {
          code: 404,
          message: `Profile by id ${id} not found`,
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
          message: `User by id ${id} not found`,
          error: 'Not Found',
        });
      }

      const data = {
        profile: profile[0],
        user: user[0],
      };

      return success(res, {
        code: 200,
        message: `Success get profile by id`,
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
          deleteFile(`public/uploads/users/${req.file.filename}`);
        }
        return failed(res, {
          code: 404,
          message: `Profile by id ${id} not found`,
          error: 'Not Found',
        });
      }

      let { photo } = profile[0];
      if (req.file) {
        if (photo !== 'default.png') {
          deleteFile(`public/uploads/users/${photo}`);
        }
        photo = req.file.filename;
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
        deleteFile(`public/uploads/users/${req.file.filename}`);
      }
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

          const obj = {
            profile: item,
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
};
