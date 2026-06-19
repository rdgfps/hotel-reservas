const db = require('../config/database');
const Reserva = require('../models/Reserva');
const Cliente = require('../models/Cliente');
const Quarto = require('../models/Quarto');
const logService = require('./logService');
const { reservaSchema } = require('../validations/reservaValidation');
const { validar } = require('../validations/validationError');

const reservaService = {
  async listar() {
    return await Reserva.findAll();
  },

  async buscarPorId(id) {
    const reserva = await Reserva.findById(id);
    if (!reserva) {
      const erro = new Error('Reserva nao encontrada.');
      erro.status = 404;
      throw erro;
    }
    return reserva;
  },

  async criar(dados) {
    const { cliente_id, quarto_id, data_entrada, data_saida, status } = validar(reservaSchema, dados);

    return await db.$transaction(async (tx) => {
      const cliente = await Cliente.findById(cliente_id, tx);
      if (!cliente) {
        const erro = new Error(`Cliente com ID ${cliente_id} nao encontrado.`);
        erro.status = 404;
        throw erro;
      }

      const quarto = await Quarto.findById(quarto_id, tx);
      if (!quarto) {
        const erro = new Error(`Quarto com ID ${quarto_id} nao encontrado.`);
        erro.status = 404;
        throw erro;
      }

      const conflitos = await Reserva.findConflito(
        quarto_id,
        data_entrada,
        data_saida,
        null,
        tx
      );

      if (conflitos.length > 0) {
        const erro = new Error(`O quarto ${quarto.numero} ja possui uma reserva nesse periodo.`);
        erro.status = 409;
        throw erro;
      }

      return await Reserva.create(
        { cliente_id, quarto_id, data_entrada, data_saida, status },
        tx
      );
    });
  },

  async atualizar(id, dados) {
    await reservaService.buscarPorId(id);
    const { cliente_id, quarto_id, data_entrada, data_saida, status } = validar(reservaSchema, dados);

    const conflitos = await Reserva.findConflito(quarto_id, data_entrada, data_saida, id);
    if (conflitos.length > 0) {
      const erro = new Error('O quarto ja possui outra reserva nesse periodo.');
      erro.status = 409;
      throw erro;
    }

    return await Reserva.update(id, { cliente_id, quarto_id, data_entrada, data_saida, status });
  },

  async excluir(id, usuarioId) {
    return await db.$transaction(async (tx) => {
      const reserva = await Reserva.findById(id, tx);
      if (!reserva) {
        const erro = new Error('Reserva nao encontrada.');
        erro.status = 404;
        throw erro;
      }

      await Reserva.delete(id, tx);

      if (reserva.status === 'PG') {
        await logService.registrar(
          {
            descricao: 'Acao suspeita',
            complemento: `Exclusao da reserva paga #${reserva.id}.`,
            usuarioId,
          },
          tx
        );
      }

      return reserva;
    });
  },
};

module.exports = reservaService;
