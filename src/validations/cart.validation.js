const { check } = require('express-validator');

const cart = [
  // product_id
  check('product_id', 'Product ID required').not().isEmpty(),
  // qty
  check('qty', 'Qty required').not().isEmpty(),
  check('qty', 'Qty only number allowed').isNumeric(),
];

module.exports = {
  cart,
};
