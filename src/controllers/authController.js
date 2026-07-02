const authService = require('../services/authService');

const authController = {
  async login(req, res, next) {
    try {
      const resultado = await authService.login(req.body);
      res.json({ success: true, data: resultado });
    } catch (err) {
      next(err);
    }
  },

  async solicitarRecuperacao(req, res, next) {
    try {
      const resultado = await authService.solicitarRecuperacao(req.body);
      res.json({ success: true, data: resultado });
    } catch (err) {
      next(err);
    }
  },

  async alterarSenhaRecuperacao(req, res, next) {
    try {
      const resultado = await authService.alterarSenhaRecuperacao(req.body);
      res.json({ success: true, data: resultado });
    } catch (err) {
      next(err);
    }
  },

  async alterarSenha(req, res, next) {
    try {
      const resultado = await authService.alterarSenha(req.usuario.id, req.body);
      res.json({ success: true, data: resultado });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
