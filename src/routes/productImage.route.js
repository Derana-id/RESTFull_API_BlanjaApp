const express = require('express');

const { deleteImage } = require('../controllers/productImage.controller');

const jwtAuth = require('../middlewares/jwtAuth');
const { isSeller } = require('../middlewares/authorization');

const router = express.Router();

router.delete('/product-image/:id', jwtAuth, isSeller, deleteImage);

module.exports = router;
