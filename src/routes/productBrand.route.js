const express = require('express');
const {
  getAllBrand,
  getBrandId,
  insertBrand,
  updateBrand,
  deleteBrand,
} = require('../controllers/productBrand.controller');

const {
  insertValidation,
  deleteValidation,
  updateValidation,
} = require('../validations/brand.validation');
const validation = require('../middlewares/validation');

const jwtAuth = require('../middlewares/jwtAuth');
// const {} = require('../middlewares/authorization');
const brandUpload = require('../middlewares/productBrandUpload');

const router = express.Router();

router
  .get('/brand', getAllBrand)
  .get('/brand/:id', getBrandId)
  .post('/brand', brandUpload, insertValidation, validation, insertBrand)
  .put('/brand/:id', brandUpload, updateValidation, validation, updateBrand)
  .put('/brand/delete/:id', deleteValidation, validation, deleteBrand);

module.exports = router;
