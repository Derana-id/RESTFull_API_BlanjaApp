const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const jwtToken = require('../utils/generateJwtToken');
const { success, failed } = require('../helpers/response');
const User = require('../models/user.model');
const Profile = require('../models/profile.model');
const Store = require('../models/store.model');
const { APP_NAME, EMAIL_FROM, API_URL } = require('../helpers/env');
const { activation, reset } = require('../utils/nodemailer');

module.exports = {
  registerBuyer: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const checkEmail = await User.findAll({
        where: {
          email,
        },
      });

      if (checkEmail.length) {
        return failed(res, {
          code: 409,
          message: 'Email already exist',
          error: 'Register Failed',
        });
      }

      const id = uuidv4();
      const hashPassword = await bcrypt.hash(password, 10);
      const token = crypto.randomBytes(30).toString('hex');

      const user = {
        id,
        email,
        password: hashPassword,
        level: 1,
        token,
        is_verified: 0,
      };

      const profile = {
        id: uuidv4(),
        user_id: id,
        name,
        photo: 'default.png',
      };

      await User.create(user);
      await Profile.create(profile);

      const template = {
        from: `"${APP_NAME}" <${EMAIL_FROM}>`,
        to: email,
        subject: 'Please Confirm Your Account',
        text: 'Confirm Your email Blanja Job Account',
        template: 'index',
        context: {
          url: `${API_URL}auth/activation/token=${token}`,
          name,
        },
      };

      await activation(template);

      return success(res, {
        code: 201,
        message: `Register Success`,
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
  registerSeller: async (req, res) => {
    try {
      const { name, email, store_name, store_phone, password } = req.body;

      const checkEmail = await User.findAll({
        where: {
          email,
        },
      });

      if (checkEmail.length) {
        return failed(res, {
          code: 409,
          message: 'Email already exist',
          error: 'Register Failed',
        });
      }

      const checkPhone = await Store.findAll({
        where: {
          store_phone,
        },
      });

      if (checkPhone.length) {
        return failed(res, {
          code: 409,
          message: 'Phone number already exist',
          error: 'Register Failed',
        });
      }

      const id = uuidv4();
      const hashPassword = await bcrypt.hash(password, 10);
      const token = crypto.randomBytes(30).toString('hex');

      const user = {
        id,
        email,
        password: hashPassword,
        level: 2,
        token,
        is_verified: 0,
      };

      const store = {
        id: uuidv4(),
        user_id: id,
        name,
        store_name,
        store_phone,
        photo: 'default.png',
      };

      await User.create(user);
      await Store.create(store);

      const template = {
        from: `"${APP_NAME}" <${EMAIL_FROM}>`,
        to: email,
        subject: 'Please Confirm Your Account',
        text: 'Confirm Your Email Blanja Job Account',
        template: 'index',
        context: {
          url: `${API_URL}auth/activation/token=${token}`,
          name,
        },
      };

      await activation(template);

      return success(res, {
        code: 201,
        message: `Register Success`,
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
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findAll({
        where: {
          email,
        },
      });

      // if user exists
      if (user.rowCount) {
        const match = await bcrypt.compare(password, user.rows[0].password);
        // if password correct
        if (match) {
          const jwt = jwtToken(user.rows[0]);
          return success(res, {
            code: 200,
            message: 'Login Sucess',
            token: jwt,
          });
        }
      }
      return failed(res, {
        code: 401,
        message: 'Wrong email or password',
        error: 'Login Failed',
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findAll({
        where: {
          email,
        },
      });

      if (user.length) {
        const verifyToken = crypto.randomBytes(30).toString('hex');
        await User.update(token, {
          where: {
            id: user[0].id,
          },
        });

        const template = {
          from: `"${APP_NAME}" <${EMAIL_FROM}>`,
          to: email,
          subject: 'Please Confirm Your Reset Password',
          text: 'Confirm Your Reset Password Blanja Job Account',
          template: 'index',
          context: {
            url: `${API_URL}auth/reset/token=${token}`,
          },
        };

        await reset(template);
      }

      return success(res, {
        code: 200,
        message: 'Forgot Password Sucess',
        token: jwt,
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { token } = req.params;
      const user = await User.findAll({
        where: {
          token,
        },
      });

      if (!user.length) {
        return failed({
          code: 401,
          message: 'Token Invalid',
          error: 'Reset Password Failed',
        });
      }

      await User.update(
        {
          token: null,
        },
        {
          where: {
            id: user[0].id,
          },
        }
      );

      return success(res, {
        code: 200,
        message: 'Reset Password Sucess',
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
};
