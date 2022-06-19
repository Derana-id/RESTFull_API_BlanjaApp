const { v4: uuidv4 } = require('uuid');
const { success, failed } = require('../helpers/response');
const Chat = require('../models/chat');
const Profile = require('../models/profile');
const Store = require('../models/store');
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

      if (level == 2) {
        const user = await User.findAll({
          where: {
            level: 1,
          },
        });
        if (!user.length) {
          return failed(res, {
            code: 404,
            message: `Data not found`,
            error: 'Not Found',
          });
        }

        let getData = [];
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

            const listData = await Promise.all(
              list.map(async (element) => {
                const store = await Store.findAll({
                  where: {
                    user_id: item.id,
                  },
                });

                const obj = {
                  user: item,
                  store,
                  message: list,
                };

                return getData.push(obj);
              })
            );
          })
        );

        success(res, {
          code: 200,
          message: `Success get user`,
          data: getData,
        });
      } else {
        const user = await User.findAll({
          where: {
            level: 2,
          },
        });
        if (!user.length) {
          return failed(res, {
            code: 404,
            message: `Data not found`,
            error: 'Not Found',
          });
        }

        let getData = [];
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

            const listData = await Promise.all(
              list.map(async (element) => {
                const profile = await Profile.findAll({
                  where: {
                    user_id: item.id,
                  },
                });

                const obj = {
                  user: item,
                  profile,
                  message: list,
                };

                return getData.push(obj);
              })
            );
          })
        );

        success(res, {
          code: 200,
          message: `Success get user`,
          data: getData,
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
