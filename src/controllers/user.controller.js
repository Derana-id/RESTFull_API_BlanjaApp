const User = require('../models/user.model');
const { success, failed } = require('../helpers/response');

module.exports = {
  getUserById: async (req, res) => {
    try {
      const user = await User.findAll({
        where: {
          id: req.params.id,
        },
      });
      return success(res, {
        code: 200,
        message: `Success get user by id`,
        data: user.rows,
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
