const { check } = require('express-validator');

const product = [
  // category_id
  check('category_id', 'Category ID required').not().isEmpty(),
  // product_name
  check('product_name', 'Product Name required').not().isEmpty(),
  check(
    'product_name',
    'Product Name maximum length is 100 characters'
  ).isLength({ max: 100 }),
  // brand id
  check('brand_id', 'Brand ID required').not().isEmpty(),
  // price
  check('price', 'Price required').not().isEmpty(),
  check('price', 'Price only number allowed').isNumeric(),
  // is_new
  check('is_new', 'is new required').not().isEmpty(),
  check('is_new', 'is new value must be between 0 to 1').isInt({
    min: 0,
    max: 1,
  }),
  // description
  check('description', 'Description required').not().isEmpty(),
  // stock
  check('stock', 'Stock required').not().isEmpty(),
  check('stock', 'Stock only number allowed').isNumeric(),
  // rating
  check('rating', 'Rating required').not().isEmpty(),
  check('rating', 'Rating only number allowed').isNumeric(),
];

module.exports = {
  product,
};
