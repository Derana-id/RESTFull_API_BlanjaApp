const { v4: uuidv4 } = require('uuid');
const { QueryTypes } = require('sequelize');
const Chat = require('../models/chat');
const User = require('../models/user');
const db = require('../config/pg');

module.exports = (io, socket) => {
  socket.on('ping', (data) => {
    socket.emit('ping-response', data);
  });
  socket.on('join-room', (id) => {
    socket.join(id);
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

      const list = await db.query(
        `SELECT
        chat.id,
        chat.message,
        userSender.id AS sender_id,
        userReceiver.id AS receiver_id
        FROM chat
        LEFT JOIN users AS userSender ON chat.sender=userSender.id
        LEFT JOIN users AS userReceiver ON chat.receiver=userReceiver.id
        WHERE (sender = '${sender}' AND receiver = '${receiver}')
        OR (sender = '${receiver}' AND receiver = '${sender}')`,
        {
          type: QueryTypes.SELECT,
        }
      );

      io.to(receiver).emit('send-message-response', list);
      io.to(sender).emit('send-message-response', list);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on('chat-history', async (data) => {
    try {
      const { sender, receiver } = data;
      const list = await db.sequelize.query(
        `SELECT 
        chat.id, 
        chat.message, 
        chat.createdAt, 
        userSender.id AS sender_id, 
        userReceiver.id AS receiver_id 
        FROM chat
        INNER JOIN users AS userSender ON chat.sender=userSender.id
        INNER JOIN users AS userReceiver ON chat.receiver=userReceiver.id
        WHERE (sender = '${sender}' AND receiver = '${receiver}') 
        OR (sender = '${receiver}' AND receiver = '${sender}') ORDER BY chat.createdAt`,
        {
          type: QueryTypes.SELECT,
        }
      );
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
          sender,
        },
      });

      const list = await db.sequelize.query(
        `SELECT 
        chat.id, 
        chat.message, 
        chat.createdAt, 
        userSender.id AS sender_id, 
        userReceiver.id AS receiver_id 
        FROM chat
        INNER JOIN users AS userSender ON chat.sender=userSender.id
        INNER JOIN users AS userReceiver ON chat.receiver=userReceiver.id
        WHERE (sender = '${sender}' AND receiver = '${receiver}') 
        OR (sender = '${receiver}' AND receiver = '${sender}') ORDER BY chat.createdAt`,
        {
          type: QueryTypes.SELECT,
        }
      );

      io.to(sender).emit('send-message-response', list);
      io.to(receiver).emit('send-message-response', list);
    } catch (error) {
      console.log(error);
    }
  });
};
