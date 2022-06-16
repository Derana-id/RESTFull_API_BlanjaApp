const express = require('express');
const { initialtChat } = require('../controllers/chat.controller');
const jwtAuth = require('../middlewares/jwtAuth');

const router = express.Router();

router.post('/chat', jwtAuth, initialtChat);

module.exports = router;
