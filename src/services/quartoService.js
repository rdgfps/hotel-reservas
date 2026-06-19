const Quarto = require('../models/Quarto');
const { quartoSchema } = require('../validations/quartoValidation');
const { validar } = require('../validations/validationError');

const quartoService = {
  async listar() {
    return await Quarto.findAll();
  },

  async buscarPorId(id) {
    const quarto = await Quarto.findById(id);
    if (!quarto) {
      const erro = new Error('Quarto nao encontrado.');
      erro.status = 404;
      throw erro;
    }
    return quarto;
  },

  async criar(dados) {
    const { numero, tipo } = validar(quartoSchema, dados);

    const existente = await Quarto.findByNumero(numero);
    if (existente) {
      const erro = new Error(`Ja existe um quarto cadastrado com o numero ${numero}.`);
      erro.status = 409;
      throw erro;
    }

    return await Quarto.create({ numero, tipo });
  },

  async atualizar(id, dados) {
    await quartoService.buscarPorId(id);
    const { numero, tipo } = validar(quartoSchema, dados);

    const existente = await Quarto.findByNumero(numero);
    if (existente && existente.id !== parseInt(id)) {
      const erro = new Error(`Ja existe outro quarto com o numero ${numero}.`);
      erro.status = 409;
      throw erro;
    }

    return await Quarto.update(id, { numero, tipo });
  },

  async excluir(id) {
    await quartoService.buscarPorId(id);

    try {
      return await Quarto.delete(id);
    } catch (err) {
      if (err.code === 'P2003') {
        const erro = new Error('Nao e possivel excluir este quarto porque ele possui reservas cadastradas.');
        erro.status = 409;
        throw erro;
      }

      throw err;
    }
  },
};

module.exports = quartoService;
