const { v4: uuidv4 } = require('uuid');
const { success, failed } = require('../helpers/response');
const Chat = require('../models/chat');
const Store = require('../models/store');

module.exports = {
  initialtChat: async (req, res) => {
    try {
      const { sender, receiver } = req.body;

      // sender and receiver using id tbl users
      await Chat.create({
        id: uuidv4(),
        sender,
        receiver,
        message: '',
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
