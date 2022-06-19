const { check } = require('express-validator');

const insertValidation = [
  // qty
  check('qty', 'qty cannot be empty').not().isEmpty(),
  check('qty', 'please enter qty correctly').isNumeric(),
  check('qty', 'qty value must number').isInt({
    min: 1,
  }),

  // productId
  check('productId', 'productId cannot be empty').not().isEmpty(),
];

const updateValidation = [
  // addressId
  check('addressId', 'addressId cannot be empty').not().isEmpty(),
];

const paymentValidation = [
  // paymentMethod
  check('paymentMethod', 'paymentMethod cannot be empty').not().isEmpty(),
  check('paymentMethod', 'paymentMethod only number').isNumeric(),
  check('paymentMethod', 'paymentMethod only number').isInt({
    min: 0,
  }),
];

const statusValidation = [
  // status
  check('status', 'status cannot be empty').not().isEmpty(),
  check('status', 'status only number').isNumeric(),
  check('status', 'status only number').isInt({
    min: 0,
    max: 4,
  }),
];

module.exports = {
  insertValidation,
  updateValidation,
  paymentValidation,
  statusValidation,
};
