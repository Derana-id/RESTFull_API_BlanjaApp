const express = require('express');

const jwtAuth = require('../middlewares/jwtAuth');
const { isSeller } = require('../middlewares/authorization');
const { update } = require('../validations/store.validation');
const validation = require('../middlewares/validation');
const upload = require('../middlewares/uploads');
const {
  getUserById,
  updateStore,
  getAllStore,
} = require('../controllers/store.controller');

const router = express.Router();
router
  .get('/store', jwtAuth, getAllStore)
  .get('/store/:id', jwtAuth, getUserById)
  .put('/store', jwtAuth, isSeller, upload, update, validation, updateStore);

module.exports = router;
