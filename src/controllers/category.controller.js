const Category = require('../models/category');
const { v4: uuidv4 } = require('uuid');
const { success, failed } = require('../helpers/response');
const deleteFile = require('../utils/deleteFile');
const Sequelize = require('sequelize');
const pagination = require('../utils/pagination');

module.exports = {
  getPublicCategory: async (req, res) => {
    try {
      const Op = Sequelize.Op;
      let { page, limit, search, sort, sortType } = req.query;
      page = Number(page) || 1;
      limit = Number(limit) || 10;
      sort = sort || 'category_name';
      sortType = sortType || 'ASC';

      const condition = search
        ? {
            category_name: { [Op.iLike]: `%${search}%` },
          }
        : null;
      const active = condition
        ? { is_active: 1, ...condition }
        : { is_active: 1 };
      const offset = (page - 1) * limit;

      const result = await Category.findAndCountAll({
        where: active,
        order: [[`${sort}`, `${sortType}`]],
        limit,
        offset,
      });

      if (!result.count) {
        return failed(res, {
          code: 404,
          message: 'Category Not Found',
          error: 'Not Found',
        });
      }

      const paging = pagination(result.count, page, limit);
      return success(res, {
        code: 200,
        message: `Success get all category`,
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
  getAllCategory: async (req, res) => {
    try {
      const Op = Sequelize.Op;
      let { page, limit, search, sort, sortType } = req.query;
      page = Number(page) || 1;
      limit = Number(limit) || 10;
      sort = sort || 'category_name';
      sortType = sortType || 'ASC';

      const condition = search
        ? {
            category_name: { [Op.iLike]: `%${search}%` },
          }
        : null;

      const offset = (page - 1) * limit;

      const result = await Category.findAndCountAll({
        where: condition,
        order: [[`${sort}`, `${sortType}`]],
        limit,
        offset,
      });

      if (!result.count) {
        return failed(res, {
          code: 404,
          message: 'Category Not Found',
          error: 'Not Found',
        });
      }

      const paging = pagination(result.count, page, limit);
      return success(res, {
        code: 200,
        message: `Success get all category`,
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
  getCategoryId: async (req, res) => {
    try {
      const result = await Category.findAll({
        where: {
          id: req.params.id,
          is_active: 1,
        },
      });
      if (!result.length) {
        return failed(res, {
          code: 409,
          message: 'Id not found',
          error: 'Get category Failed',
        });
      }
      return success(res, {
        code: 200,
        message: `Success get category by id`,
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
  insertCategory: async (req, res) => {
    try {
      const id = uuidv4();
      const { categoryName } = req.body;
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
        category_name: categoryName,
        photo: image,
        is_active: 1,
      };
      const result = await Category.create(data);
      return success(res, {
        code: 200,
        message: `Success insert category`,
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
  updateCategory: async (req, res) => {
    try {
      const id = req.params.id;
      const { categoryName } = req.body;
      const dataPhoto = await Category.findByPk(id);
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
        deleteFile(`public/uploads/categories/${getPhoto}`);
      } else {
        image = getPhoto;
      }
      const data = {
        category_name: categoryName,
        photo: image,
        is_active: 1,
      };
      const result = await Category.update(data, {
        where: {
          id: id,
        },
      });
      return success(res, {
        code: 200,
        message: `Success update category`,
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
  deleteCategory: async (req, res) => {
    try {
      const id = req.params.id;
      const { isActive } = req.body;

      const checkIsactive = await Category.findAll({
        where: {
          id: id,
        },
      });

      if (!checkIsactive.length) {
        return failed(res, {
          code: 409,
          message: 'Id not found',
          error: 'Delete category Failed',
        });
      }

      if (checkIsactive[0].is_active == isActive) {
        if (isActive == 1) {
          return failed(res, {
            code: 409,
            message: `Category with id ${id} have been active`,
            error: 'Delete Failed',
          });
        } else {
          return failed(res, {
            code: 409,
            message: `Category with id ${id} have been non active`,
            error: 'Delete Failed',
          });
        }
      }

      const data = {
        is_active: isActive,
      };
      const result = await Category.update(data, {
        where: {
          id: id,
        },
      });

      if (isActive == 0) {
        return success(res, {
          code: 200,
          message: `Success delete category with id ${id}`,
          data: [],
        });
      } else {
        return success(res, {
          code: 200,
          message: `Success active category with id ${id}`,
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
