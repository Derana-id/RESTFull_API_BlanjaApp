const { v4: uuidv4 } = require('uuid');
const Sequelize = require('sequelize');
const { success, failed } = require('../helpers/response');
const Product = require('../models/product.js');
const Store = require('../models/store.js');
const Brand = require('../models/product_brand');
const Category = require('../models/category');
const ProductColor = require('../models/product_color');
const ProductImage = require('../models/product_image');
const ProductSize = require('../models/product_size');
const pagination = require('../utils/pagination');
const uploadGoogleDrive = require('../utils/uploadGoogleDrive');
const deleteGoogleDrive = require('../utils/deleteGoogleDrive');
const deleteFile = require('../utils/deleteFile');
const Op = Sequelize.Op;
const db = require('../config/pg');
const { QueryTypes } = require('sequelize');

module.exports = {
  getAllProduct: async (req, res) => {
    try {
      let { page, limit, search, sort, sortType } = req.query;

      page = Number(page) || 1;
      limit = Number(limit) || 10;

      sort = sort || 'product_name';
      sortType = sortType || 'ASC';
      const condition = search
        ? {
            product_name: { [Op.iLike]: `%${search}%` },
          }
        : null;
      const offset = (page - 1) * limit;

      const product = await Product.findAndCountAll({
        where: condition,
        order: [[`${sort}`, `${sortType}`]],
        limit,
        offset,
      });

      if (!product.count) {
        return failed(res, {
          code: 404,
          message: 'Product Not Found',
          error: 'Not Found',
        });
      }

      let getData = [];
      const data = await Promise.all(
        product.rows.map(async (item) => {
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

          const size = await ProductSize.findAll({
            where: {
              product_id: item.id,
            },
          });

          const store = await Store.findAll({
            where: {
              id: item.store_id,
            },
          });

          const brand = await Brand.findAll({
            where: {
              id: item.brand_id,
            },
          });

          const category = await Category.findAll({
            where: {
              id: item.category_id,
            },
          });

          const obj = {
            store,
            product: item,
            brand,
            category,
            color,
            image,
            size,
          };

          return getData.push(obj);
        })
      );

      const paging = pagination(product.count, page, limit);
      return success(res, {
        code: 200,
        message: `Success get all product`,
        data: getData,
        pagination: paging.response,
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  getProductByUser: async (req, res) => {
    try {
      const { id } = req.APP_DATA.tokenDecoded;

      const store = await Store.findAll({
        where: {
          user_id: id,
        },
      });

      const product = await Product.findAll({
        where: {
          store_id: store[0].id,
        },
      });

      if (!product.length) {
        return failed(res, {
          code: 404,
          message: `Product by id ${id} not found`,
          error: 'Not Found',
        });
      }

      let getData = [];
      const data = await Promise.all(
        product.map(async (item) => {
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

          const size = await ProductSize.findAll({
            where: {
              product_id: item.id,
            },
          });

          const store = await Store.findAll({
            where: {
              id: item.store_id,
            },
          });

          const brand = await Brand.findAll({
            where: {
              id: item.brand_id,
            },
          });

          const category = await Category.findAll({
            where: {
              id: item.category_id,
            },
          });

          const obj = {
            store,
            product: item,
            brand,
            category,
            color,
            image,
            size,
          };

          return getData.push(obj);
        })
      );

      success(res, {
        code: 200,
        message: `Success get product by user`,
        data: getData,
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

      const color = await ProductColor.findAll({
        where: {
          product_id: id,
        },
      });

      const image = await ProductImage.findAll({
        where: {
          product_id: id,
        },
      });

      const size = await ProductSize.findAll({
        where: {
          product_id: id,
        },
      });

      const store = await Store.findAll({
        where: {
          id: product[0].store_id,
        },
      });

      const brand = await Brand.findAll({
        where: {
          id: product[0].brand_id,
        },
      });

      const category = await Category.findAll({
        where: {
          id: product[0].category_id,
        },
      });

      success(res, {
        code: 200,
        message: `Success get product by id ${id}`,
        data: {
          store,
          product: product[0],
          brand,
          category,
          color,
          image,
          size,
        },
      });
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
        store_id: store[0].id,
        category_id,
        product_name,
        brand_id,
        price,
        is_new,
        description,
        stock,
        rating,
        is_active: 1,
      };

      await Product.create(product);

      // Add Product Color
      const { product_color } = req.body;
      // const dataColor = JSON.parse(product_color);
      if (product_color) {
        product_color.map(async (item) => {
          await ProductColor.create({
            id: uuidv4(),
            product_id: id,
            ...item,
          });
        });
      }

      // Add Product Size
      // const { size } = req.body;
      // let getSize;
      // if (size <= 50 && size >= 41) {
      //   getSize = 'XL';
      // } else if (size <= 40 && size >= 31) {
      //   getSize = 'L';
      // } else if (size <= 30 && size >= 26) {
      //   getSize = 'M';
      // } else if (size <= 25 && size >= 21) {
      //   getSize = 'S';
      // } else if (size <= 20 && size >= 16) {
      //   getSize = 'XS';
      // } else {
      //   getSize = 'M';
      // }

      const { product_size } = req.body;
      // const dataSize = JSON.parse(product_size);
      if (product_size) {
        product_size.map(async (item) => {
          // console.log(item.size);
          await ProductSize.create({
            id: uuidv4(),
            product_id: id,
            size: item.size,
          });
        });
      }

      // Add Product Image
      if (req.files) {
        if (req.files.photo) {
          req.files.photo.map(async (item) => {
            // upload new image to google drive
            const photoGd = await uploadGoogleDrive(item);
            await ProductImage.create({
              id: uuidv4(),
              product_id: id,
              photo: photoGd.id,
            });
            // remove photo after upload
            deleteFile(item.path);
          });
        }
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

      const product = await Product.findByPk(id);

      if (!product) {
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
      } = req.body;

      const data = {
        category_id,
        product_name,
        brand_id,
        price,
        is_new,
        description,
        stock,
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
      if (req.files) {
        if (req.files.photo) {
          await ProductImage.destroy({
            where: {
              product_id: id,
            },
          });
          await deleteGoogleDrive(product[0].photo);
          req.files.photo.map(async (item) => {
            // upload new image to google drive
            const photoGd = await uploadGoogleDrive(item);
            product_image.map(async (item) => {
              await ProductImage.create({
                id: uuidv4(),
                product_id: id,
                photo: photoGd.id,
              });

              // remove photo after upload
              deleteFile(item.path);
            });
          });
        }
      }
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

      const product = await Product.findByPk(id);

      if (!product) {
        return failed(res, {
          code: 404,
          message: `Product by id ${id} not found`,
          error: 'Not Found',
        });
      }

      await Product.update(
        {
          is_active: 0,
        },
        {
          where: {
            id,
          },
        }
      );

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
  filter: async (req, res) => {
    try {
      const { color, size, category, brand } = req.body;
      const getColor = color.map((e) => "'" + e + "'").toString();
      const getSize = size.map((e) => "'" + e + "'").toString();
      const getCategory = category.map((e) => "'" + e + "'").toString();
      const getBrand = brand.map((e) => "'" + e + "'").toString();

      let { page, limit } = req.query;

      page = Number(page) || 1;
      limit = Number(limit) || 15;

      const offset = (page - 1) * limit;

      const filterPage = await db.query(
        `
        SELECT product.id, product.product_name, product.price,
        (
        SELECT product_image.photo FROM product_image
          WHERE product_image.product_id = product.id
          LIMIT 1
        ) AS photo
        FROM product
        INNER JOIN category ON product.category_id = category.id
        INNER JOIN product_brand ON product.brand_id = product_brand.id
        INNER JOIN product_color ON product.id = product_color.product_id
        INNER JOIN product_image ON product.id = product_image.product_id
        INNER JOIN product_size ON product.id = product_size.product_id
        WHERE
        product_color.color_name IN (${getColor})
        OR product_size.size IN (${getSize})
        OR product_brand.brand_name IN (${getCategory})
        OR category.category_name IN (${getBrand})
        AND (product.is_active = 1)
        GROUP BY product.id, product.product_name, product.price
        `,
        {
          type: QueryTypes.SELECT,
        }
      );

      const filter = await db.query(
        `
        SELECT product.id, product.product_name, product.price,
        (
        SELECT product_image.photo FROM product_image
          WHERE product_image.product_id = product.id
          LIMIT 1
        ) AS photo
        FROM product
        INNER JOIN category ON product.category_id = category.id
        INNER JOIN product_brand ON product.brand_id = product_brand.id
        INNER JOIN product_color ON product.id = product_color.product_id
        INNER JOIN product_image ON product.id = product_image.product_id
        INNER JOIN product_size ON product.id = product_size.product_id
        WHERE
        product_color.color_name IN (${getColor})
        OR product_size.size IN (${getSize})
        OR product_brand.brand_name IN (${getCategory})
        OR category.category_name IN (${getBrand})
        AND (product.is_active = 1)
        GROUP BY product.id, product.product_name, product.price
        LIMIT ${limit}
        OFFSET ${offset}
        `,
        {
          type: QueryTypes.SELECT,
        }
      );

      const paging = pagination(filterPage.length, page, limit);
      return success(res, {
        code: 200,
        message: `Success get all product`,
        data: filter,
        pagination: paging.response,
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
