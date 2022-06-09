const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const { success, failed } = require('../helpers/response');
const Store = require('../models/store.js');
const Product = require('../models/product.js');
const ProductColor = require('../models/product_color');
const ProductImage = require('../models/product_image');
const ProductSize = require('../models/product_size');

module.exports = {
  getAllProduct: async (req, res) => {
    try {
      let { page, limit, search, sort, sortType } = req.body;

      page = Number(page) || 1;
      limit = Number(limit) || 10;
      search = search || '';
      sort = sort || 'product_name';
      sortType = sortType || 'DESC';
      const offset = (page - 1) * limit;
      const Op = Sequelize.Op;

      const product = await Product.findAndCountAll({
        where: {
          product_name: { [Op.like]: `%${search}%` },
        },
        order: [[`${sort}`, `${sortType}`]],
        limit,
        offset,
      });

      if (!product.length) {
        return failed(res, {
          code: 404,
          message: 'Product Not Found',
          error: 'Not Found',
        });
      }

      const data = await Promise.all(
        product.map(async (item) => {
          // const brand = await ProductBrand.findAll({
          //   where: {
          //     product_id: item.id,
          //   },
          // });

          // const brand =

          const color = await ProductColor.findAll({
            where: {
              product_id: item.id,
            },
          });

          const image = await ProductImage.findAll({
            where: {
              product_id: item.id,
            },
          });

          const size = await ProductImage.findAll({
            where: {
              product_id: item.id,
            },
          });

          const obj = {
            product: item,
            color,
            image,
            size,
          };

          return obj;
        })
      );

      // if (search) {
      //   const paging = pagination
      // }

      return success(res, {
        code: 200,
        message: `Success get all product`,
        data,
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  getProductById: async (req, res) => {
    try {

    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  createProduct: async (req, res) => {
    try {
      const userId = req.APP_DATA.tokenDecoded.id;

      const store = await Store.findAll({
        where: {
          user_id: userId,
        },
      });

      if (!store.length) {
        return failed(res, {
          code: 404,
          message: `Store by id ${userId} not found`,
          error: 'Not Found',
        });
      }

      const {
        category_id,
        product_name,
        brand_id,
        price,
        is_new,
        description,
        stock,
        rating,
      } = req.body;

      const id = uuidv4();

      const product = {
        id,
        store_id: userId,
        category_id,
        product_name,
        brand_id,
        price,
        is_new,
        description,
        stock,
        rating,
      };

      await Product.create(product);

      // Add Product Color
      const { product_color } = req.body;
      if (product_color) {
        product_color.map(async (item) => {
          await ProductColor.create({
            id: uuidv4(),
            product_id: id,
            ...item,
          });
        });
      }

      // Add Product Image
      const { product_image } = req.body;
      if (product_image) {
        product_image.map(async (item) => {
          await ProductImage.create({
            id: uuidv4(),
            product_id: id,
            ...item,
          });
        });
      }

      // Add Product Size
      const { product_size } = req.body;
      if (product_size) {
        product_size.map(async (item) => {
          await ProductSize.create({
            id: uuidv4(),
            product_id: id,
            ...item,
          });
        });
      }

      return success(res, {
        code: 200,
        message: 'Success Create Product',
        data: null,
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await Product.findAll({
        where: {
          id,
        },
      });

      if (!product.length) {
        return failed(res, {
          code: 404,
          message: `Product by id ${id} not found`,
          error: 'Not Found',
        });
      }

      const {
        category_id,
        product_name,
        brand_id,
        price,
        is_new,
        description,
        stock,
        rating,
      } = req.body;

      const data = {
        category_id,
        product_name,
        brand_id,
        price,
        is_new,
        description,
        stock,
        rating,
      };

      await Product.update(data, {
        where: {
          id,
        },
      });

      // Add Product Color
      const { product_color } = req.body;
      if (product_color) {
        await ProductColor.destroy({
          where: {
            product_id: id,
          },
        });
        product_color.map(async (item) => {
          await ProductColor.create({
            id: uuidv4(),
            product_id: id,
            ...item,
          });
        });
      }

      // Add Product Image
      const { product_image } = req.body;
      if (product_image) {
        await ProductImage.destroy({
          where: {
            product_id: id,
          },
        });
        product_image.map(async (item) => {
          await ProductImage.create({
            id: uuidv4(),
            product_id: id,
            ...item,
          });
        });
      }

      // Add Product Size
      const { product_size } = req.body;
      if (product_size) {
        await ProductSize.destroy({
          where: {
            product_id: id,
          },
        });
        product_size.map(async (item) => {
          await ProductSize.create({
            id: uuidv4(),
            product_id: id,
            ...item,
          });
        });
      }

      return success(res, {
        code: 200,
        message: 'Success Edit Product',
        data: null,
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await Product.findAll({
        where: {
          id,
        },
      });

      if (!product.length) {
        return failed(res, {
          code: 404,
          message: `Product by id ${id} not found`,
          error: 'Not Found',
        });
      }

      await Product.update({
        is_active: 0
      }, {
        where: {
          id,
        },
      });

      return success(res, {
        code: 200,
        message: 'Success Delete Product',
        data: null,
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
};
