const authService = require('../services/authService');

const authController = {
  async login(req, res, next) {
    try {
      const usuario = await authService.login(req.body);
      res.json({ success: true, data: usuario });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
