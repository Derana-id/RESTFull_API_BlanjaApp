const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
// const socketio = require('socket.io');
const http = require('http');
const { APP_NAME, NODE_ENV, PORT } = require('./src/helpers/env');
const { failed } = require('./src/helpers/response');

// const listenSocket = require('./src/socket');

// express declaration
const app = express();

// enable cors
app.use(cors());
app.options('*', cors());

// set security HTTP headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// sanitize request data
app.use(xss());

// parse urlencoded request body
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// access folder public
app.use(express.static('public'));

// root router
app.get('/', (req, res) =>
  res.send(`${APP_NAME} API - ${NODE_ENV[0].toUpperCase() + NODE_ENV.slice(1)}`)
);

// main route
app.use(require('./src/routes/auth.route'));
app.use(require('./src/routes/address.route'));
app.use(require('./src/routes/category.route'));
app.use(require('./src/routes/productBrand.route'));
app.use(require('./src/routes/profile.route'));
app.use(require('./src/routes/store.route'));

// 404 router
app.use((req, res) => {
  failed(res, {
    code: 404,
    message: 'Resource on that url not found',
    error: 'Not Found',
  });
});

// setup socket.io
// const server = http.createServer(app);

// const io = socketio(server, {
//   cors: {
//     origin: '*',
//   },
// });

// io.on('connection', (socket) => {
//   console.log('Client connected');
//   listenSocket(io, socket);
// });

app.listen(PORT, () => {
  console.log(
    `Server running running at port ${PORT} with ${NODE_ENV} environment`
  );
});
