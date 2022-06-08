// require('dotenv').config();
const redis = require('redis');

//Production
// const client = redis.createClient({
//   host: process.env.REDIS_HOSTNAME,
//   port: process.env.REDIS_PORT,
//   password: process.env.REDIS_PASSWORD,
// });

// Devlopment
const client = redis.createClient();

client.on('connect', () => {
  console.log('Successfully connected databsae redis...');
});

module.exports = client;
