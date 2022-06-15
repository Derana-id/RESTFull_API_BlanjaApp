const Store = require('../models/store');
const Profile = require('../models/profile');
const Chat = require('../models/chat');

module.exports = {
  insertChat: async (req, res) => {
    try {
      const { senderId, receiverId } = req.body;

      const store = await Store.findAll({
        where: {
          id: senderId,
        },
      });

      

      // const user = await Store.findAll({
      //   where: {
      //     id: receiverId,
      //   },
      // });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
};
