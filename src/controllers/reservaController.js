const reservaService = require('../services/reservaService');

const reservaController = {
  async listar(req, res, next) {
    try {
      const reservas = await reservaService.listar();
      res.json({ success: true, data: reservas });
    } catch (err) {
      next(err);
    }
  },

  async buscarPorId(req, res, next) {
    try {
      const reserva = await reservaService.buscarPorId(req.params.id);
      res.json({ success: true, data: reserva });
    } catch (err) {
      next(err);
    }
  },

  async criar(req, res, next) {
    try {
      const reserva = await reservaService.criar(req.body);
      res.status(201).json({ success: true, data: reserva });
    } catch (err) {
      next(err);
    }
  },

  async atualizar(req, res, next) {
    try {
      const reserva = await reservaService.atualizar(req.params.id, req.body);
      res.json({ success: true, data: reserva });
    } catch (err) {
      next(err);
    }
  },

  async excluir(req, res, next) {
    try {
      const usuarioId = req.query.usuarioId || req.body.usuarioId;
      const reserva = await reservaService.excluir(req.params.id, usuarioId);
      res.json({ success: true, message: 'Reserva excluida.', data: reserva });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = reservaController;
