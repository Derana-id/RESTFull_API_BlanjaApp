const { DataTypes } = require('sequelize');
const db = require('../config/pg');

const Category = db.define(
  'category',
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Category;
