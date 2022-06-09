const express = require('express');

const jwtAuth = require('../middlewares/jwtAuth');
const { isSeller } = require('../middlewares/authorization');
const { update } = require('../validations/store.validation');
const validation = require('../middlewares/validation');
const upload = require('../middlewares/uploadUser');
const { getUserById, updateStore } = require('../controllers/store.controller');

const router = express.Router();
router
  .get('/store/:id', jwtAuth, getUserById)
  .put('/store', jwtAuth, isSeller, upload, update, validation, updateStore);

module.exports = router;
