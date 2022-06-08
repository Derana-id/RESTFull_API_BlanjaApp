const { DataTypes } = require('sequelize');
const db = require('../config/pg');

const Profile = db.define(
  'profile',
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    birth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Profile;
