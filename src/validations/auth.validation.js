const { check } = require('express-validator');

const registerProfile = [
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
  // password
  check('password', 'Password required').not().isEmpty(),
  check('password', 'Password require 8 or more characters').isLength({
    min: 8,
  }),
  check(
    'password',
    'Password must include one lowercase character, one uppercase character, a number, and a special character'
  ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, 'i'),
  check('password', "Password can't above 100 characters").isLength({
    max: 100,
  }),
];

const registerStore = [
  ...registerProfile,
  // store name
  check('store_name', 'Store Name required').not().isEmpty(),
  check('store_name', 'Store Name maximum length is 100 characters').isLength({
    max: 100,
  }),
  // store phone
  check('store_phone', 'Phone Number cannot be empty').not().isEmpty(),
  check('store_phone', 'Phone Number only number allowed').isNumeric(),
  check(
    'store_phone',
    'Phone Number must be between 11 and 13 characters'
  ).isLength({ min: 11, max: 13 }),
];

const login = [
  // email
  check('email', 'Email required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('email', 'Email maximum length is 50 characters').isLength({ max: 50 }),
  // password
  check('password', 'Password required').not().isEmpty(),
  check('password', 'Password require 8 or more characters').isLength({
    min: 8,
  }),
  check(
    'password',
    'Password must include one lowercase character, one uppercase character, a number, and a special character'
  ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, 'i'),
  check('password', "Password can't above 100 characters").isLength({
    max: 100,
  }),
];

const forgot = [
  // email
  check('email', 'Email required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('email', 'Email maximum length is 50 characters').isLength({ max: 50 }),
];

const reset = [
  // password
  check('password', 'Password required').not().isEmpty(),
  check('password', 'Password require 8 or more characters').isLength({
    min: 8,
  }),
  check(
    'password',
    'Password must include one lowercase character, one uppercase character, a number, and a special character'
  ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, 'i'),
  check('password', "Password can't above 100 characters").isLength({
    max: 100,
  }),
  // password confirmation
  check('passwordConfirmation', 'Password confirmation cannot be empty')
    .not()
    .isEmpty(),
  check('passwordConfirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
];

module.exports = {
  registerProfile,
  registerStore,
  login,
  forgot,
  reset,
};
