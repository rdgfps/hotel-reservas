const usuarioService = require('../services/usuarioService');

const usuarioController = {
  async listar(req, res, next) {
    try {
      const usuarios = await usuarioService.listar();
      res.json({ success: true, data: usuarios });
    } catch (err) {
      next(err);
    }
  },

  async criar(req, res, next) {
    try {
      const usuario = await usuarioService.criar(req.body);
      res.status(201).json({ success: true, data: usuario });
    } catch (err) {
      next(err);
    }
  },

  async ativar(req, res, next) {
    try {
      const usuario = await usuarioService.ativar(req.params.codigo);
      res.json({ success: true, data: usuario });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = usuarioController;
