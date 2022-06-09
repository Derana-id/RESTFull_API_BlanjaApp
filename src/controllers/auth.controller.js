const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const jwtToken = require('../utils/generateJwtToken');
const { success, failed } = require('../helpers/response');
const User = require('../models/user.model');
const Profile = require('../models/profile.model');
const Store = require('../models/store.model');
const sendEmail = require('../utils/sendEmail');
const { APP_NAME, EMAIL_FROM, API_URL, APP_CLIENT } = require('../helpers/env');
const activateAccount = require('../templates/confirm-email');
const resetAccount = require('../templates/reset-password');
const { userInfo } = require('os');

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

      // send email for activate account
      const templateEmail = {
        from: `"${APP_NAME}" <${EMAIL_FROM}>`,
        to: req.body.email.toLowerCase(),
        subject: 'Activate Your Account!',
        html: activateAccount(`${API_URL}auth/activation/${token}`),
      };
      sendEmail(templateEmail);

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

      console.log(name);

      // send email for activate account
      const templateEmail = {
        from: `"${APP_NAME}" <${EMAIL_FROM}>`,
        to: req.body.email.toLowerCase(),
        subject: 'Activate Your Account!',
        html: activateAccount(`${API_URL}auth/activation/${token}`, name),
      };
      sendEmail(templateEmail);

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
  activation: async (req, res) => {
    try {
      const { token } = req.params;
      const user = await User.findAll({
        where: {
          token,
        },
      });

      if (!user.length) {
        res.send(`
        <div>
          <h1>Activation Failed</h1>
          <h3>Token invalid</h3>
        </div>`);
        return;
      }

      await User.update(
        {
          token: null,
          is_verified: 1,
        },
        {
          where: {
            token,
          },
        }
      );
      res.send(`
      <div>
        <h1>Activation Success!</h1>
        <h3>You can login now!</h3>
      </div>
      `);
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  loginAccount: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findAll({
        where: {
          email,
        },
      });

      // if user exists
      if (user.length) {
        const match = await bcrypt.compare(password, user[0].password);
        // if password correct
        if (match) {
          const userId = user[0].id;
          const jwt = jwtToken({ userId });
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
        await User.update(
          {
            token: verifyToken,
          },
          {
            where: {
              id: user[0].id,
            },
          }
        );

        // send email for reset password
        const templateEmail = {
          from: `"${APP_NAME}" <${EMAIL_FROM}>`,
          to: req.body.email.toLowerCase(),
          subject: 'Reset Your Password!',
          html: resetAccount(
            `${APP_CLIENT}auth/reset/${verifyToken}`,
            `${API_URL}uploads/users/${user[0].photo}`
          ),
        };
        sendEmail(templateEmail);
      }

      return success(res, {
        code: 200,
        message: 'Forgot Password Sucess',
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

      const { password } = req.body;
      const hashPassword = await bcrypt.hash(password, 10);
      await User.update(
        {
          password: hashPassword,
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
