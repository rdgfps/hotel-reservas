const quartoService = require('../services/quartoService');

const quartoController = {
  async listar(req, res, next) {
    try {
      const quartos = await quartoService.listar();
      res.json({ success: true, data: quartos });
    } catch (err) {
      next(err);
    }
  },

  async buscarPorId(req, res, next) {
    try {
      const quarto = await quartoService.buscarPorId(req.params.id);
      res.json({ success: true, data: quarto });
    } catch (err) {
      next(err);
    }
  },

  async criar(req, res, next) {
    try {
      const quarto = await quartoService.criar(req.body);
      res.status(201).json({ success: true, data: quarto });
    } catch (err) {
      next(err);
    }
  },

  async atualizar(req, res, next) {
    try {
      const quarto = await quartoService.atualizar(req.params.id, req.body);
      res.json({ success: true, data: quarto });
    } catch (err) {
      next(err);
    }
  },

  async excluir(req, res, next) {
    try {
      const quarto = await quartoService.excluir(req.params.id);
      res.json({ success: true, message: 'Quarto excluido.', data: quarto });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = quartoController;
