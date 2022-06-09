const { check } = require('express-validator');

const update = [
  // name
  check('name', 'Name required').not().isEmpty(),
  check('name', 'Name only can contains alphabet').isAlpha('en-US', {
    ignore: ' ',
  }),
  check('name', 'Name maximum length is 100 characters').isLength({ max: 100 }),
  // email
  check('email', 'Email required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('email', 'Email maximum length is 50 characters').isLength({ max: 50 }),
  // phone
  check('phone', 'Phone Number cannot be empty').not().isEmpty(),
  check('phone', 'Phone Number only number allowed').isNumeric(),
  check('phone', 'Phone Number must be between 11 and 13 characters').isLength({
    min: 11,
    max: 13,
  }),
  // gender
  check('gender', 'Gender cannot be empty').not().isEmpty(),
  check('gender', 'Gender must be valid value').isIn(['Male', 'Female']),
  // birth
  check('birth', 'Birth cannot be empty').not().isEmpty(),
  check('birth', 'Birth must be valid date').isDate(),
];

module.exports = {
  update,
};
