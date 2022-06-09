const User = require('../models/user');
const Profile = require('../models/profile');
const { success, failed } = require('../helpers/response');
const deleteFile = require('../utils/deleteFile');

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
};
