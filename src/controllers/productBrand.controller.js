const ProductBrand = require('../models/product_brand');
const { v4: uuidv4 } = require('uuid');
const { success, failed } = require('../helpers/response');
const deleteFile = require('../utils/deleteFile');
const Sequelize = require('sequelize');
const pagination = require('../utils/pagination');

module.exports = {
  getAllBrand: async (req, res) => {
    try {
      const Op = Sequelize.Op;
      let { page, limit, search, sort, sortType } = req.query;
      page = Number(page) || 1;
      limit = Number(limit) || 10;
      sort = sort || 'brand_name';
      sortType = sortType || 'ASC';
      const condition = search
        ? {
            brand_name: { [Op.iLike]: `%${search}%` },
          }
        : null;
      const offset = (page - 1) * limit;
      const result = await ProductBrand.findAndCountAll({
        where: condition,
        order: [[`${sort}`, `${sortType}`]],
        limit,
        offset,
      });
      if (!result.count) {
        return failed(res, {
          code: 404,
          message: 'Brand Not Found',
          error: 'Not Found',
        });
      }
      const paging = pagination(result.count, page, limit);
      return success(res, {
        code: 200,
        message: `Success get all brand`,
        data: result.rows,
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
  getBrandId: async (req, res) => {
    try {
      const result = await ProductBrand.findAll({
        where: {
          id: req.params.id,
        },
      });
      if (!result.length) {
        return failed(res, {
          code: 409,
          message: 'Id not found',
          error: 'Get Brand Failed',
        });
      }
      return success(res, {
        code: 200,
        message: `Success get Brand by id`,
        data: result[0],
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  insertBrand: async (req, res) => {
    try {
      const id = uuidv4();
      const { brandName } = req.body;
      if (!req.file) {
        failed(res, {
          code: 409,
          message: 'Image is required',
          error: 'Insert Failed',
        });
        return;
      }
      const image = req.file.filename;
      const data = {
        id: id,
        brand_name: brandName,
        photo: image,
        is_active: 1,
      };
      const result = await ProductBrand.create(data);
      return success(res, {
        code: 200,
        message: `Success insert Brand`,
        data: data,
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  updateBrand: async (req, res) => {
    try {
      const id = req.params.id;
      const { brandName } = req.body;
      const dataPhoto = await ProductBrand.findByPk(id);
      // console.log(dataPhoto.dataValues);
      if (!dataPhoto.dataValues) {
        return failed(res, {
          code: 409,
          message: 'Id not found',
          error: 'Update Failed',
        });
      }
      const getPhoto = dataPhoto.dataValues.photo;
      let image;
      if (req.file) {
        image = req.file.filename;
        deleteFile(`public/uploads/brands/${getPhoto}`);
      } else {
        image = getPhoto;
      }
      const data = {
        brand_name: brandName,
        photo: image,
        is_active: 1,
      };
      const result = await ProductBrand.update(data, {
        where: {
          id: id,
        },
      });
      return success(res, {
        code: 200,
        message: `Success update Brand`,
        data: data,
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  deleteBrand: async (req, res) => {
    try {
      const id = req.params.id;
      const data = {
        is_active: 0,
      };
      const result = await ProductBrand.update(data, {
        where: {
          id: id,
        },
      });
      if (!result.length) {
        return failed(res, {
          code: 409,
          message: 'Id not found',
          error: 'Delete Failed',
        });
      }
      return success(res, {
        code: 200,
        message: `Success delete brand`,
        data: [],
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
