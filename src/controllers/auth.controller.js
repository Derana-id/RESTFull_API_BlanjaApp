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
const { activation } = require('../utils/nodemailer');

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
          error: 'Register failed',
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
        message: `Register success`,
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
          error: 'Register failed',
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
          error: 'Register failed',
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
        message: `Register success`,
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
          email: email,
        },
      });

      // if user exists
      if (user.rowCount) {
        const match = await bcrypt.compare(password, user.rows[0].password);
        // if password correct
        if (match) {
          const jwt = jwtToken;
        }
      }
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  getUserById: async (req, res) => {
    try {
      const user = await User.findAll({
        where: {
          id: req.params.id,
        },
      });
      return success(res, {
        code: 200,
        message: `Success get user by id`,
        data: user.rows,
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
