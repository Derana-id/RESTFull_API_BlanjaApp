const { DataTypes } = require('sequelize');
const db = require('../config/pg');

const Chat = db.define(
  'chat',
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    sender: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    receiver: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Chat;
