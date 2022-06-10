const { check } = require('express-validator');

const insertValidation = [
  // label
  check('label', 'label cannot be empty').not().isEmpty(),
  check('label', 'label must be between 3 and 50 characters').isLength({
    min: 3,
    max: 50,
  }),

  // recipientName
  check('recipientName', 'recipientName cannot be empty').not().isEmpty(),
  check(
    'recipientName',
    'recipientName must be between 3 and 50 characters'
  ).isLength({
    min: 3,
    max: 50,
  }),

  // recipientPhone
  check('recipientPhone', 'recipientPhone cannot be empty').not().isEmpty(),
  check('recipientPhone', 'please enter recipientPhone correctly').isNumeric(),
  check(
    'recipientPhone',
    'recipientPhone require 12 or more characters'
  ).isLength({
    min: 12,
    max: 20,
  }),

  //address
  check('address', 'Address cannot be empty').not().isEmpty(),
  check('address', 'Address require 3 or more characters').isLength({
    min: 3,
  }),

  //postalCode
  check('postalCode', 'postalCode cannot be empty').not().isEmpty(),
  check('postalCode', 'postalCode require 4 or more characters').isLength({
    min: 4,
  }),

  //city
  check('city', 'City cannot be empty').not().isEmpty(),
  check('city', 'City require 3 or more characters').isLength({
    min: 3,
  }),

  // isPrimary
  check('isPrimary', 'isPrimary cannot be empty').not().isEmpty(),
  check('isPrimary', 'isPrimary only number 0 or 1').isNumeric(),
  check('isPrimary', 'isPrimary value must be between 0 to 1').isInt({
    min: 0,
    max: 1,
  }),
];

const updateValidation = [
  // label
  check('label', 'label cannot be empty').not().isEmpty(),
  check('label', 'label must be between 3 and 50 characters').isLength({
    min: 3,
    max: 50,
  }),

  // recipientName
  check('recipientName', 'recipientName cannot be empty').not().isEmpty(),
  check(
    'recipientName',
    'recipientName must be between 3 and 50 characters'
  ).isLength({
    min: 3,
    max: 50,
  }),

  // recipientPhone
  check('recipientPhone', 'recipientPhone cannot be empty').not().isEmpty(),
  check('recipientPhone', 'please enter recipientPhone correctly').isNumeric(),
  check(
    'recipientPhone',
    'recipientPhone require 12 or more characters'
  ).isLength({
    min: 12,
    max: 20,
  }),

  //address
  check('address', 'Address cannot be empty').not().isEmpty(),
  check('address', 'Address require 3 or more characters').isLength({
    min: 3,
  }),

  //postalCode
  check('postalCode', 'postalCode cannot be empty').not().isEmpty(),
  check('postalCode', 'postalCode require 4 or more characters').isLength({
    min: 4,
  }),

  //city
  check('city', 'City cannot be empty').not().isEmpty(),
  check('city', 'City require 3 or more characters').isLength({
    min: 3,
  }),

  // isPrimary
  check('isPrimary', 'isPrimary cannot be empty').not().isEmpty(),
  check('isPrimary', 'isPrimary only number 0 or 1').isNumeric(),
  check('isPrimary', 'isPrimary value must be between 0 to 1').isInt({
    min: 0,
    max: 1,
  }),
];

module.exports = { insertValidation, updateValidation };
