const express = require('express');

const jwtAuth = require('../middlewares/jwtAuth');
const { isBuyer } = require('../middlewares/authorization');
const { update } = require('../validations/profile.validation');
const validation = require('../middlewares/validation');
const upload = require('../middlewares/uploads');
const {
  getUserById,
  updateProfile,
  getAllProfile,
} = require('../controllers/profile.controller');

const router = express.Router();
router
  .get('/profile', jwtAuth, getAllProfile)
  .get('/profile/:id', jwtAuth, getUserById)
  .put('/profile', jwtAuth, isBuyer, upload, update, validation, updateProfile);

module.exports = router;
