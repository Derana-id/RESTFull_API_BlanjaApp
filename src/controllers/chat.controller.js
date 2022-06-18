const { v4: uuidv4 } = require('uuid');
const { success, failed } = require('../helpers/response');
const Chat = require('../models/chat');
const Profile = require('../models/profile');
const User = require('../models/user');
const db = require('../config/pg');
const { QueryTypes } = require('sequelize');

module.exports = {
  initialtChat: async (req, res) => {
    try {
      const { sender, receiver } = req.body;

      const user = await Profile.findAll({
        where: {
          user_id: receiver,
        },
      });

      await Chat.create({
        id: uuidv4(),
        sender,
        receiver,
        message: `Halo ${user[0].name}, ada yang bisa dibantu ?`,
      });

      return success(res, {
        code: 200,
        message: 'Success send chat',
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
  getList: async (req, res) => {
    try {
      const { id, level } = req.APP_DATA.tokenDecoded;

      const user = await User.findAll();
      if (!user.length) {
        return failed(res, {
          code: 404,
          message: `Data not found`,
          error: 'Not Found',
        });
      }

      if (level == 2) {
        const data = await Promise.all(
          user.map(async (item) => {
            const list = await db.query(
              `SELECT * FROM chat
              WHERE
              (sender='${id}' AND receiver='${item.id}')
              OR
              (sender='${item.id}' AND receiver='${id}')
              ORDER BY date DESC LIMIT 1`,
              {
                type: QueryTypes.SELECT,
              }
            );

            // const dataUser = await User.findAll({
            //   where: {
            //     id: list.receiver,
            //   },
            // });

            const obj = {
              user: item,
              message: list,
            };

            return obj;
          })
        );

        success(res, {
          code: 200,
          message: `Success get user`,
          data,
        });
      } else {
        const data = await Promise.all(
          user.map(async (item) => {
            const list = await db.query(
              `SELECT * FROM chat
              WHERE
              (sender='${item.id}' AND receiver='${id}')
              OR
              (sender='${id}' AND receiver='${item.id}')
              ORDER BY date DESC LIMIT 1`,
              {
                type: QueryTypes.SELECT,
              }
            );

            const obj = {
              user: item,
              message: list,
            };

            return obj;
          })
        );

        success(res, {
          code: 200,
          message: `Success get user`,
          data,
        });
      }
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
};
