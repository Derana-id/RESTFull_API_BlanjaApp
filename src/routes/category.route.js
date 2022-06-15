const express = require('express');
const { 
  getAllCategory,
  getPublicCategory,
  getCategoryId,
  insertCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');

const {
  insertValidation,
  updateValidation,
  deleteValidation,
} = require('../validations/category.validation');
const validation = require('../middlewares/validation');

const jwtAuth = require('../middlewares/jwtAuth');
const { isAdmin } = require('../middlewares/authorization');
const categoryUpload = require('../middlewares/uploadCategory');

const router = express.Router();

router
  .get('/category', getAllCategory)
  .get('/category/public', getPublicCategory)
  .get('/category/:id', getCategoryId)
  .post(
    '/category',
    jwtAuth,
    isAdmin,
    categoryUpload,
    insertValidation,
    validation,
    insertCategory
  )
  .put(
    '/category/:id',
    jwtAuth,
    isAdmin,
    categoryUpload,
    updateValidation,
    validation,
    updateCategory
  )
  .put(
    '/category/delete/:id',
    jwtAuth,
    isAdmin,
    deleteValidation,
    validation,
    deleteCategory
  );

module.exports = router;
