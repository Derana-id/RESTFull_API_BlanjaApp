const ProductImage = require('../models/product_image');
const { success, failed } = require('../helpers/response');

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
          code: 409,
          message: 'Id not found',
          error: 'Delete Failed',
        });
      }

      await ProductImage.destroy({
        where: {
          id,
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
};
