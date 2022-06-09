const ProductBrand = require('../models/product_brand');
const { v4: uuidv4 } = require('uuid');
const { success, failed } = require('../helpers/response');

module.exports = {
  getAllBrand: async (req, res) => {
    try {
      const result = await ProductBrand.findAll();
      return success(res, {
        code: 200,
        message: `Success get all Brand`,
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
      const { isActive } = req.body;
      const data = {
        is_active: isActive,
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
      let message;
      if (isActive === 1) {
        message = 'active brand';
      } else {
        message = 'delete brand';
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
