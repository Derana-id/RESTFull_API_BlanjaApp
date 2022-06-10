const { Sequelize } = require('sequelize');
const {
  NODE_ENV,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
  DB_DIALECT,
} = require('../helpers/env');

// create connection
let db = null;
// Mode Development
if (NODE_ENV === 'development') {
  db = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
  });
}

// Mode Production
if (NODE_ENV === 'production') {
  db = new Sequelize(DATABASE_URL, {
    dialect: DB_DIALECT,
    protocol: DB_DIALECT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
}

// export connection
module.exports = db;
