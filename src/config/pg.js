const { Sequelize } = require('sequelize');

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
  DB_DIALECT,
} = require('../helpers/env');

// create connection
const db = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
});

// export connection
module.exports = db;
