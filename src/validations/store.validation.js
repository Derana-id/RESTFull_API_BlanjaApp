const { check } = require('express-validator');

const update = [
  // name
  check('store_name', 'Store Name required').not().isEmpty(),
  check('store_name', 'Store Name maximum length is 100 characters').isLength({
    max: 100,
  }),
  // email
  check('email', 'Email required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('email', 'Email maximum length is 50 characters').isLength({ max: 50 }),
  // phone
  check('store_phone', 'Store Phone').not().isEmpty(),
  check('store_phone', 'Store Phone only number allowed').isNumeric(),
  check(
    'store_phone',
    'Store Phone must be between 11 and 13 characters'
  ).isLength({
    min: 11,
    max: 13,
  }),
  // description
  check('store_description', 'Store Description required').not().isEmpty(),
];

module.exports = {
  update,
};
