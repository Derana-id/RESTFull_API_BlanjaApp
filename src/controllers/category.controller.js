const Category = require('../models/category');
const { v4: uuidv4 } = require('uuid');
const { success, failed } = require('../helpers/response');

module.exports = {
  getAllCategory: async (req, res) => {
    try {
      const result = await Category.findAll();
      return success(res, {
        code: 200,
        message: `Success get all category`,
        data: result,
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
      const data = {
        is_active: isActive,
      };
      const result = await Category.update(data, {
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
      let message;
      if (isActive === 1) {
        message = 'active category';
      } else {
        message = 'delete category';
      }
      return success(res, {
        code: 200,
        message: `Success ${message}`,
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
