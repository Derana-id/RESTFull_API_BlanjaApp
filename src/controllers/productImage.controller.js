const ProductImage = require('../models/product_image');
const { success, failed } = require('../helpers/response');
const deleteGoogleDrive = require('../utils/deleteGoogleDrive');
const deleteFile = require('../utils/deleteFile');

module.exports = {
  deleteImage: async (req, res) => {
    try {
      const id = req.params.id;

      const checkImage = ProductImage.findAll({
        where: {
          id: id,
        },
      });

      if (!checkImage.length) {
        return failed(res, {
          code: 404,
          message: 'Id not found',
          error: 'Delete Failed',
        });
      }

      const photo = checkImage[0].photo;
      if (photo) {
        deleteGoogleDrive(photo);
        deleteFile(req.file.path);
      }

      await ProductImage.destroy({
        where: {
          id,
        },
      });

      return success(res, {
        code: 200,
        message: 'Success delete product image',
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
