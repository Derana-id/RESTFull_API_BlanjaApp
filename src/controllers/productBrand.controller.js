const ProductBrand = require('../models/product_brand');
const { v4: uuidv4 } = require('uuid');
const { success, failed } = require('../helpers/response');
const deleteFile = require('../utils/deleteFile');
const Sequelize = require('sequelize');
const pagination = require('../utils/pagination');

module.exports = {
  getPublicBrand: async (req, res) => {
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
      const active = condition
        ? { is_active: 1, ...condition }
        : { is_active: 1 };
      const offset = (page - 1) * limit;
      const result = await ProductBrand.findAndCountAll({
        where: active,
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
          is_active: 1,
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
      const { isActive } = req.body;

      const checkIsactive = await ProductBrand.findAll({
        where: {
          id: id,
        },
      });

      if (!checkIsactive.length) {
        return failed(res, {
          code: 409,
          message: 'Id not found',
          error: 'Delete brand Failed',
        });
      }

      if (checkIsactive[0].is_active == isActive) {
        if (isActive == 1) {
          return failed(res, {
            code: 409,
            message: `Brand with id ${id} have been active`,
            error: 'Delete Failed',
          });
        } else {
          return failed(res, {
            code: 409,
            message: `Brand with id ${id} have been non active`,
            error: 'Delete Failed',
          });
        }
      }

      const data = {
        is_active: isActive,
      };
      const result = await ProductBrand.update(data, {
        where: {
          id: id,
        },
      });

      if (isActive == 0) {
        return success(res, {
          code: 200,
          message: `Success delete brand with id ${id}`,
          data: [],
        });
      } else {
        return success(res, {
          code: 200,
          message: `Success active brand with id ${id}`,
          data: [],
        });
      }
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
};
