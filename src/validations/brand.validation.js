const { check } = require('express-validator');

const insertValidation = [
  // brandName
  check('brandName', 'brandName cannot be empty').not().isEmpty(),
  check('brandName', 'brandName require 3 or more characters').isLength({
    min: 3,
  }),
];

const updateValidation = [
  // brandName
  check('brandName', 'brandName cannot be empty').not().isEmpty(),
  check('brandName', 'brandName require 3 or more characters').isLength({
    min: 3,
  }),
];

const deleteValidation = [
  // is active
  check('isActive', 'isActive cannot be empty').not().isEmpty(),
  check('isActive', 'isActive only number 0 or 1').isNumeric(),
  check('isActive', 'isActive value must be between 0 to 1').isInt({
    min: 0,
    max: 1,
  }),
];

module.exports = { insertValidation, deleteValidation, updateValidation };
