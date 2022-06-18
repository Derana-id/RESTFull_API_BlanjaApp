const express = require('express');
const { initialtChat, getList } = require('../controllers/chat.controller');
const jwtAuth = require('../middlewares/jwtAuth');

const router = express.Router();

router.post('/chat', jwtAuth, initialtChat).get('/chat', jwtAuth, getList);

module.exports = router;
