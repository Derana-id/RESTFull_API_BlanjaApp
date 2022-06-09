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
      allowNull: false,
    },
    receiver: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Chat;
