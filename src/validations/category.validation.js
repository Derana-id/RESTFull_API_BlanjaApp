const { check } = require('express-validator');

const insertValidation = [
  // categoryName
  check('categoryName', 'categoryName cannot be empty').not().isEmpty(),
  check('categoryName', 'categoryName require 3 or more characters').isLength({
    min: 3,
  }),
];

const updateValidation = [
  // categoryName
  check('categoryName', 'categoryName cannot be empty').not().isEmpty(),
  check('categoryName', 'categoryName require 3 or more characters').isLength({
    min: 3,
  }),
];

const deleteValidation = [
  // id
  check('id', 'id cannot be empty').not().isEmpty(),

  // is active
  check('isActive', 'isActive cannot be empty').not().isEmpty(),
  check('isActive', 'isActive only number 0 or 1').isNumeric(),
  check('isActive', 'isActive value must be between 0 to 1').isInt({
    min: 0,
    max: 1,
  }),
];

module.exports = { insertValidation, deleteValidation, updateValidation };
