const { v4: uuidv4 } = require('uuid');
const Chat = require('../models/chat');
const User = require('../models/user');

module.exports = (io, socket) => {
  socket.on('join-room', (data) => {
    socket.join(data.id);
  });
  socket.on('send-message', async (data) => {
    try {
      const { sender, receiver, message } = data;
      const setData = {
        id: uuidv4(),
        sender,
        receiver,
        message,
      };

      await Chat.create(setData);

      const list = Chat.findAll({
        include: [
          {
            model: User,
            as: 'userSender',
            where: {
              sender,
              receiver,
            },
          },
          {
            model: User,
            as: 'userReceiver',
            where: {
              sender,
              receiver,
            },
          },
        ],
      });

      io.to(receiver).emit('send-message-response', list);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on('chat-history', async (data) => {
    try {
      const { sender, receiver } = data;
      const list = Chat.findAll({
        include: [
          {
            model: User,
            as: 'userSender',
            where: {
              sender,
              receiver,
            },
          },
          {
            model: User,
            as: 'userReceiver',
            where: {
              sender,
              receiver,
            },
          },
        ],
      });

      io.to(sender).emit('send-message-response', list);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on('delete-message', async (data) => {
    try {
      const { id, sender, receiver } = data;

      Chat.destroy({
        where: {
          id,
        },
      });

      const list = Chat.findAll({
        include: [
          {
            model: User,
            as: 'userSender',
            where: {
              sender,
              receiver,
            },
          },
          {
            model: User,
            as: 'userReceiver',
            where: {
              sender,
              receiver,
            },
          },
        ],
      });

      io.to(sender).emit('send-message-response', list);
      io.to(receiver).emit('send-message-response', list);
    } catch (error) {
      console.log(error);
    }
  });
};
