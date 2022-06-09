const express = require('express');
const {
  getAllCategory,
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
  .get('/category', jwtAuth, isAdmin, getAllCategory)
  .get('/category/:id', jwtAuth, isAdmin, getCategoryId)
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
  .put('/category/delete/:id', jwtAuth, isAdmin, deleteCategory);

module.exports = router;
