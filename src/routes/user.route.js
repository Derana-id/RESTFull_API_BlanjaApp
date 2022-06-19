const express = require('express');

const jwtAuth = require('../middlewares/jwtAuth');
const { isSeller, isBuyer } = require('../middlewares/authorization');
const { update } = require('../validations/store.validation');
const { updateProfileValidasi } = require('../validations/profile.validation');
const validation = require('../middlewares/validation');
const upload = require('../middlewares/uploads');
const {
  getAllProfile,
  getAllStore,
  getUserById,
  updateProfile,
  updateStore,
} = require('../controllers/user.controller');

const router = express.Router();

router
  .get('/user', jwtAuth, getAllProfile)
  .get('/user/store', jwtAuth, getAllStore)
  .get('/user/:id', jwtAuth, getUserById)
  .put(
    '/user',
    jwtAuth,
    isBuyer,
    upload,
    updateProfileValidasi,
    validation,
    updateProfile
  )
  .put(
    '/user/store',
    jwtAuth,
    isSeller,
    upload,
    update,
    validation,
    updateStore
  );

module.exports = router;
