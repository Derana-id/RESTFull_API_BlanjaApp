const { v4: uuidv4 } = require('uuid');
const { success, failed } = require('../helpers/response');
const Chat = require('../models/chat');
const Profile = require('../models/profile');

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
};
