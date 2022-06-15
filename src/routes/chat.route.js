const express = require('express');
const { insertChat } = require('../controllers/chat.controller');
const jwtAuth = require('../middlewares/jwtAuth');

const router = express.Router();

router.post('/chat', jwtAuth, insertChat);

module.exports = router;
