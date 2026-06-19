const clienteService = require('../services/clienteService');
const emailService = require('../services/emailService');

const clienteController = {
  async listar(req, res, next) {
    try {
      const clientes = await clienteService.listar();
      res.json({ success: true, data: clientes });
    } catch (err) {
      next(err);
    }
  },

  async buscarPorId(req, res, next) {
    try {
      const cliente = await clienteService.buscarPorId(req.params.id);
      res.json({ success: true, data: cliente });
    } catch (err) {
      next(err);
    }
  },

  async criar(req, res, next) {
    try {
      const cliente = await clienteService.criar(req.body);
      res.status(201).json({ success: true, data: cliente });
    } catch (err) {
      next(err);
    }
  },

  async atualizar(req, res, next) {
    try {
      const cliente = await clienteService.atualizar(req.params.id, req.body);
      res.json({ success: true, data: cliente });
    } catch (err) {
      next(err);
    }
  },

  async excluir(req, res, next) {
    try {
      const cliente = await clienteService.excluir(req.params.id);
      res.json({ success: true, message: 'Cliente excluido.', data: cliente });
    } catch (err) {
      next(err);
    }
  },

  async enviarRelatorio(req, res, next) {
    try {
      const resultado = await emailService.enviarRelatorio(req.params.id);
      res.json({ success: true, message: 'Relatorio enviado.', data: resultado });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = clienteController;
