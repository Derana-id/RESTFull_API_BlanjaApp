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
const {} = require('../middlewares/authorization');
const categoryUpload = require('../middlewares/categoryUpload');

const router = express.Router();

router
  .get('/category', getAllCategory)
  .get('/category/:id', getCategoryId)
  .post(
    '/category',
    categoryUpload,
    insertValidation,
    validation,
    insertCategory
  )
  .put(
    '/category/:id',
    categoryUpload,
    updateValidation,
    validation,
    updateCategory
  )
  .put('/category/delete/:id', deleteValidation, validation, deleteCategory);

module.exports = router;
