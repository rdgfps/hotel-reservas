const logService = require('../services/logService');

const logController = {
  async listar(req, res, next) {
    try {
      const logs = await logService.listar();
      res.json({ success: true, data: logs });
    } catch (err) {
      next(err);
    }
  },

  async pesquisarPorUsuario(req, res, next) {
    try {
      const usuarioId = req.params.usuarioId || req.query.usuarioId;
      const logs = await logService.pesquisarPorUsuario(usuarioId);
      res.json({ success: true, data: logs });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = logController;
